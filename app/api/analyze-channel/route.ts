import { NextResponse } from "next/server";
import OpenAI from "openai";
import { execSync } from "child_process";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Windows elérési út a yt-dlp-hez
const YTDLP_PATH = "C:\\Users\\sarko\\Desktop\\ffmpeg-8.0.1-essentials_build\\bin\\yt-dlp.exe";

export async function POST(req: Request) {
  try {
    const { channelUrl, duration, userId } = await req.json();

    if (!channelUrl) {
      return NextResponse.json({ error: "Channel URL is required" }, { status: 400 });
    }

    console.log(`⏳ Analyzing channel: ${channelUrl}`);

    // 1. Az utolsó 5 videó adatainak lekérése yt-dlp-vel
    // --playlist-items 1-5: csak az első 5 videó
    // --print: kiírja a címet és a leírást
    let channelMetadata = "";
    try {
      const cmd = `"${YTDLP_PATH}" --playlist-items 1-5 --get-title --get-description --no-warnings --no-check-certificate --flat-playlist "${channelUrl}"`;
      const output = execSync(cmd).toString().trim();
      channelMetadata = output;
    } catch (e: any) {
      console.error("⚠️ Metadata extraction failed or channel not found.");
      return NextResponse.json({ error: "Could not fetch channel data. Make sure the URL is correct." }, { status: 500 });
    }

    // 2. GPT-4 Prompt összeállítása
    console.log("🤖 AI Strategy generation starting...");
    
  const prompt = `
      You are a world-class Social Media Strategist and YouTube Growth Expert. 
      I will provide you with the latest content data (titles and descriptions) from a YouTube channel.
      
      CHANNEL DATA TO ANALYZE:
      ${channelMetadata.substring(0, 3000)}

      YOUR TASK:
      1. Analyze the niche, common themes, and the "secret sauce" of this channel.
      2. Create a detailed ${duration}-day content roadmap for the user to compete in or dominate this niche.
      3. For EACH scheduled day, provide:
         - A VIRAL TITLE (High CTR focused).
         - A HOOK (The exact script for the first 5 seconds).
         - AN OUTLINE (3-5 key points for the video body).
         - TAGS & MUSIC STYLE (Relevant to the vibe).

      STRICT FORMATTING RULES FOR PLAIN TEXT (.TXT) OUTPUT:
      - DO NOT USE any Markdown characters: NO asterisks (**), NO underscores (__), NO hashtags (#) for headers.
      - Use ONLY plain text and simple capitalization for emphasis.
      - Use dashes (-) for bullet points.
      - Use clear dividers like "====================" or "--------------------" between sections.
      - The result must be 100% readable in a simple Windows Notepad without any weird symbols.

      STRUCTURE YOUR RESPONSE LIKE THIS:

      CHANNEL ANALYSIS REPORT
      ====================
      (Niche summary here)

      STRATEGY OVERVIEW
      --------------------
      (General advice here)

      CONTENT SCHEDULE (${duration} DAYS)
      ====================
      
      DAY 1: [TITLE HERE]
      - Hook: [Script here]
      - Outline: [Body points here]
      - Music/Tags: [Style here]

      (Continue for all days...)
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // A 4o jobb stratégiában, mint a mini, de használhatod a mini-t is spóroláshoz
      messages: [
        { role: "system", content: "You are a helpful AI that generates YouTube growth strategies." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const strategyPlan = completion.choices[0].message.content;

    if (!strategyPlan) {
      throw new Error("AI failed to generate a plan.");
    }

    console.log("✅ Analysis complete!");

    // Visszaküldjük a tervet a frontendnek
    return NextResponse.json({ 
      plan: strategyPlan,
      success: true 
    });

  } catch (error: any) {
    console.error("❌ Analyze Error:", error.message);
    return NextResponse.json({ error: "Failed to analyze channel: " + error.message }, { status: 500 });
  }
}