import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a world-class social media scriptwriter. Your goal is to write viral, high-retention video scripts for TikTok, Reels, and YouTube Shorts in English. Focus on strong hooks, engaging body content, and a clear call to action (CTA). Use a modern, fast-paced tone. Don't put emojis to the script."
        },
        {
          role: "user",
          content: `Write a detailed viral video script based on this idea: ${prompt}`
        }
      ],
      temperature: 0.7,
    });

    const script = response.choices[0].message.content;
    return NextResponse.json({ script });
  } catch (error) {
    console.error("GPT Error:", error);
    return NextResponse.json({ error: "Failed to generate script." }, { status: 500 });
  }
}