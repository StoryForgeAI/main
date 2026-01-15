import { NextResponse } from "next/server";
import OpenAI from "openai";
import { execSync } from "child_process";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Windows elérési út dupla visszaperjellel
const YTDLP_PATH = "C:\\Users\\sarko\\Desktop\\ffmpeg-8.0.1-essentials_build\\bin\\yt-dlp.exe";

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();

    const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

    console.log(`⏳ Fetching video metadata: ${videoId}`);

    let fullTranscript = "";

    try {
      // Egyszerű lekérés User-Agenttel a tiltás ellen
      const titleCmd = `"${YTDLP_PATH}" --get-title --user-agent "Mozilla/5.0" --no-warnings --no-check-certificate "https://www.youtube.com/watch?v=${videoId}"`;
      const descCmd = `"${YTDLP_PATH}" --get-description --user-agent "Mozilla/5.0" --no-warnings --no-check-certificate "https://www.youtube.com/watch?v=${videoId}"`;
      
      const title = execSync(titleCmd).toString().trim();
      const description = execSync(descCmd).toString().trim();
      
      fullTranscript = `Title: ${title}. Description: ${description}`;
      console.log("✅ Metadata extracted successfully!");
    } catch (e) {
      console.error("⚠️ Metadata extraction failed.");
    }

    let highlights = [];

    if (fullTranscript && fullTranscript.length > 50) {
      console.log("🤖 AI analysis starting...");
      
      const prompt = `You are a professional viral video editor. Based on this title and description, pick 5 viral segments (30-60s each). 
      Provide the start and end times in seconds. 
      
      VIDEO: ${fullTranscript.substring(0, 5000)}

      Respond ONLY with JSON:
      {
        "highlights": [
          { "title": "CATCHY TITLE", "start": 10, "end": 45 }
        ]
      }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const data = JSON.parse(completion.choices[0].message.content || "{}");
      highlights = data.highlights;
    } 

    if (!highlights || highlights.length === 0) {
      highlights = [
        { title: "Viral Clip 1 (Fallback)", start: 30, end: 70 },
        { title: "Viral Clip 2 (Fallback)", start: 120, end: 165 }
      ];
    }

    return NextResponse.json({ highlights, videoId });

  } catch (error: any) {
    console.error("❌ Process Error:", error.message);
    return NextResponse.json({ error: "Failed to process video" }, { status: 500 });
  }
}