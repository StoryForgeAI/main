"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "generating" | "success">("idle");
  const [credits, setCredits] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase.from("users").select("credits").eq("id", user.id).single();
        setCredits(data?.credits ?? 0);
      } else {
        router.push("/login");
      }
    };
    getUser();
  }, [router]);

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `storyforge-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Letöltési hiba:", err);
      window.open(url, '_blank');
    }
  };

  const handleGenerate = async () => {
    // Itt frissítve 25 kreditre az ellenőrzés
    if (!prompt || (credits !== null && credits < 25)) return; 

    setLoading(true);
    setStatus("generating");

    try {
      const response = await fetch("/api/forge-image", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          userId: user.id,
          currentCredits: credits,
        }),
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setStatus("success");
        setCredits(data.newBalance);
        await downloadImage(data.imageUrl);
      } else {
        alert("Hiba: " + (data.error || "Ismeretlen hiba"));
        setStatus("idle");
      }
    } catch (error) {
      console.error("Hiba:", error);
      alert("Hálózati hiba történt.");
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <style dangerouslySetInnerHTML={{ __html: `
        .container { min-height: 100vh; background-color: #000; color: #fff; padding: 40px 20px; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; }
        .header { width: 100%; max-width: 800px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; }
        .back-btn { background: none; border: none; color: #666; cursor: pointer; font-size: 14px; transition: 0.2s; }
        .back-btn:hover { color: #22c55e; }
        .credit-badge { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); padding: 10px 20px; border-radius: 99px; }
        .credit-count { color: #22c55e; font-weight: bold; font-size: 18px; }
        .main-content { width: 100%; max-width: 600px; text-align: center; }
        .title { font-size: 48px; font-weight: 900; font-style: italic; color: #22c55e; letter-spacing: -2px; margin-bottom: 10px; text-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
        .input-card { background: #0a0a0a; padding: 30px; border-radius: 24px; border: 1px solid #1a1a1a; margin-top: 20px; }
        .prompt-textarea { width: 100%; height: 150px; background: #000; border: 1px solid #222; border-radius: 16px; color: #fff; padding: 20px; margin-bottom: 20px; outline: none; font-size: 16px; resize: none; box-sizing: border-box; }
        .prompt-textarea:focus { border-color: #22c55e; }
        .generate-btn { width: 100%; background: #22c55e; color: #000; border: none; padding: 18px; border-radius: 14px; font-weight: 800; font-size: 16px; cursor: pointer; text-transform: uppercase; transition: 0.2s; }
        .generate-btn:hover:not(:disabled) { background: #4ade80; transform: translateY(-2px); }
        .generate-btn:disabled { background: #1a1a1a; color: #444; cursor: not-allowed; }
        .loading-box { padding: 60px 0; }
        .spinner { width: 50px; height: 50px; border: 4px solid rgba(34, 197, 94, 0.1); border-top: 4px solid #22c55e; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .success-box { padding: 60px; border: 1px solid #22c55e; border-radius: 24px; background: rgba(34, 197, 94, 0.05); }
        footer { margin-top: 80px; opacity: 0.4; font-size: 11px; text-align: center; border-top: 1px solid #1a1a1a; padding-top: 30px; width: 100%; }
      `}} />

      <div className="header">
        <button onClick={() => router.push("/dashboard")} className="back-btn">← Back to Dashboard</button>
        <div className="credit-badge">
          <span className="credit-count">{credits ?? "..."}</span>
          <span style={{color: '#555', marginLeft: '8px', fontSize: '12px'}}>CREDITS</span>
        </div>
      </div>

      <div className="main-content">
        <h1 className="title">IMAGE FORGE</h1>
        <p style={{color: '#666'}}>Transform your thoughts into visuals (DALL-E 2)</p>

        {status === "idle" && (
          <div className="input-card">
            <textarea
              className="prompt-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
            />
            <button className="generate-btn" onClick={handleGenerate} disabled={!prompt || loading}>
              {/* Felirat frissítve 25-re */}
              {loading ? "Processing..." : "Generate & Download (25 Credits)"}
            </button>
          </div>
        )}

        {status === "generating" && (
          <div className="loading-box">
            <div className="spinner"></div>
            <h2>Sit back, your image is generating...</h2>
            <p style={{color: '#22c55e', opacity: 0.6, marginTop: '10px'}}>The forge is hot! Your PNG is coming soon.</p>
          </div>
        )}

        {status === "success" && (
          <div className="success-box">
            <h2 style={{color: '#22c55e', fontSize: '32px', marginBottom: '10px'}}>Success!</h2>
            <p>Your image has been downloaded.</p>
            <button 
              onClick={() => setStatus("idle")}
              style={{marginTop: '25px', background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', textDecoration: 'underline'}}
            >
              Generate another one
            </button>
          </div>
        )}

        <footer>
          <p>© StoryForgeAI - All rights reserved</p>
          <p style={{ color: '#22c55e', marginTop: '5px' }}>Powered by OpenAI DALL-E 2</p>
        </footer>
      </div>
    </div>
  );
}