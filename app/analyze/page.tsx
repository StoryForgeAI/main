"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
  const [channelUrl, setChannelUrl] = useState("");
  const [duration, setDuration] = useState("7");
  const [result, setResult] = useState<string | null>(null);

  const prices: { [key: string]: number } = { "7": 15, "14": 25, "30": 45 };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else {
        setUser(user);
        const { data } = await supabase.from('users').select('credits').eq('id', user.id).single();
        if (data) setUserCredits(data.credits);
      }
    };
    checkUser();
  }, [router]);

  const handleAnalyze = async () => {
    const cost = prices[duration];
    if (!channelUrl) return alert("Please enter a channel link!");
    if (userCredits < cost) return alert("Not enough credits!");

    setLoading(true);
    setResult(null);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: userCredits - cost })
        .eq('id', user.id);

      if (updateError) throw new Error("Credit update failed");

      const response = await fetch("/api/analyze-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl, duration, userId: user.id }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Itt a kliens oldalon is biztosítjuk, hogy ne legyenek csillagok (biztonsági szűrés)
      const cleanText = data.plan.replace(/\*/g, "");
      setResult(cleanText);
      setUserCredits(prev => prev - cost);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPlan = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `StoryForge_Plan_${duration}_days.txt`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  if (!user) return <div style={styles.loadingBase}>Loading Engine...</div>;

  return (
    <main style={styles.container}>
      {/* Jobb felső kredit kijelző */}
      <div style={styles.creditBadgeTop}>
        <span style={{fontSize: '18px'}}>🪙</span>
        <span style={styles.creditAmount}>{userCredits} Credits</span>
      </div>

      <div style={styles.card}>
        <button onClick={() => router.push("/dashboard")} style={styles.backBtn}>← Back to Dashboard</button>
        
        <div style={styles.heroSection}>
          <div style={{...styles.welcomeBadge, color: '#60a5fa', borderColor: '#60a5fa'}}>CHANNEL INTELLIGENCE</div>
          <h1 style={{...styles.glowTitle, background: 'linear-gradient(to right, #fff, #60a5fa)'}}>Channel Analyze</h1>
          <p style={styles.heroSubtitle}>Deep scan 5 videos to reverse-engineer niche success.</p>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <h2 style={styles.loadingText}>AI is generating...</h2>
            <p style={styles.loadingSubtext}>Almost ready, building your roadmap...</p>
          </div>
        ) : (
          <div style={styles.toolBox}>
            {!result ? (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>YouTube Channel URL</label>
                  <input 
                    type="text" 
                    placeholder="https://youtube.com/@username" 
                    style={styles.urlInput}
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Plan Duration & Cost</label>
                  <div style={styles.durationGrid}>
                    {["7", "14", "30"].map((d) => (
                      <button 
                        key={d}
                        onClick={() => setDuration(d)}
                        style={{
                          ...styles.durationBtn,
                          backgroundColor: duration === d ? '#60a5fa' : '#1f2937',
                          borderColor: duration === d ? '#60a5fa' : '#374151'
                        }}
                      >
                        {d} Days ({prices[d]} 🪙)
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAnalyze} 
                  style={{...styles.startBtn, backgroundColor: '#60a5fa'}}
                >
                  🪙 GENERATE {duration} DAY PLAN
                </button>
              </>
            ) : (
              <div style={styles.resultArea}>
                <h3 style={{color: '#10b981', marginBottom: '15px'}}>✅ Plan Generated Successfully!</h3>
                <div style={styles.scrollBox}>{result}</div>
                <button onClick={downloadPlan} style={styles.downloadBtn}>DOWNLOAD DOCUMENT (.TXT)</button>
                <button onClick={() => setResult(null)} style={styles.resetBtn}>Analyze Another Channel</button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', backgroundColor: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: '"Inter", sans-serif', position: 'relative' },
  creditBadgeTop: { position: 'absolute', top: '30px', right: '30px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#111827', padding: '12px 20px', borderRadius: '50px', border: '1px solid #10b981', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' },
  creditAmount: { fontWeight: '800', color: 'white', fontSize: '16px' },
  card: { backgroundColor: '#111827', width: '100%', maxWidth: '900px', borderRadius: '32px', padding: '50px', border: '1px solid #1f2937', position: 'relative', minHeight: '500px' },
  backBtn: { position: 'absolute', top: '30px', left: '30px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontWeight: 'bold' },
  heroSection: { textAlign: 'center', marginBottom: '40px' },
  welcomeBadge: { display: 'inline-block', border: '1px solid', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' },
  glowTitle: { fontSize: '42px', fontWeight: '900', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '15px' },
  heroSubtitle: { color: '#9ca3af', fontSize: '16px' },
  toolBox: { display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeIn 0.5s ease-out' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' },
  spinner: { width: '60px', height: '60px', border: '6px solid rgba(16, 185, 129, 0.1)', borderTop: '6px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' },
  loadingText: { color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' },
  loadingSubtext: { color: '#9ca3af', fontSize: '14px' },
  inputGroup: { textAlign: 'left' },
  inputLabel: { display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '10px' },
  urlInput: { width: '100%', padding: '15px', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', color: 'white', outline: 'none' },
  durationGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' },
  durationBtn: { padding: '12px', borderRadius: '12px', border: '1px solid', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
  startBtn: { padding: '18px', border: 'none', borderRadius: '15px', color: 'white', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', marginTop: '10px' },
  resultArea: { textAlign: 'left', animation: 'fadeIn 0.5s' },
  scrollBox: { height: '350px', backgroundColor: '#030712', borderRadius: '15px', padding: '25px', overflowY: 'auto', fontSize: '14px', color: '#d1d5db', lineHeight: '1.8', border: '1px solid #1f2937', whiteSpace: 'pre-wrap' },
  downloadBtn: { width: '100%', padding: '15px', backgroundColor: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' },
  resetBtn: { width: '100%', padding: '10px', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', marginTop: '10px' },
  loadingBase: { color: '#10b981', textAlign: 'center', marginTop: '100px', fontSize: '20px' }
};