"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userCredits, setUserCredits] = useState<number>(0);
  
  // Profile states
  const [userStats, setUserStats] = useState({ joinDate: "", rank: 0 });
  const [passwordData, setPasswordData] = useState({ old: "", new: "" });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/register");
      } else {
        setUser(user);
        
        // Fetch credits
        const { data } = await supabase
          .from('users')
          .select('credits')
          .eq('id', user.id)
          .single();
        
        if (data) setUserCredits(data.credits);

        // Fetch user rank based on creation date
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .lte('created_at', user.created_at);

        setUserStats({
          joinDate: new Date(user.created_at).toLocaleDateString('en-US'),
          rank: count || 0
        });
      }
    };
    checkUser();
  }, [router]);

  // Handle password change
  const handlePasswordChange = async () => {
    if (!passwordData.new) return alert("Please enter a new password");
    const { error } = await supabase.auth.updateUser({ password: passwordData.new });
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Password successfully updated!");
      setPasswordData({ old: "", new: "" });
    }
  };

  // Handle credit purchase
  const buyCredits = async (amount: number) => {
    if (!user) return;
    const newTotal = userCredits + amount;
    const { error } = await supabase.from('users').update({ credits: newTotal }).eq('id', user.id);
    if (error) alert("Transaction error: " + error.message);
    else {
        setUserCredits(newTotal);
        alert(`Success! ${amount} credits added to your account.`);
    }
  };

  if (!user) return <p style={styles.loading}>Loading StoryForge...</p>;

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div style={styles.heroSection}>
            <div style={styles.welcomeBadge}>WELCOME BACK, CREATOR 👋</div>
            <h1 style={styles.glowTitle}>Run Your Channels on Autopilot</h1>
            <p style={styles.heroSubtitle}>Your personal AI content factory is ready. What are we building today?</p>
            
            <div style={styles.statsOverview}>
                <div style={styles.miniStat}>
                    <span style={styles.miniStatLabel}>System Status</span>
                    <span style={styles.miniStatValue}><span style={styles.onlineDot}></span> Operational</span>
                </div>
                <div style={styles.miniStat}>
                    <span style={styles.miniStatLabel}>Your Rank</span>
                    <span style={styles.miniStatValue}>Top {Math.max(1, 100 - userStats.rank)}%</span>
                </div>
                <div style={styles.miniStat}>
                    <span style={styles.miniStatLabel}>AI Power</span>
                    <span style={styles.miniStatValue}>Turbo v3.5</span>
                </div>
            </div>

            <div style={styles.featureGrid}>
              <div style={{...styles.featureCard, border: '1px solid #10b981'}}>
                <div style={styles.iconCircle}>🎬</div>
                <h3 style={styles.featureTitle}>Quick Create</h3>
                <p style={styles.featureText}>Generate high-quality viral clips and strategies in seconds using AI.</p>
                <button onClick={() => setActiveTab("Create")} style={styles.actionBtn}>Start Now</button>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.iconCircle}>✅</div>
                <h3 style={styles.featureTitle}>Cheap Credits</h3>
                <p style={styles.featureText}>Buy credits for cheap, and make the best videos on the internet!</p>
                <button onClick={() => setActiveTab("Credits")} style={styles.secondaryBtn}>Buy credits</button>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.iconCircle}>🚀</div>
                <h3 style={styles.featureTitle}>Analytics</h3>
                <p style={styles.featureText}>Track your growth across TikTok, Reels, and YouTube Shorts.</p>
                <button style={styles.disabledBtn}>Coming Soon</button>
              </div>
            </div>

            <div style={styles.trendBox}>
                <h4 style={{margin: 0, fontSize: '14px', color: '#10b981'}}>🔥 CURRENTLY VIRAL:</h4>
                <p style={{margin: 0, fontSize: '14px', color: '#9ca3af'}}>"Ronaldo MEME" & "Stranger Things edits" are trending!</p>
            </div>
          </div>
        );

      case "Create":
        return (
          <div style={{...styles.heroSection, alignItems: 'flex-start', textAlign: 'left'}}>
            <h1 style={styles.glowTitle}>Create Your Factory</h1>
            <div style={styles.createToolContainer}>
              
              {/* Flash Create Card */}
              <div style={styles.verticalToolCard}>
                <img src="/flash.png" alt="Flash Create" style={styles.verticalToolImage} />
                <div style={styles.toolContent}>
                  <h3 style={styles.toolTitle}>Flash Create</h3>
                  <p style={styles.toolUsage}>Usage: <span style={{color: '#10b981'}}>20 credits</span></p>
                  <p style={styles.toolDescription}>Make viral clips in 1 minute using Flash Create technology!</p>
                  <button onClick={() => router.push("/flashcreate")} style={styles.startBtn}>START</button>
                </div>
              </div>

              {/* Channel Analyze Card */}
              <div style={{...styles.verticalToolCard, marginLeft: '25px', border: '1px solid #60a5fa'}}>
                <img src="/analyze.png" alt="Channel Analyze" style={styles.verticalToolImage} />
                <div style={styles.toolContent}>
                  <h3 style={{...styles.toolTitle, color: '#60a5fa'}}>Channel Analyze</h3>
                  <p style={styles.toolUsage}>Usage: <span style={{color: '#60a5fa'}}>15 - 45 credits</span></p>
                  <p style={styles.toolDescription}>Analyze any channel niche and get a full AI content schedule with scripts.</p>
                  <button onClick={() => router.push("/analyze")} style={{...styles.startBtn, backgroundColor: '#60a5fa', boxShadow: '0 4px 14px 0 rgba(96, 165, 250, 0.3)'}}>ANALYZE</button>
                </div>
              </div>

            </div>
          </div>
        );

      case "Credits":
        return (
          <div style={styles.heroSection}>
            <h1 style={styles.glowTitle}>Fuel Your AI Journey</h1>
            <p style={styles.heroSubtitle}>Power up your production. Your balance: <strong>{userCredits}</strong></p>
            <div style={styles.pricingGrid}>
              <div style={styles.priceCard}>
                <span style={{...styles.badge, color: '#60a5fa'}}>🔵 Starter</span>
                <div style={styles.priceValue}>$3</div>
                <ul style={styles.planList}>
                  <li>• 25 Credits</li>
                  <li>• Basic AI Voices</li>
                  <li style={styles.disabledItem}>• No Autopilot</li>
                </ul>
                <button onClick={() => buyCredits(25)} style={{...styles.planBtn, border: '1px solid #60a5fa', color: '#60a5fa'}}>Buy Now</button>
              </div>
              <div style={styles.priceCard}>
                <span style={{...styles.badge, color: '#a78bfa'}}>🟣 Pro</span>
                <div style={styles.priceValue}>$7</div>
                <ul style={styles.planList}>
                  <li>• 60 Credits</li>
                  <li>• Pro AI Voices</li>
                  <li>• Manual Download</li>
                  <li>• Autopilot </li>
                </ul>
                <button onClick={() => buyCredits(60)} style={{...styles.planBtn, border: '1px solid #a78bfa', color: '#a78bfa'}}>Buy Now</button>
              </div>
              <div style={{...styles.priceCard, ...styles.highlightCard}}>
                <div style={styles.viralBadge}>BEST VALUE</div>
                <span style={{...styles.badge, color: '#f87171'}}>🔴 Viral Clipper</span>
                <div style={{...styles.priceValue, fontSize: '54px', color: '#f87171'}}>$13</div>
                <ul style={styles.planList}>
                  <li>• 120 Credits</li>
                  <li>• <strong>ALL</strong> AI Features</li>
                  <li>• <strong>Unlimited</strong> Autopilot</li>
                  <li>• Priority Support</li>
                </ul>
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
                  <input 
                    type="password" 
                    style={styles.profileInput} 
                    placeholder="Enter new password"
                    value={passwordData.new} 
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  />
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
            <p style={styles.aboutText}>
              StoryForge AI is not just a tool—it's the engine of your digital empire. 
              We created it to transform content creation from a chore into a single click.
            </p>
            <div style={styles.aboutGrid}>
              <div style={styles.aboutCard}>
                <div style={styles.iconCircle}>🎯</div>
                <h3 style={styles.featureTitle}>The Mission</h3>
                <p style={styles.featureText}>We democratize content creation. No more need for expensive editors or hours of creative block.</p>
              </div>
              <div style={styles.aboutCard}>
                <div style={styles.iconCircle}>⚡</div>
                <h3 style={styles.featureTitle}>The Speed</h3>
                <p style={styles.featureText}>What used to take days now takes minutes. Our AI models are trained on the latest viral trends.</p>
              </div>
            </div>
            <div style={styles.authorSection}>
              <p style={styles.signature}>Founded and Developed by <span style={styles.highlightName}>TomX</span></p>
              <div style={styles.socialStatus}>
                <span style={styles.statusBadge}>🚀 Global Version 1.2</span>
                <span style={styles.statusBadge}>🌍 100% Cloud Based</span>
              </div>
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
        <div style={styles.logoArea}><h2 style={styles.logoText}>StoryForge AI</h2></div>
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
          <div style={styles.creditBadge}>
            <span style={{fontSize: '16px'}}>🪙</span>
            <span style={styles.creditAmount}>{userCredits} Credits</span>
          </div>
        </div>
        <div style={styles.card}>{renderContent()}</div>
      </section>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#030712', color: '#f9fafb', fontFamily: '"Inter", sans-serif', overflow: 'hidden' },
  sidebar: { width: '260px', minWidth: '260px', backgroundColor: '#111827', display: 'flex', flexDirection: 'column', padding: '40px 20px', borderRight: '1px solid #1f2937' },
  logoArea: { marginBottom: '50px', textAlign: 'center' },
  logoText: { color: '#10b981', fontWeight: '900', fontSize: '28px', textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
  navItem: { width: '100%', border: 'none', textAlign: 'left', padding: '14px 20px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.3s ease' },
  createWrapper: { marginTop: '20px', display: 'flex', justifyContent: 'center' },
  plusImage: { width: '80px', height: '80px', filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))' },
  imageBtnBase: { background: 'none', border: 'none', cursor: 'pointer' },
  userInfoBox: { padding: '15px', backgroundColor: '#1f2937', borderRadius: '15px', marginBottom: '15px', border: '1px solid #374151' },
  userEmailSidebar: { fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis' },
  userCreditLineSidebar: { fontSize: '14px', fontWeight: 'bold', color: '#10b981', marginTop: '5px' },
  contentArea: { flex: 1, padding: '20px 30px 30px 30px', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
  creditBadge: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#111827', padding: '10px 20px', borderRadius: '50px', border: '1px solid #10b981' },
  creditAmount: { fontWeight: '800', color: 'white', fontSize: '15px' },
  card: { backgroundColor: '#111827', width: '100%', maxWidth: '1200px', borderRadius: '32px', padding: '50px', border: '1px solid #1f2937', alignSelf: 'center', minHeight: '80vh' },
  heroSection: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  glowTitle: { fontSize: '42px', fontWeight: '900', background: 'linear-gradient(to right, #ffffff, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px' },
  heroSubtitle: { fontSize: '18px', color: '#9ca3af', maxWidth: '700px', marginBottom: '40px' },
  welcomeBadge: { backgroundColor: '#10b98122', color: '#10b981', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' },
  statsOverview: { display: 'flex', gap: '20px', marginBottom: '40px', width: '100%', justifyContent: 'center' },
  miniStat: { backgroundColor: '#1f2937', padding: '15px 25px', borderRadius: '16px', border: '1px solid #374151', minWidth: '150px' },
  miniStatLabel: { display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '5px' },
  miniStatValue: { fontSize: '16px', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  onlineDot: { width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' },
  actionBtn: { marginTop: '15px', padding: '10px 20px', backgroundColor: '#10b981', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  secondaryBtn: { marginTop: '15px', padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #374151', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  disabledBtn: { marginTop: '15px', padding: '10px 20px', backgroundColor: '#374151', border: 'none', borderRadius: '10px', color: '#9ca3af', fontWeight: 'bold', cursor: 'not-allowed', width: '100%' },
  trendBox: { marginTop: '40px', padding: '20px', backgroundColor: '#030712', borderRadius: '16px', border: '1px dashed #10b981', display: 'flex', gap: '15px', alignItems: 'center' },
  createToolContainer: { display: 'flex', width: '100%', marginTop: '30px', justifyContent: 'center' },
  verticalToolCard: { backgroundColor: '#1f2937', width: '320px', borderRadius: '28px', border: '1px solid #374151', overflow: 'hidden', transition: '0.3s' },
  verticalToolImage: { width: '100%', height: '200px', objectFit: 'cover', borderBottom: '1px solid #374151' },
  toolContent: { padding: '25px', textAlign: 'left' },
  toolTitle: { fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' },
  toolUsage: { fontSize: '14px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '12px' },
  toolDescription: { fontSize: '14px', color: '#9ca3af', marginBottom: '25px', lineHeight: '1.6' },
  startBtn: { width: '100%', padding: '14px', backgroundColor: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '900', cursor: 'pointer' },
  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', width: '100%' },
  priceCard: { backgroundColor: '#1f2937', padding: '30px 15px', borderRadius: '24px', border: '1px solid #374151', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' },
  highlightCard: { border: '2px solid #f87171', transform: 'scale(1.05)' },
  viralBadge: { position: 'absolute', top: '-12px', backgroundColor: '#f87171', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' },
  badge: { fontSize: '16px', fontWeight: '800', marginBottom: '15px' },
  priceValue: { fontSize: '42px', fontWeight: '900', color: 'white', marginBottom: '20px' },
  planList: { listStyle: 'none', padding: 0, margin: '0 0 25px 0', textAlign: 'left', fontSize: '14px' },
  disabledItem: { color: '#4b5563', textDecoration: 'line-through' },
  planBtn: { width: '100%', padding: '12px', borderRadius: '12px', background: 'transparent', fontWeight: 'bold', cursor: 'pointer' },
  viralBtn: { width: '100%', padding: '15px', borderRadius: '12px', background: '#f87171', border: 'none', color: 'white', fontWeight: '900', cursor: 'pointer' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%' },
  featureCard: { backgroundColor: '#1f2937', padding: '30px', borderRadius: '24px', border: '1px solid #374151', textAlign: 'left' },
  iconCircle: { fontSize: '32px', marginBottom: '20px' },
  featureTitle: { fontSize: '22px', fontWeight: '800', color: '#10b981', marginBottom: '15px' },
  featureText: { fontSize: '15px', color: '#d1d5db', lineHeight: '1.6' },
  aboutText: { fontSize: '18px', color: '#d1d5db', maxWidth: '800px', marginBottom: '30px' },
  authorSection: { marginTop: '20px', borderTop: '1px solid #374151', paddingTop: '30px' },
  signature: { fontSize: '18px' },
  highlightName: { color: '#10b981', fontWeight: 'bold' },
  copyright: { color: '#6b7280', fontSize: '12px', marginTop: '10px' },
  profileContainer: { width: '100%' },
  profileGridMain: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  profileCardSide: { backgroundColor: '#1f2937', padding: '30px', borderRadius: '24px', border: '1px solid #374151', textAlign: 'left' },
  statsBox: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2d3748', paddingBottom: '8px' },
  infoLabel: { color: '#9ca3af', fontSize: '14px' },
  infoValue: { color: 'white', fontSize: '14px', fontWeight: 'bold' },
  inputGroup: { marginBottom: '20px' },
  inputLabel: { display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px' },
  profileInput: { width: '100%', padding: '14px', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '12px', color: 'white' },
  saveBtn: { width: '100%', padding: '14px', backgroundColor: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  logoutBtn: { padding: '12px', color: '#ef4444', background: 'transparent', border: '1px solid #ef4444', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
  loading: { textAlign: 'center', marginTop: '100px', color: '#10b981', fontSize: '20px' }
};