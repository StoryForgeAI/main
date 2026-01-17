import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import os from "os";
import { createClient } from '@supabase/supabase-js';

const execPromise = promisify(exec);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Supabase Admin a szerver oldali levonáshoz
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { voice, bgVideo, subStyle, prompt, removeWatermark, userId } = await req.json();

    // 1. KREDIT ELLENŐRZÉS (Alap 25 + Vízjel eltávolítás 10 = max 35)
    const totalCost = 25 + (removeWatermark ? 10 : 0);
    
    const { data: userData } = await supabaseAdmin.from('users').select('credits').eq('id', userId).single();
    if (!userData || userData.credits < totalCost) {
      return NextResponse.json({ error: "Insufficient credits!" }, { status: 403 });
    }

    // 2. CHATGPT - VIRAL HOOK & VOICEOVER GENERATION
    const gpt = await openai.chat.completions.create({
      model: "gpt-4o", // A 4o sokkal jobb hookokat ír
      messages: [
        { 
          role: "system", 
          content: `You are a viral content creator. Write a short, high-energy video script (max 80 words) in English. 
          STRUCTURE:
          - Start with a CRAZY HOOK that stops the scroll immediately (use words like 'Nobody tells you...', 'Stop doing this...', 'I found a secret...').
          - Follow with fast-paced, engaging information.
          - End with a quick call to action.
          - Tone: Suspenseful, exciting, and professional.` 
        }, 
        { role: "user", content: `Topic: ${prompt}` }
      ],
    });
    const text = gpt.choices[0].message.content || "";

    // 3. KREDIT LEVONÁSA
    await supabaseAdmin.from('users').update({ credits: userData.credits - totalCost }).eq('id', userId);

    // 4. TTS (Audio generálás)
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice || "onyx",
      input: text,
    });

    const audioBuffer = Buffer.from(await mp3.arrayBuffer());
    const tempAudioPath = path.join(os.tmpdir(), `audio-${Date.now()}.mp3`);
    fs.writeFileSync(tempAudioPath, audioBuffer);

    // 5. WHISPER (Felirat időzítés)
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempAudioPath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"]
    });

    // 6. ASS FELIRAT GENERÁLÁS (A te stílusaid alapján)
    const formatTime = (seconds: number) => {
      const date = new Date(seconds * 1000);
      return `${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2,'0')}:${date.getUTCSeconds().toString().padStart(2,'0')}.${Math.floor(date.getUTCMilliseconds()/10).toString().padStart(2,'0')}`;
    };

    let highlightColor = "&H0000FF00&"; // Alapzöld
    if (subStyle === "banger_yellow") highlightColor = "&H0000FFFF&";
    if (subStyle === "banger_red") highlightColor = "&H000000FF&";

    const assSubtitlesPath = path.join(os.tmpdir(), `subs-${Date.now()}.ass`);
    const assHeader = `[Script Info]\nScriptType: v4.00+\nPlayResX: 640\nPlayResY: 1138\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Arial,70,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,2,0,1,5,2,5,10,10,60,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;

    let assEvents = "";
    const words = transcription.words || [];
    for (let i = 0; i < words.length; i += 2) {
      const group = words.slice(i, i + 2);
      const startTime = formatTime(group[0].start);
      const endTime = formatTime(group[group.length - 1].end);
      let lineText = "{\\pos(320,600)}";
      group.forEach((w: any, index: number) => {
        const wordText = w.word.toUpperCase();
        const wordDurationMs = Math.round((w.end - w.start) * 1000);
        const relativeStartMs = Math.round((w.start - group[0].start) * 1000);
        lineText += `{\\t(${relativeStartMs},${relativeStartMs + 100},\\c${highlightColor}\\fscx120\\fscy120)}{\\t(${relativeStartMs + wordDurationMs},${relativeStartMs + wordDurationMs + 50},\\c&H00FFFFFF&\\fscx100\\fscy100)}${wordText}${index === 0 ? " " : ""}`;
      });
      assEvents += `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${lineText}\n`;
    }
    fs.writeFileSync(assSubtitlesPath, assHeader + assEvents);

    // 7. FFMPEG RENDER
    const escapedAssPath = assSubtitlesPath.replace(/\\/g, '/').replace(/:/g, '\\:');
    const outputFileName = `storyforge-${Date.now()}.mp4`;
    const outputPath = path.join(process.cwd(), "public", outputFileName);
    const inputVideoPath = path.join(process.cwd(), "public", bgVideo);

    const watermarkCmd = removeWatermark 
      ? "" 
      : `,drawtext=text='STORYFORGE AI':fontcolor=white@0.2:fontsize=70:x=(w-tw)/2:y=200`;

    const ffmpegCmd = `ffmpeg -y -i "${inputVideoPath}" -i "${tempAudioPath}" -vf "ass='${escapedAssPath}'${watermarkCmd}" -map 0:v:0 -map 1:a:0 -shortest -c:v libx264 -preset fast -pix_fmt yuv420p "${outputPath}"`;

    await execPromise(ffmpegCmd);

    // Takarítás
    try { fs.unlinkSync(tempAudioPath); fs.unlinkSync(assSubtitlesPath); } catch {}

    return NextResponse.json({ success: true, videoUrl: `/${outputFileName}` });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}