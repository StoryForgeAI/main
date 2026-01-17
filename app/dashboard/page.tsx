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

  if (!user) return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', backgroundColor:'#020617'}}>
       <p style={styles.loading}>INITIALIZING STORYFORGE AI...</p>
    </div>
  );

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
                <div style={styles.proofItem}>👥 100K+ Creators</div>
                <div style={styles.proofItem}>🔥 1M+ Clips Generated</div>
            </div>

            <div style={styles.videoShowcaseContainer}>
                <div style={styles.videoWrapper}>
                    <video autoPlay loop muted playsInline style={{width: '100%', height: '100%', objectFit: 'cover'}}>
                        <source src="/promo_video.mp4" type="video/mp4" />
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
              <div style={{...styles.featureCard, border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)'}}>
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
            <p style={{color: '#94a3b8', marginBottom: '30px', fontSize: '16px'}}>Select a professional AI tool to start your viral journey!</p>
            
            <div style={{...styles.createToolContainer, flexWrap: 'wrap', gap: '25px'}}>
              {/* Tool kártyák a kért stílusban */}
              {[
                { id: "flash", title: "Flash Create", usage: "20 credits", img: "/flash.png", desc: "Make viral clips in 1 minute using Flash technology!", btn: "START", route: "/flashcreate" },
                { id: "analyze", title: "Channel Analyze", usage: "15-45 credits", img: "/analyze.png", desc: "Analyze any niche and get a full AI content schedule.", btn: "ANALYZE", route: "/analyze" },
                { id: "story", title: "Story Generator", usage: "25 credits", img: "/story.png", desc: "Create hook-heavy viral scripts and plot twists instantly.", btn: "WRITE STORY", route: "/storygen" },
                { id: "script", title: "Script Generator", usage: "5 credits", img: "/script.png", desc: "Turn any idea into a high-retention script via GPT-4o.", btn: "GENERATE SCRIPT", route: "/scriptwriter" }
              ].map(tool => (
                <div key={tool.id} style={styles.verticalToolCard}>
                  <img src={tool.img} alt={tool.title} style={styles.verticalToolImage} />
                  <div style={styles.toolContent}>
                    <h3 style={styles.toolTitle}>{tool.title}</h3>
                    <p style={styles.toolUsage}>Usage: <span style={{color: '#10b981'}}>{tool.usage}</span></p>
                    <p style={styles.toolDescription}>{tool.desc}</p>
                    <button onClick={() => router.push(tool.route)} style={styles.startBtn}>{tool.btn}</button>
                  </div>
                </div>
              ))}
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
              <div style={{...styles.priceCard, ...styles.highlightCard}}>
                <div style={styles.viralBadge}>BEST VALUE</div>
                <span style={{...styles.badge, color: '#f87171'}}>🔴 Viral Clipper</span>
                <div style={{...styles.priceValue, fontSize: '54px', color: '#f87171'}}>$13</div>
                <ul style={styles.planList}><li>• 120 Credits</li><li>• ALL AI Features</li><li>• Unlimited Autopilot</li></ul>
                <button onClick={() => buyCredits(120)} style={styles.viralBtn}>Buy Now</button>
              </div>
              <div style={styles.priceCard}>
                <span style={{...styles.badge, color: '#a78bfa'}}>🟣 Pro</span>
                <div style={styles.priceValue}>$7</div>
                <ul style={styles.planList}><li>• 60 Credits</li><li>• Pro AI Voices</li><li>• Autopilot</li></ul>
                <button onClick={() => buyCredits(60)} style={{...styles.planBtn, border: '1px solid #a78bfa', color: '#a78bfa'}}>Buy Now</button>
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
      {/* Aurora Background Layer */}
      <div style={styles.auroraBg}>
        <div style={styles.auroraLayer}></div>
      </div>

      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoFlexWrapper}>
            <img src="/logo.png" alt="Logo" style={styles.sidebarLogoIcon} />
            <h2 style={styles.logoText}>StoryForge</h2>
          </div>
        </div>
        <nav style={styles.nav}>
          {["Dashboard", "Credits", "Profile", "About Us"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              ...styles.navItem, 
              backgroundColor: activeTab === tab ? "rgba(16, 185, 129, 0.2)" : "transparent", 
              color: activeTab === tab ? "white" : "#9ca3af",
              border: activeTab === tab ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent"
            }}>
              {tab}
            </button>
          ))}
          <div style={styles.createWrapper}>
            <button onClick={() => setActiveTab("Create")} style={styles.imageBtnBase}>
              <img src="/plusz.png" alt="Create" style={styles.plusImage} />
            </button>
          </div>
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

      <style>{`
        @keyframes aurora-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: '"Plus Jakarta Sans", sans-serif', overflow: 'hidden', position: 'relative' },
  
  // Aurora háttér
  auroraBg: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#020617', pointerEvents: 'none' },
  auroraLayer: { position: 'absolute', width: '200%', height: '200%', top: '-50%', left: '-50%', background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 25%, transparent 50%)', filter: 'blur(100px)', animation: 'aurora-rotate 30s linear infinite' },

  // Sidebar (Glassmorphism)
  sidebar: { width: '280px', minWidth: '280px', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', padding: '40px 20px', borderRight: '1px solid rgba(255, 255, 255, 0.08)', zIndex: 1 },
  logoArea: { marginBottom: '50px' },
  logoFlexWrapper: { display: 'flex', alignItems: 'center', gap: '12px' },
  sidebarLogoIcon: { width: '50px', height: '50px', borderRadius: '12px' },
  logoText: { color: 'white', fontWeight: '800', fontSize: '22px', margin: 0, letterSpacing: '-1px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navItem: { width: '100%', border: 'none', textAlign: 'left', padding: '14px 20px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', borderRadius: '16px', transition: 'all 0.3s' },
  createWrapper: { marginTop: '20px', display: 'flex', justifyContent: 'center' },
  plusImage: { width: '70px', height: '70px', filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.4))' },
  imageBtnBase: { background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' },
  userInfoBox: { padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px', marginBottom: '15px', border: '1px solid rgba(255, 255, 255, 0.05)' },
  userEmailSidebar: { fontSize: '11px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis' },
  userCreditLineSidebar: { fontSize: '16px', fontWeight: 'bold', color: '#10b981', marginTop: '5px' },
  logoutBtn: { marginTop: 'auto', padding: '14px', color: '#ef4444', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', cursor: 'pointer', fontWeight: '800' },

  // Content Area
  contentArea: { flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', overflowY: 'auto', zIndex: 1, position: 'relative' },
  topBar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
  creditBadge: { background: 'rgba(16, 185, 129, 0.1)', padding: '10px 25px', borderRadius: '50px', border: '1px solid rgba(16, 185, 129, 0.3)' },
  creditAmount: { fontWeight: '900', color: '#10b981', fontSize: '14px' },
  card: { background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(15px)', width: '100%', maxWidth: '1200px', borderRadius: '40px', padding: '50px', border: '1px solid rgba(255, 255, 255, 0.05)', alignSelf: 'center' },

  // Hero & Content
  heroSection: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  glowTitle: { fontSize: '42px', fontWeight: '900', color: 'white', marginBottom: '20px', lineHeight: '1.1', letterSpacing: '-1.5px' },
  heroSubtitle: { fontSize: '17px', color: '#94a3b8', maxWidth: '700px', marginBottom: '40px', lineHeight: '1.6' },
  welcomeBadge: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '8px 20px', borderRadius: '50px', fontSize: '11px', fontWeight: '900', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' },
  socialProofBar: { display: 'flex', gap: '25px', marginBottom: '40px', padding: '12px 35px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '100px', border: '1px solid rgba(255, 255, 255, 0.05)' },
  proofItem: { fontSize: '13px', fontWeight: '700', color: '#f8fafc' },
  
  // Video & Stats
  videoShowcaseContainer: { width: '100%', maxWidth: '850px', marginBottom: '50px', borderRadius: '30px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' },
  videoWrapper: { width: '100%', aspectRatio: '16/9', background: '#000' },
  videoDescription: { padding: '20px', background: 'rgba(30, 41, 59, 0.5)', textAlign: 'left' },
  statsOverview: { display: 'flex', gap: '15px', marginBottom: '40px', width: '100%' },
  miniStat: { background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', flex: 1 },
  miniStatLabel: { display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase' },
  miniStatValue: { fontSize: '17px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  onlineDot: { width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' },
  
  // Features & Tools
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', width: '100%' },
  featureCard: { padding: '35px', borderRadius: '30px', background: 'rgba(255, 255, 255, 0.02)', textAlign: 'left', border: '1px solid rgba(255, 255, 255, 0.05)' },
  iconCircle: { fontSize: '35px', marginBottom: '15px' },
  featureTitle: { fontSize: '22px', fontWeight: '800', color: '#10b981', marginBottom: '12px' },
  featureText: { fontSize: '14px', color: '#94a3b8', lineHeight: '1.5' },
  actionBtn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', border: 'none', borderRadius: '15px', color: '#020617', fontWeight: '800', cursor: 'pointer', marginTop: '15px' },
  secondaryBtn: { width: '100%', padding: '16px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '15px', color: 'white', fontWeight: '800', cursor: 'pointer', marginTop: '15px' },
  trendBox: { marginTop: '40px', padding: '18px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '18px', border: '1px dashed rgba(16, 185, 129, 0.3)', display: 'flex', gap: '15px', alignItems: 'center' },
  
  // Create Studio
  createToolContainer: { display: 'flex', width: '100%' },
  verticalToolCard: { background: 'rgba(255, 255, 255, 0.03)', width: '260px', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden', transition: 'transform 0.3s' },
  verticalToolImage: { width: '100%', height: '150px', objectFit: 'cover', opacity: 0.8 },
  toolContent: { padding: '20px' },
  toolTitle: { fontSize: '19px', fontWeight: '800', color: 'white', marginBottom: '5px' },
  toolUsage: { fontSize: '13px', fontWeight: '600' },
  toolDescription: { fontSize: '13px', color: '#94a3b8', margin: '12px 0', minHeight: '40px' },
  startBtn: { width: '100%', padding: '12px', background: '#10b981', border: 'none', borderRadius: '12px', color: '#020617', fontWeight: '800', cursor: 'pointer' },
  
  // Pricing
  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%', marginTop: '30px' },
  priceCard: { background: 'rgba(255, 255, 255, 0.03)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  highlightCard: { border: '2px solid rgba(248, 113, 113, 0.5)', background: 'rgba(248, 113, 113, 0.05)', transform: 'scale(1.05)' },
  viralBadge: { background: '#f87171', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '9px', fontWeight: '900', marginBottom: '10px' },
  badge: { fontSize: '15px', fontWeight: '800', marginBottom: '10px' },
  priceValue: { fontSize: '38px', fontWeight: '900', color: 'white' },
  planList: { listStyle: 'none', padding: 0, margin: '20px 0', textAlign: 'left', fontSize: '13px', color: '#94a3b8' },
  disabledItem: { color: '#4b5563', textDecoration: 'line-through' },
  planBtn: { width: '100%', padding: '12px', borderRadius: '12px', background: 'transparent', fontWeight: '800', cursor: 'pointer', transition: '0.3s' },
  viralBtn: { width: '100%', padding: '15px', borderRadius: '12px', background: '#f87171', border: 'none', color: 'white', fontWeight: '900', cursor: 'pointer' },

  // Profile & About
  profileContainer: { width: '100%' },
  profileGridMain: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
  profileCardSide: { background: 'rgba(255, 255, 255, 0.03)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' },
  statsBox: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px' },
  infoLabel: { color: '#94a3b8', fontSize: '13px' },
  infoValue: { color: 'white', fontSize: '13px', fontWeight: '700' },
  inputGroup: { marginBottom: '20px' },
  inputLabel: { display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' },
  profileInput: { width: '100%', padding: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none' },
  saveBtn: { width: '100%', padding: '14px', background: '#10b981', border: 'none', borderRadius: '12px', color: '#020617', fontWeight: '800' },
  aboutText: { fontSize: '17px', color: '#94a3b8', maxWidth: '750px', marginBottom: '30px', lineHeight: '1.6' },
  aboutGrid: { display: 'flex', gap: '20px', marginBottom: '40px' },
  aboutCard: { background: 'rgba(255, 255, 255, 0.03)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', flex: 1, textAlign: 'left' },
  authorSection: { marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px' },
  signature: { fontSize: '17px', color: 'white' },
  highlightName: { color: '#10b981', fontWeight: '800' },
  copyright: { color: '#4b5563', fontSize: '11px', marginTop: '10px' },
  loading: { textAlign: 'center', color: '#10b981', fontSize: '18px', fontWeight: '900', letterSpacing: '2px' }
};