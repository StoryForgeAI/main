import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { execSync } from "child_process";

const FFMPEG_PATH = "C:\\Users\\sarko\\Desktop\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe";
const YTDLP_PATH = "C:\\Users\\sarko\\Desktop\\ffmpeg-8.0.1-essentials_build\\bin\\yt-dlp.exe";

ffmpeg.setFfmpegPath(FFMPEG_PATH);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { videoId, start, end, bgMusic, musicVol, videoVol } = body;

    const outputDir = path.join(process.cwd(), "public", "outputs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputFileName = `storyforge_${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);
    const musicPath = path.join(process.cwd(), "public", `${bgMusic}.mp3`);

    console.log(`⏳ Getting stable stream URL for: ${videoId}`);

    let videoUrl: string;
    try {
      // Stabilizált lekérés: kényszerített mp4 formátum és User-Agent
      const getUrlCmd = `"${YTDLP_PATH}" -g --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --no-check-certificate -f "best[ext=mp4][protocol^=http]" "https://www.youtube.com/watch?v=${videoId}"`;
      videoUrl = execSync(getUrlCmd).toString().trim().split('\n')[0];
      console.log("🔗 URL successfully retrieved.");
    } catch (e: any) {
      console.error("yt-dlp error:", e.message);
      return NextResponse.json({ error: "YouTube link could not be opened" }, { status: 500 });
    }

    return new Promise((resolve) => {
      const command = ffmpeg(videoUrl) as ffmpeg.FfmpegCommand;

      command
        .setStartTime(start)
        .setDuration(end - start)
        .input(musicPath)
        .inputOptions(['-stream_loop -1']) // A rövid zenét ismétli a végtelenségig
        .complexFilter([
          // Kényszerített sztereó és azonos mintavételezés a hiba elkerülésére
          `[0:a]aformat=channel_layouts=stereo,aresample=44100,volume=${videoVol / 100}[v_audio]`,
          `[1:a]aformat=channel_layouts=stereo,aresample=44100,volume=${musicVol / 100}[bg_audio]`,
          `[v_audio][bg_audio]amix=inputs=2:duration=first:dropout_transition=2[a]`
        ])
        .outputOptions([
          "-map 0:v",              // Eredeti kép
          "-map [a]",              // Mixelt hang
          "-c:v libx264",          // Videó kodek
          "-preset ultrafast",     // Gyors kódolás
          "-c:a aac",              // Audió kodek
          "-b:a 128k",
          "-shortest",             // Leáll, amikor a videó véget ér
          "-vf", "drawtext=text='Story Forge AI':x=(w-text_w)/2:y=h-60:fontsize=24:fontcolor=white@0.5"
        ])
        .format("mp4")
        .on("start", (cmd) => console.log("🎬 FFmpeg RUNNING..."))
        .on("end", () => {
          console.log("✅ Video successfully created!");
          resolve(NextResponse.json({ downloadUrl: `/outputs/${outputFileName}`, success: true }));
        })
        .on("error", (err) => {
          console.error("❌ FFmpeg Error:", err.message);
          resolve(NextResponse.json({ error: "Video processing failed" }, { status: 500 }));
        })
        .save(outputPath);
    });

  } catch (error: any) {
    console.error("❌ Server Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}