"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ScriptWriterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const SCRIPT_COST = 8; // Beállítva 8 kreditre

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

  const handleGenerateScript = async () => {
    if (!prompt || loading) return;
    if (userCredits < SCRIPT_COST) return alert("Not enough credits! You need 8 credits.");

    setLoading(true);

    try {
      // 1. Kredit levonása az adatbázisban
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: userCredits - SCRIPT_COST })
        .eq('id', user.id);

      if (updateError) throw new Error("Credit update failed");

      // 2. API hívás a GPT-hez
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId: user.id }),
      });

      const data = await res.json();
      
      if (data.script) {
        setScript(data.script);
        setIsFinished(true);
        // Frissítjük a helyi állapotot is
        setUserCredits(prev => prev - SCRIPT_COST);
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "storyforge_script.txt";
    document.body.appendChild(element);
    element.click();
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <style>{`
        .viral-glow { text-shadow: 0 0 15px rgba(16, 185, 129, 0.5); }
        @keyframes pulse { 0% { opacity: 0.6; } 100% { opacity: 1; } }
        .loading-text { animation: pulse 1s infinite alternate; }
      `}</style>

      <button onClick={() => router.push("/dashboard")} style={styles.backBtnDashboard}>
        ← BACK TO DASHBOARD
      </button>

      <div style={styles.creditBadge}>🪙 {userCredits} Credits</div>

      <div style={styles.mainCard}>
        <h1 style={styles.title}>AI SCRIPT <span style={{ color: '#10b981' }} className="viral-glow">GENERATOR</span></h1>
        
        {!isFinished ? (
          <>
            <p style={styles.subtitle}>Enter your idea in English and let the AI forge your viral script.</p>
            
            <textarea
              style={styles.textarea}
              placeholder="e.g., A dark documentary style script about the mystery of the Bermuda Triangle..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />

            <div style={styles.costTag}>
              COST: {SCRIPT_COST} CREDITS
            </div>

            <button 
              onClick={handleGenerateScript} 
              disabled={loading} 
              style={loading ? styles.btnDisabled : styles.generateBtn}
            >
              {loading ? <span className="loading-text">FORGING...</span> : "GENERATE SCRIPT"}
            </button>
          </>
        ) : (
          <div style={styles.resultArea}>
            <div style={styles.resultHeader}>
              <h3 style={{ color: '#10b981', margin: 0 }}>FORGED SCRIPT:</h3>
              <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={downloadTxt} style={styles.downloadBtn}>DOWNLOAD .TXT</button>
                <button onClick={() => setIsFinished(false)} style={styles.remakeBtn}>NEW SCRIPT</button>
              </div>
            </div>
            <pre style={styles.scriptBox}>{script}</pre>
          </div>
        )}
      </div>

      <footer style={styles.footer}>
        <p>© StoryForgeAI copyright reversed</p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { backgroundColor: "#000", minHeight: "100vh", color: "#fff", padding: "40px", textAlign: "center", display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' },
  backBtnDashboard: { position: 'absolute', top: '20px', left: '20px', background: '#111', color: '#fff', border: '1px solid #333', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  creditBadge: { position: "absolute", top: "20px", right: "20px", background: "#000", padding: "10px 20px", borderRadius: "50px", border: "2px solid #10b981", fontWeight: 'bold' },
  mainCard: { backgroundColor: "#0a0a0a", width: "100%", maxWidth: "800px", borderRadius: "30px", padding: "50px", border: "1px solid #1a1a1a", marginTop: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' },
  title: { fontSize: "48px", fontWeight: "900", marginBottom: "15px", letterSpacing: '-1px' },
  subtitle: { color: "#666", marginBottom: "30px", fontSize: '16px' },
  textarea: { width: "100%", height: "180px", background: "#050505", border: "1px solid #222", color: "#fff", padding: "20px", borderRadius: "15px", fontSize: "17px", outline: "none", resize: 'none' },
  costTag: { marginTop: '20px', color: '#10b981', fontWeight: 'bold', fontSize: '14px' },
  generateBtn: { background: "#10b981", color: "#000", width: '100%', padding: "20px", border: "none", borderRadius: "15px", fontWeight: "900", cursor: "pointer", fontSize: "18px", marginTop: "15px", transition: '0.2s' },
  btnDisabled: { background: "#111", color: "#444", width: '100%', padding: "20px", border: "none", borderRadius: "15px", marginTop: "15px", cursor: 'not-allowed' },
  resultArea: { textAlign: 'left', marginTop: '20px' },
  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  scriptBox: { backgroundColor: "#050505", padding: "25px", borderRadius: "15px", color: "#ccc", whiteSpace: "pre-wrap", fontSize: "15px", border: "1px solid #111", lineHeight: "1.7", maxHeight: '400px', overflowY: 'auto' },
  downloadBtn: { background: "#10b981", color: "#000", padding: "10px 20px", borderRadius: "8px", border: 'none', fontWeight: "bold", cursor: 'pointer' },
  remakeBtn: { background: "transparent", color: "#666", padding: "10px 20px", borderRadius: "8px", border: '1px solid #222', fontWeight: "bold", cursor: 'pointer' },
  footer: { marginTop: 'auto', paddingTop: '60px', color: '#333', fontSize: '14px', letterSpacing: '1px' }
};