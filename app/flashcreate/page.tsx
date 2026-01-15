"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function FlashCreatePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  
  const [videoUrl, setVideoUrl] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [selectedClipId, setSelectedClipId] = useState<number | null>(null);
  const [selectedClipData, setSelectedClipData] = useState<any>(null);

  // Music state - IDs without extension to prevent double extension errors
  const [bgMusic, setBgMusic] = useState("eyuh"); 
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const musicList = [
    { id: "eyuh", name: "EYUH Phonk" },
    { id: "beleza", name: "BELEZA Phonk" },
    { id: "premiere", name: "Premiere Chill" },
    { id: "hon", name: "HON Phonk" },
    { id: "universo", name: "UNIVERSO Phonk" },
    { id: "glory", name: "GLORY Phonk" },
    { id: "odnogo", name: "ODNOGO Phonk" },
    { id: "closing", name: "Closing Door Chill" },
    { id: "nunca", name: "NUNCA MUDA" },
    { id: "ladrao", name: "MONTAGEM LADRAO" },
  ];

  const [musicVol, setMusicVol] = useState(20);
  const [videoVol, setVideoVol] = useState(80);
  const [highlights, setHighlights] = useState<any[]>([]);

  const getRandomViralRate = () => Math.floor(Math.random() * (99 - 97 + 1)) + 97;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        const { data } = await supabase.from('users').select('credits').eq('id', user.id).single();
        if (data) setUserCredits(data.credits);
      }
    };
    checkUser();
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [router]);

  // Handle music preview playback
  const toggleMusicPreview = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      try {
        const trackUrl = `/${bgMusic}.mp3`;
        if (!audioRef.current) {
          audioRef.current = new Audio(trackUrl);
        } else {
          audioRef.current.src = trackUrl;
        }
        audioRef.current.volume = musicVol / 100;
        await audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          alert("Error: File not found: " + trackUrl);
        };
      } catch (err) {
        setIsPlaying(false);
      }
    }
  };

  const handleMusicChange = (newId: string) => {
    setBgMusic(newId);
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleProcessVideo = async () => {
    if (!videoUrl) return alert("Please provide a link!");
    setLoading(true);
    try {
      const response = await fetch("/api/process-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        const clipsWithScore = data.highlights.map((clip: any) => ({
          ...clip,
          viralRate: getRandomViralRate()
        }));
        setHighlights(clipsWithScore); 
        setVideoId(data.videoId);
        setStep(2);
      }
    } catch (err) {
      alert("An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (userCredits < 20) return alert("You don't have enough credits!");
    if (!selectedClipData) return alert("Please select a clip!");
    setLoading(true);
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);

    try {
      const newTotal = userCredits - 20;
      await supabase.from('users').update({ credits: newTotal }).eq('id', user.id);
      setUserCredits(newTotal);

      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoId,
          start: selectedClipData.start,
          end: selectedClipData.end,
          bgMusic: bgMusic, // e.g.: "eyuh"
          musicVol: musicVol,
          videoVol: videoVol
        }),
      });

      const data = await response.json();
      if (data.downloadUrl) {
        setShowSuccess(true);
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.setAttribute("download", `storyforge_${videoId}.mp4`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => router.push("/dashboard"), 3000);
      } else {
        alert("Server error: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p style={styles.loading}>Loading StoryForge...</p>;

  return (
    <main style={styles.container}>
      {showSuccess && (
        <div style={styles.successOverlay}>
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={{ margin: '10px 0', fontSize: '24px' }}>Success!</h3>
            <p style={{ color: '#9ca3af' }}>The video is ready and your download has started.</p>
          </div>
        </div>
      )}

      <section style={styles.contentArea}>
        <div style={styles.card}>
          {step === 1 && (
            <div style={styles.heroSection}>
              <div style={styles.welcomeBadge}>AI-POWERED VIDEO ENGINE</div>
              <h1 style={styles.glowTitle}>Flash Create</h1>
              <div style={styles.inputWrapper}>
                <input 
                  type="text" 
                  placeholder="Paste YouTube link here..." 
                  style={styles.urlInput}
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <button onClick={handleProcessVideo} style={styles.startBtn} disabled={loading}>
                  {loading ? "ANALYZING..." : "GENERATE CLIPS"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={styles.heroSection}>
              <h2 style={styles.glowTitle}>Select a Clip</h2>
              <div style={styles.clipGrid}>
                {highlights.map((clip, index) => (
                  <div key={index} style={{...styles.clipCard, border: selectedClipId === index ? '3px solid #10b981' : '1px solid #374151'}} onClick={() => { setSelectedClipId(index); setSelectedClipData(clip); }}>
                    <VideoPreview videoUrl={videoUrl} start={clip.start} end={clip.end} />
                    <div style={styles.clipInfo}>
                      <div style={styles.viralBadge}>🔥 {clip.viralRate}% Viral Rate</div>
                      <h4 style={styles.clipTitle}>{clip.title}</h4>
                      <p style={styles.clipTime}>{clip.start}s - {clip.end}s</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedClipId !== null && <button onClick={() => setStep(3)} style={{...styles.startBtn, marginTop: '30px'}}>CONTINUE</button>}
            </div>
          )}

          {step === 3 && (
            <div style={styles.heroSection}>
              <h2 style={styles.glowTitle}>Settings</h2>
              <div style={styles.settingsGrid}>
                <div style={styles.settingsCard}>
                  <label style={styles.inputLabel}>Background Music</label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <select style={styles.profileInput} value={bgMusic} onChange={(e) => handleMusicChange(e.target.value)}>
                        {musicList.map((track) => (
                        <option key={track.id} value={track.id}>{track.name}</option>
                        ))}
                    </select>
                    <button onClick={toggleMusicPreview} style={{...styles.startBtn, minWidth: '60px', backgroundColor: isPlaying ? '#ef4444' : '#10b981'}}>{isPlaying ? "⏹" : "🔊"}</button>
                  </div>
                  <div style={styles.volumeGroup}>
                    <div style={{flex:1}}><label style={styles.inputLabel}>Music: {musicVol}%</label><input type="range" value={musicVol} onChange={(e) => setMusicVol(parseInt(e.target.value))} style={{width:'100%'}} /></div>
                    <div style={{flex:1}}><label style={styles.inputLabel}>Original: {videoVol}%</label><input type="range" value={videoVol} onChange={(e) => setVideoVol(parseInt(e.target.value))} style={{width:'100%'}} /></div>
                  </div>
                  <div style={styles.priceTag}>Total: <span style={{color:'#10b981'}}>20 Credits</span></div>
                  <button onClick={handlePayment} style={styles.startBtn} disabled={loading}>{loading ? "GENERATING..." : "PAY & DOWNLOAD"}</button>
                </div>
              </div>
            </div>
          )}
          
          <footer style={styles.footer}><p style={styles.footerText}>® Story Forge AI copyright reversed</p></footer>
        </div>
      </section>
    </main>
  );
}

function VideoPreview({ videoUrl, start, end }: any) {
  const [hovered, setHovered] = useState(false);
  const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${start}&end=${end}&autoplay=${hovered ? 1 : 0}&mute=1&controls=0`;
  return (
    <div style={styles.previewContainer} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <iframe src={embedUrl} style={styles.previewIframe} title="Preview" />
      {!hovered && <div style={styles.previewOverlay}>HOVER TO PREVIEW</div>}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#030712', color: '#f9fafb', fontFamily: 'sans-serif' },
  contentArea: { flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  card: { backgroundColor: '#111827', width: '100%', maxWidth: '1000px', borderRadius: '32px', padding: '50px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' },
  heroSection: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  glowTitle: { fontSize: '48px', fontWeight: '900', color: '#10b981', marginBottom: '10px' },
  welcomeBadge: { color: '#10b981', fontSize: '13px', border: '1px solid #10b981', padding: '5px 15px', borderRadius: '20px', marginBottom: '15px' },
  inputWrapper: { display: 'flex', gap: '15px', width: '100%', maxWidth: '650px', marginBottom: '40px' },
  urlInput: { flex: 1, padding: '18px', borderRadius: '15px', backgroundColor: '#030712', color: 'white', border: '1px solid #374151' },
  startBtn: { padding: '15px 35px', backgroundColor: '#10b981', border: 'none', borderRadius: '15px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  loading: { textAlign: 'center', marginTop: '100px', color: '#10b981' },
  clipGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', width: '100%' },
  clipCard: { backgroundColor: '#1f2937', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer' },
  clipInfo: { padding: '15px', textAlign: 'left' },
  viralBadge: { color: '#10b981', fontSize: '12px', fontWeight: 'bold' },
  clipTitle: { fontSize: '14px', margin: '5px 0' },
  clipTime: { fontSize: '12px', color: '#9ca3af' },
  previewContainer: { position: 'relative', height: '180px', backgroundColor: '#000' },
  previewIframe: { width: '100%', height: '100%', border: 'none' },
  previewOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' },
  settingsGrid: { width: '100%', maxWidth: '450px' },
  settingsCard: { backgroundColor: '#1f2937', padding: '30px', borderRadius: '24px' },
  inputLabel: { display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '8px', textAlign: 'left' },
  profileInput: { flex: 1, padding: '12px', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '10px', color: 'white' },
  volumeGroup: { display: 'flex', gap: '15px', marginBottom: '20px' },
  priceTag: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' },
  successOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  successBox: { padding: '40px', backgroundColor: '#111827', borderRadius: '24px', border: '2px solid #10b981', textAlign: 'center' },
  successIcon: { fontSize: '40px', marginBottom: '10px' },
  footer: { marginTop: '40px', opacity: 0.5 },
  footerText: { fontSize: '12px' }
};