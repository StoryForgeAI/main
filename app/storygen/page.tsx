"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function StoryForgePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBg, setSelectedBg] = useState("storybg1.mp4");
  const [selectedVoice, setSelectedVoice] = useState("onyx");
  const [selectedSubStyle, setSelectedSubStyle] = useState("banger_karaoke");
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const totalCost = 25 + (removeWatermark ? 10 : 0);

  const subStyles = [
    { id: "banger_karaoke", img: "/felirat1.png", label: "BANGER GREEN" },
    { id: "banger_yellow", img: "/felirat2.png", label: "BANGER YELLOW" },
    { id: "banger_red", img: "/felirat3.png", label: "BANGER RED" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      setUser(user);
      const { data } = await supabase.from("users").select("credits").eq("id", user.id).single();
      if (data) setUserCredits(data.credits);
    };
    fetchUserData();
  }, [router]);

  const handleForge = async () => {
    if (!prompt || loading) return;
    if (userCredits < totalCost) return alert("Not enough credits!");

    setLoading(true);
    setStatus("Forging your viral video...");

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: userCredits - totalCost })
        .eq('id', user.id);

      if (updateError) throw new Error("Credit update failed");

      const res = await fetch("/api/forge-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          voice: selectedVoice,
          bgVideo: selectedBg,
          subStyle: selectedSubStyle,
          removeWatermark,
          userId: user.id
        }),
      });

      const data = await res.json();
      if (data.videoUrl) {
        setFinalVideoUrl(data.videoUrl);
        setIsFinished(true);
        setUserCredits(prev => prev - totalCost);
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
      setStatus("Error during render.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <style>{`
        .banger-font { font-family: 'arial', sans-serif; font-weight: 900; }
        /* Static shadow, no animation here */
        .static-title { text-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
        .sub-hover:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); border-color: #10b981 !important; }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          width: 60px;
          height: 60px;
          border: 6px solid rgba(16, 185, 129, 0.1);
          border-top: 6px solid #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px auto;
        }
      `}</style>

      <button onClick={() => router.push("/dashboard")} style={styles.backBtnDashboard}>
        ← BACK TO DASHBOARD
      </button>

      <div style={styles.creditBadge}>🪙 {userCredits} Credits</div>
      
      {/* Removed "viral-title" class to stop movement */}
      <h1 style={styles.title} className="banger-font static-title">STORYFORGE <span style={{color: '#fff'}}>AI</span></h1>

      {!isFinished ? (
        <>
          {loading ? (
            <div style={styles.loadingArea}>
              <div className="spinner"></div>
              <h2 className="banger-font" style={{fontSize: '32px', color: '#10b981', marginBottom: '10px'}}>FORGING...</h2>
              <p style={{color: '#4b5563'}}>Your viral masterpiece is being calculated.</p>
            </div>
          ) : (
            <div style={styles.form}>
              <div style={styles.section}>
                <p style={styles.label}>SELECT BACKGROUND</p>
                <div style={styles.bgGrid}>
                  {["storybg1.mp4", "storybg2.mp4", "storybg3.mp4"].map(bg => (
                    <div key={bg} onClick={() => setSelectedBg(bg)}
                      style={{...styles.bgCard, border: selectedBg === bg ? "4px solid #10b981" : "4px solid #111"}}
                      className="sub-hover"
                    >
                       <video src={`/${bg}`} muted loop style={styles.bgThumb} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.section}>
                <p style={styles.label}>SUBTITLE STYLE</p>
                <div style={styles.subGrid}>
                  {subStyles.map(s => (
                    <div key={s.id} onClick={() => setSelectedSubStyle(s.id)}
                      style={{...styles.subCard, border: selectedSubStyle === s.id ? "2px solid #10b981" : "1px solid #222"}}
                      className="sub-hover"
                    >
                      <img src={s.img} alt={s.id} style={styles.subImg} />
                      <span style={{...styles.subLabel, color: selectedSubStyle === s.id ? "#10b981" : "#888"}} className="banger-font">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.optionBox}>
                 <label style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: '#0a0a0a', padding: '15px 25px', borderRadius: '15px', border: '1px solid #1a1a1a'}}>
                    <input 
                      type="checkbox" 
                      style={{accentColor: '#10b981', width: '20px', height: '20px'}}
                      checked={removeWatermark} 
                      onChange={(e) => setRemoveWatermark(e.target.checked)}
                    />
                    <span className="banger-font" style={{fontSize: '16px', color: '#fff'}}>REMOVE WATERMARK (+10 🪙)</span>
                 </label>
              </div>

              <textarea
                style={styles.textarea}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What should the viral video be about?"
              />

              <div style={{marginTop: '15px', color: '#10b981', fontWeight: '900', fontSize: '18px'}} className="banger-font">
                TOTAL: {totalCost} CREDITS
              </div>

              <button style={styles.genBtn} onClick={handleForge} disabled={loading} className="banger-font">
                START GENERATION
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={styles.preview}>
          <video src={finalVideoUrl!} controls autoPlay style={styles.mainVideo} />
          <div style={styles.actionBtns}>
            <a href={finalVideoUrl!} download style={styles.downloadBtn}>DOWNLOAD VIDEO</a>
            <button onClick={() => setIsFinished(false)} style={styles.backBtn}>CREATE NEW</button>
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <p>© StoryForgeAI copyright reversed</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "40px", textAlign: "center", position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Inter, sans-serif' },
  backBtnDashboard: { position: 'absolute', top: '20px', left: '20px', background: '#0a0a0a', color: '#888', border: '1px solid #1a1a1a', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
  creditBadge: { position: "absolute", top: "20px", right: "20px", background: "#0a0a0a", padding: "10px 20px", borderRadius: "50px", border: "1px solid #10b981", color: "#10b981", fontWeight: "bold" },
  title: { fontSize: "60px", color: "#10b981", marginBottom: "30px", letterSpacing: '-2px' },
  form: { maxWidth: "800px", width: '100%' },
  loadingArea: { padding: '60px 0' },
  section: { marginBottom: "30px" },
  label: { fontSize: "12px", color: "#444", fontWeight: "bold", marginBottom: "15px", letterSpacing: "3px" },
  bgGrid: { display: "flex", gap: "15px", justifyContent: "center" },
  bgCard: { width: "160px", height: "90px", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "0.3s", backgroundColor: '#0a0a0a' },
  bgThumb: { width: "100%", height: "100%", objectFit: "cover" },
  subGrid: { display: "flex", gap: "15px", justifyContent: "center" },
  subCard: { width: "120px", background: "#0a0a0a", borderRadius: "12px", cursor: "pointer", transition: "0.2s", overflow: 'hidden' },
  subImg: { width: "100%", height: "60px", objectFit: "cover" },
  subLabel: { fontSize: "11px", padding: "12px 5px", display: "block", letterSpacing: '1px' },
  optionBox: { marginBottom: '25px', display: 'flex', justifyContent: 'center' },
  textarea: { width: "100%", height: "140px", background: "#050505", border: "1px solid #1a1a1a", color: "#fff", padding: "20px", borderRadius: "20px", fontSize: "16px", outline: "none", transition: '0.3s' },
  genBtn: { background: "#10b981", color: "#000", padding: "20px 60px", border: "none", borderRadius: "15px", fontWeight: "900", cursor: "pointer", fontSize: "20px", marginTop: "25px", boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)' },
  preview: { display: "flex", flexDirection: "column", alignItems: "center" },
  mainVideo: { width: "320px", height: "568px", borderRadius: "24px", border: '1px solid #1a1a1a', boxShadow: "0 0 60px rgba(16, 185, 129, 0.1)" },
  actionBtns: { marginTop: "30px", display: "flex", gap: "15px" },
  downloadBtn: { background: "#10b981", color: "#000", padding: "15px 35px", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: '15px' },
  backBtn: { background: "#0a0a0a", color: "#fff", padding: "15px 35px", borderRadius: "12px", border: "1px solid #1a1a1a", cursor: 'pointer' },
  footer: { marginTop: 'auto', paddingTop: '60px', color: '#222', fontSize: '12px', letterSpacing: '1px' }
};