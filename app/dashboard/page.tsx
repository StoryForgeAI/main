"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userCredits, setUserCredits] = useState<number>(0);
  
  const [userStats, setUserStats] = useState({ joinDate: "", rank: 0 });
  const [passwordData, setPasswordData] = useState({ old: "", new: "" });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/register");
      } else {
        setUser(user);
        const { data } = await supabase.from('users').select('credits').eq('id', user.id).single();
        if (data) setUserCredits(data.credits);
        const { count } = await supabase.from('users').select('*', { count: 'exact', head: true }).lte('created_at', user.created_at);
        setUserStats({
          joinDate: new Date(user.created_at).toLocaleDateString('en-US'),
          rank: count || 0
        });
      }
    };
    checkUser();
  }, [router]);

  const handlePasswordChange = async () => {
    if (!passwordData.new) return alert("Please enter a new password");
    const { error } = await supabase.auth.updateUser({ password: passwordData.new });
    if (error) alert("Error: " + error.message);
    else { alert("Password successfully updated!"); setPasswordData({ old: "", new: "" }); }
  };

  const buyCredits = async (amount: number) => {
    if (!user) return;
    const newTotal = userCredits + amount;
    const { error } = await supabase.from('users').update({ credits: newTotal }).eq('id', user.id);
    if (error) alert("Transaction error: " + error.message);
    else { setUserCredits(newTotal); alert(`Success! ${amount} credits added.`); }
  };

  if (!user) return <p style={styles.loading}>Loading StoryForge AI...</p>;

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div style={styles.heroSection}>
            <div style={styles.welcomeBadge}>🚀 NEXT-GEN AI CONTENT ENGINE</div>
            <h1 style={styles.glowTitle}>The Only Tool You Need for <span style={{color: '#10b981'}}>Viral Success.</span></h1>
            <p style={styles.heroSubtitle}>Join <strong>100,000+ top-tier creators</strong> who are dominating TikTok, Reels, and Shorts. Your personal AI factory is primed and ready.</p>

            <div style={styles.socialProofBar}>
                <div style={styles.proofItem}>⭐ 4.9/5 TrustScore</div>
                <div style={styles.proofItem}>👥 100K+ Active Creators</div>
                <div style={styles.proofItem}>🔥 1M+ Clips Generated</div>
            </div>

            {/* FOLYAMATOSAN MENŐ VIDEÓ */}
            <div style={styles.videoShowcaseContainer}>
                <div style={styles.videoWrapper}>
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    >
                        <source src="/promo_video.mp4" type="video/mp4" />
                        {/* Ha nincs videód még, egy YouTube embed is mehet ide, de az AutoPlay-hez ezek a paraméterek kellenek: */}
                        {/* <iframe width="100%" height="100%" src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe> */}
                    </video>
                </div>
                <div style={styles.videoDescription}>
                    <h3 style={{margin: '0 0 10px 0', color: '#10b981'}}>AI Content Masterclass</h3>
                    <p style={{margin: 0, color: '#94a3b8', fontSize: '14px'}}>StoryForge AI handles the research, scripting, and editing. You just handle the views.</p>
                </div>
            </div>
            
            <div style={styles.statsOverview}>
                <div style={styles.miniStat}><span style={styles.miniStatLabel}>Server Status</span><span style={styles.miniStatValue}><span style={styles.onlineDot}></span> 99.9% Uptime</span></div>
                <div style={styles.miniStat}><span style={styles.miniStatLabel}>Your Rank</span><span style={styles.miniStatValue}>Top {Math.max(1, 100 - userStats.rank)}%</span></div>
                <div style={styles.miniStat}><span style={styles.miniStatLabel}>AI Engine</span><span style={styles.miniStatValue}>Turbo v4.2</span></div>
            </div>

            <div style={styles.featureGrid}>
              <div style={{...styles.featureCard, border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.05)'}}>
                <div style={styles.iconCircle}>⚡</div>
                <h3 style={styles.featureTitle}>Instant Creation</h3>
                <p style={styles.featureText}>Generate viral-ready scripts and clips in under 60 seconds. High retention guaranteed.</p>
                <button onClick={() => setActiveTab("Create")} style={styles.actionBtn}>START CREATING</button>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.iconCircle}>💰</div>
                <h3 style={styles.featureTitle}>Pro Credits</h3>
                <p style={styles.featureText}>Refill your tank and scale your channels to the moon with our cheapest rates.</p>
                <button onClick={() => setActiveTab("Credits")} style={styles.secondaryBtn}>REFILL NOW</button>
              </div>
            </div>

            <div style={styles.trendBox}>
                <h4 style={{margin: 0, fontSize: '14px', color: '#10b981'}}>🔥 VIRAL NOW:</h4>
                <p style={{margin: 0, fontSize: '14px', color: '#9ca3af'}}>"AI Mystery Stories" and "Minecraft Parkour Backgrounds" are trending!</p>
            </div>
          </div>
        );

      case "Create":
  return (
    <div style={{...styles.heroSection, alignItems: 'flex-start', textAlign: 'left'}}>
      <h1 style={styles.glowTitle}>The Studio</h1>
      <p style={{color: '#94a3b8', marginBottom: '30px', fontSize: '16px'}}>Select a professional AI tool to start your viral journey for FREE!</p>
      
      <div style={{...styles.createToolContainer, flexWrap: 'wrap', gap: '25px'}}>
        {/* FLASH CREATE */}
        <div style={styles.verticalToolCard}>
          <img src="/flash.png" alt="Flash Create" style={styles.verticalToolImage} />
          <div style={styles.toolContent}>
            <h3 style={styles.toolTitle}>Flash Create</h3>
            <p style={styles.toolUsage}>Usage: <span style={{color: '#0e9119'}}>20 credits</span></p>
            <p style={styles.toolDescription}>Make viral clips in 1 minute using Flash Create technology!</p>
            <button onClick={() => router.push("/flashcreate")} style={styles.startBtn}>START</button>
          </div>
        </div>

        {/* CHANNEL ANALYZE */}
        <div style={{...styles.verticalToolCard, border: '1px solid #0e9119'}}>
          <img src="/analyze.png" alt="Channel Analyze" style={styles.verticalToolImage} />
          <div style={styles.toolContent}>
            <h3 style={{...styles.toolTitle, color: '#ffffff'}}>Channel Analyze</h3>
            <p style={styles.toolUsage}>Usage: <span style={{color: '#0e9119'}}>15 - 45 credits</span></p>
            <p style={styles.toolDescription}>Analyze any channel niche and get a full AI content schedule.</p>
            <button onClick={() => router.push("/analyze")} style={{...styles.startBtn, backgroundColor: '#07db47'}}>ANALYZE</button>
          </div>
        </div>

        {/* STORY GENERATOR */}
        <div style={{...styles.verticalToolCard, border: '1px solid #0e9119'}}>
          <img src="/story.png" alt="Story Generator" style={styles.verticalToolImage} />
          <div style={styles.toolContent}>
            <h3 style={{...styles.toolTitle, color: '#ffffff'}}>Story Generator</h3>
            <p style={styles.toolUsage}>Usage: <span style={{color: '#0e9119'}}>25 credits</span></p>
            <p style={styles.toolDescription}>Create hook-heavy viral scripts and plot twists instantly.</p>
            <button onClick={() => router.push("/storygen")} style={{...styles.startBtn, backgroundColor: '#07db47'}}>WRITE STORY</button>
          </div>
        </div>

        {/* ÚJ: SCRIPT GENERATOR */}
        <div style={{...styles.verticalToolCard, border: '1px solid #0e9119'}}>
          <img src="/script.png" alt="Script Generator" style={styles.verticalToolImage} />
          <div style={styles.toolContent}>
            <h3 style={{...styles.toolTitle, color: '#ffffff'}}>Script Generator</h3>
            <p style={styles.toolUsage}>Usage: <span style={{color: '#0e9119'}}>5 credits</span></p>
            <p style={styles.toolDescription}>Turn any idea into a high-retention video script via ChatGPT-4o API.</p>
            <button onClick={() => router.push("/scriptwriter")} style={{...styles.startBtn, backgroundColor: '#07db47', boxShadow: '0 4px 14px 0 rgba(167, 139, 250, 0.3)'}}>GENERATE SCRIPT</button>
          </div>
        </div>
      </div>
    </div>
  );

      case "Credits":
        return (
          <div style={styles.heroSection}>
            <h1 style={styles.glowTitle}>Fuel Your AI Journey</h1>
            <p style={styles.heroSubtitle}>Your balance: <strong>{userCredits}</strong></p>
            <div style={styles.pricingGrid}>
              <div style={styles.priceCard}>
                <span style={{...styles.badge, color: '#60a5fa'}}>🔵 Starter</span>
                <div style={styles.priceValue}>$3</div>
                <ul style={styles.planList}><li>• 25 Credits</li><li>• Basic AI Voices</li><li style={styles.disabledItem}>• No Autopilot</li></ul>
                <button onClick={() => buyCredits(25)} style={{...styles.planBtn, border: '1px solid #60a5fa', color: '#60a5fa'}}>Buy Now</button>
              </div>
              <div style={styles.priceCard}>
                <span style={{...styles.badge, color: '#a78bfa'}}>🟣 Pro</span>
                <div style={styles.priceValue}>$7</div>
                <ul style={styles.planList}><li>• 60 Credits</li><li>• Pro AI Voices</li><li>• Autopilot</li></ul>
                <button onClick={() => buyCredits(60)} style={{...styles.planBtn, border: '1px solid #a78bfa', color: '#a78bfa'}}>Buy Now</button>
              </div>
              <div style={{...styles.priceCard, ...styles.highlightCard}}>
                <div style={styles.viralBadge}>BEST VALUE</div>
                <span style={{...styles.badge, color: '#f87171'}}>🔴 Viral Clipper</span>
                <div style={{...styles.priceValue, fontSize: '54px', color: '#f87171'}}>$13</div>
                <ul style={styles.planList}><li>• 120 Credits</li><li>• ALL AI Features</li><li>• Unlimited Autopilot</li></ul>
                <button onClick={() => buyCredits(120)} style={styles.viralBtn}>Buy Now</button>
              </div>
            </div>
          </div>
        );

      case "Profile":
        return (
          <div style={styles.profileContainer}>
            <h1 style={styles.glowTitle}>Account Settings</h1>
            <div style={styles.profileGridMain}>
              <div style={styles.profileCardSide}>
                <h3 style={styles.featureTitle}>Information</h3>
                <div style={styles.statsBox}>
                  <div style={styles.infoRow}><span style={styles.infoLabel}>Email:</span> <span style={styles.infoValue}>{user.email}</span></div>
                  <div style={styles.infoRow}><span style={styles.infoLabel}>Member Since:</span> <span style={styles.infoValue}>{userStats.joinDate}</span></div>
                  <div style={styles.infoRow}><span style={styles.infoLabel}>User Rank:</span> <span style={styles.infoValue}>#{userStats.rank}</span></div>
                </div>
              </div>
              <div style={styles.profileCardSide}>
                <h3 style={styles.featureTitle}>Security</h3>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>New Password</label>
                  <input type="password" style={styles.profileInput} placeholder="New password" value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} />
                </div>
                <button onClick={handlePasswordChange} style={styles.saveBtn}>Update Password</button>
              </div>
            </div>
          </div>
        );

      case "About Us":
        return (
          <div style={styles.heroSection}>
            <div style={styles.welcomeBadge}>THE FUTURE OF CONTENT</div>
            <h1 style={styles.glowTitle}>Elevating Digital Storytelling</h1>
            <p style={styles.aboutText}>StoryForge AI is the engine of your digital empire. We transform content creation from a chore into a single click.</p>
            <div style={styles.aboutGrid}>
              <div style={styles.aboutCard}><h3>🎯 The Mission</h3><p>We democratize content creation for everyone.</p></div>
              <div style={styles.aboutCard}><h3>⚡ The Speed</h3><p>What used to take days now takes minutes.</p></div>
            </div>
            <div style={styles.authorSection}>
              <p style={styles.signature}>Developed by <span style={styles.highlightName}>TomX</span></p>
              <p style={styles.copyright}>© 2026 storyforgeai • All Rights Reserved</p>
            </div>
          </div>
        );

      default: return <h1 style={styles.glowTitle}>{activeTab}</h1>;
    }
  };

  return (
    <main style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoFlexWrapper}>
            <img src="/logo.png" alt="Logo" style={styles.sidebarLogoIcon} />
            <h2 style={styles.logoText}>StoryForge</h2>
          </div>
        </div>
        <nav style={styles.nav}>
          {["Dashboard", "Credits", "Profile", "About Us"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{...styles.navItem, backgroundColor: activeTab === tab ? "#10b981" : "transparent", color: activeTab === tab ? "white" : "#9ca3af"}}>{tab}</button>
          ))}
          <div style={styles.createWrapper}><button onClick={() => setActiveTab("Create")} style={styles.imageBtnBase}><img src="/plusz.png" alt="Create" style={styles.plusImage} /></button></div>
        </nav>
        <div style={styles.userInfoBox}>
          <p style={styles.userEmailSidebar}>{user.email}</p>
          <div style={styles.userCreditLineSidebar}>🪙 {userCredits} Credits</div>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} style={styles.logoutBtn}>Logout</button>
      </aside>
      <section style={styles.contentArea}>
        <div style={styles.topBar}>
          <div style={styles.creditBadge}><span style={styles.creditAmount}>🪙 {userCredits} CREDITS</span></div>
        </div>
        <div style={styles.card}>{renderContent()}</div>
      </section>
    </main>
  );
}

// ... Stílusok maradnak az előzőek, minden benne van ...
const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: '"Inter", sans-serif', overflow: 'hidden' },
  sidebar: { width: '280px', minWidth: '280px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', padding: '40px 20px', borderRight: '1px solid #1e293b' },
  logoArea: { marginBottom: '50px' },
  logoFlexWrapper: { display: 'flex', alignItems: 'center', gap: '12px' },
  sidebarLogoIcon: { width: '120px', height: '120px', borderRadius: '12px' },
  logoText: { color: 'white', fontWeight: '900', fontSize: '22px', margin: 0 },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
  navItem: { width: '100%', border: 'none', textAlign: 'left', padding: '14px 20px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', borderRadius: '16px', transition: 'all 0.2s' },
  createWrapper: { marginTop: '20px', display: 'flex', justifyContent: 'center' },
  plusImage: { width: '80px', height: '80px', filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.5))' },
  imageBtnBase: { background: 'none', border: 'none', cursor: 'pointer' },
  userInfoBox: { padding: '20px', backgroundColor: '#1e293b', borderRadius: '20px', marginBottom: '15px', border: '1px solid #334155' },
  userEmailSidebar: { fontSize: '11px', color: '#94a3b8', overflow: 'hidden' },
  userCreditLineSidebar: { fontSize: '16px', fontWeight: 'bold', color: '#10b981', marginTop: '5px' },
  contentArea: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' },
  creditBadge: { backgroundColor: '#0f172a', padding: '10px 25px', borderRadius: '50px', border: '1px solid #10b981' },
  creditAmount: { fontWeight: '900', color: 'white', fontSize: '14px' },
  card: { backgroundColor: '#0f172a', width: '100%', maxWidth: '1250px', borderRadius: '40px', padding: '60px', border: '1px solid #1e293b', alignSelf: 'center' },
  heroSection: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  glowTitle: { fontSize: '50px', fontWeight: '950', color: 'white', marginBottom: '20px', lineHeight: '1.1' },
  heroSubtitle: { fontSize: '18px', color: '#94a3b8', maxWidth: '800px', marginBottom: '40px' },
  welcomeBadge: { backgroundColor: '#10b98122', color: '#10b981', padding: '8px 20px', borderRadius: '50px', fontSize: '12px', fontWeight: '900', marginBottom: '20px', border: '1px solid #10b98144' },
  socialProofBar: { display: 'flex', gap: '30px', marginBottom: '50px', padding: '15px 40px', backgroundColor: '#1e293b', borderRadius: '100px', border: '1px solid #334155' },
  proofItem: { fontSize: '14px', fontWeight: '800', color: '#f8fafc' },
  videoShowcaseContainer: { width: '100%', maxWidth: '900px', marginBottom: '60px', borderRadius: '32px', overflow: 'hidden', border: '1px solid #334155' },
  videoWrapper: { width: '100%', aspectRatio: '16/9', backgroundColor: 'black' },
  videoDescription: { padding: '20px', backgroundColor: '#1e293b', textAlign: 'left' },
  statsOverview: { display: 'flex', gap: '20px', marginBottom: '40px', width: '100%', justifyContent: 'center' },
  miniStat: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '24px', border: '1px solid #334155', flex: 1 },
  miniStatLabel: { display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' },
  miniStatValue: { fontSize: '18px', fontWeight: '900', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  onlineDot: { width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', width: '100%' },
  featureCard: { padding: '40px', borderRadius: '32px', backgroundColor: '#1e293b', textAlign: 'left' },
  iconCircle: { fontSize: '40px', marginBottom: '20px' },
  featureTitle: { fontSize: '24px', fontWeight: '900', color: '#10b981', marginBottom: '15px' },
  featureText: { fontSize: '15px', color: '#94a3b8', lineHeight: '1.6' },
  actionBtn: { width: '100%', padding: '18px', backgroundColor: '#10b981', border: 'none', borderRadius: '16px', color: 'white', fontWeight: '900', cursor: 'pointer', marginTop: '20px' },
  secondaryBtn: { width: '100%', padding: '18px', backgroundColor: 'transparent', border: '1px solid #334155', borderRadius: '16px', color: 'white', fontWeight: '900', cursor: 'pointer', marginTop: '20px' },
  trendBox: { marginTop: '50px', padding: '20px', backgroundColor: '#020617', borderRadius: '20px', border: '1px dashed #10b981', display: 'flex', gap: '15px' },
  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%' },
  priceCard: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  highlightCard: { border: '2px solid #f87171', transform: 'scale(1.05)' },
  viralBadge: { backgroundColor: '#f87171', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', marginBottom: '10px' },
  badge: { fontSize: '16px', fontWeight: '800', marginBottom: '15px' },
  priceValue: { fontSize: '42px', fontWeight: '900', color: 'white' },
  planList: { listStyle: 'none', padding: 0, margin: '20px 0', textAlign: 'left', fontSize: '14px' },
  disabledItem: { color: '#4b5563', textDecoration: 'line-through' },
  planBtn: { width: '100%', padding: '12px', borderRadius: '12px', background: 'transparent', fontWeight: 'bold', cursor: 'pointer' },
  viralBtn: { width: '100%', padding: '15px', borderRadius: '12px', background: '#f87171', border: 'none', color: 'white', fontWeight: '900', cursor: 'pointer' },
  createToolContainer: { display: 'flex', width: '100%', marginTop: '30px' },
  verticalToolCard: { backgroundColor: '#1e293b', width: '320px', borderRadius: '28px', border: '1px solid #334155', overflow: 'hidden' },
  verticalToolImage: { width: '100%', height: '180px', objectFit: 'cover' },
  toolContent: { padding: '20px' },
  toolTitle: { fontSize: '22px', fontWeight: 'bold', color: 'white' },
  toolUsage: { fontSize: '14px', color: '#94a3b8' },
  toolDescription: { fontSize: '14px', color: '#94a3b8', margin: '15px 0' },
  startBtn: { width: '100%', padding: '12px', backgroundColor: '#07db47', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '900', cursor: 'pointer' },
  profileContainer: { width: '100%' },
  profileGridMain: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  profileCardSide: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid #334155' },
  statsBox: { display: 'flex', flexDirection: 'column', gap: '15px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '8px' },
  infoLabel: { color: '#94a3b8', fontSize: '14px' },
  infoValue: { color: 'white', fontSize: '14px', fontWeight: 'bold' },
  inputGroup: { marginBottom: '20px' },
  inputLabel: { display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' },
  profileInput: { width: '100%', padding: '14px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', color: 'white' },
  saveBtn: { width: '100%', padding: '14px', backgroundColor: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold' },
  aboutText: { fontSize: '18px', color: '#94a3b8', maxWidth: '800px', marginBottom: '30px' },
  aboutGrid: { display: 'flex', gap: '20px', marginBottom: '40px' },
  aboutCard: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid #334155', flex: 1, textAlign: 'left' },
  authorSection: { marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '30px' },
  signature: { fontSize: '18px' },
  highlightName: { color: '#10b981', fontWeight: 'bold' },
  copyright: { color: '#64748b', fontSize: '12px', marginTop: '10px' },
  loading: { textAlign: 'center', marginTop: '100px', color: '#10b981', fontSize: '20px', fontWeight: '900' },
  logoutBtn: { marginTop: 'auto', padding: '14px', color: '#ef4444', background: 'transparent', border: '1px solid #ef4444', borderRadius: '16px', cursor: 'pointer', fontWeight: '800' }
};