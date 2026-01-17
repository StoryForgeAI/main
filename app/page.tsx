"use client";
import React, { useEffect, useState } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    window.location.href = "https://sforge.vercel.app/dashboard";
  };

  return (
    <div style={styles.mainWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
        
        :root {
          --emerald: #10b981;
          --deep-forest: #064e3b;
          --black: #050505;
        }

        body {
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: var(--black);
          color: white;
          overflow-x: hidden;
        }

        /* Background Animation */
        .bg-glow {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at 50% -20%, #064e3b 0%, transparent 50%);
          z-index: -1;
          opacity: 0.6;
        }

        .floating {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        .hero-gradient {
          background: linear-gradient(135deg, #fff 30%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.1);
          border-radius: 32px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .glass-card:hover {
          background: rgba(16, 185, 129, 0.05);
          transform: translateY(-10px) scale(1.02);
          border-color: var(--emerald);
        }

        .cta-button {
          background: var(--emerald);
          color: #000;
          padding: 20px 48px;
          border-radius: 100px;
          font-weight: 800;
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .cta-button:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.5);
          background: #34d399;
        }

        .text-reveal {
          animation: reveal 1s cubic-bezier(0.77, 0, 0.175, 1);
        }

        @keyframes reveal {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="bg-glow" />

      {/* Navigation */}
      <nav style={{
        ...styles.nav,
        backgroundColor: scrolled ? 'rgba(5, 5, 5, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none'
      }}>
        <div style={styles.navContent}>
          <div style={styles.logo}>STORY<span style={{color: '#10b981'}}>FORGE</span></div>
          <button onClick={handleGetStarted} style={styles.navBtn}>Launch App</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={styles.hero}>
        <div className="text-reveal" style={styles.heroTextContainer}>
          <div style={styles.statusBadge}>
            <span style={styles.dot}>●</span> 
            SORA AI VIDEO ENGINE IS NOW LIVE
          </div>
          <h1 className="hero-gradient" style={styles.mainTitle}>
            Turn Your Ideas Into <br /> 
            <span style={{fontStyle: 'italic'}}>Viral Masterpieces</span>
          </h1>
          <p style={styles.heroSub}>
            The world's first all-in-one AI creative suite designed for the next generation of content kings. 
            Script, voice, edit, and dominate every social algorithm in seconds.
          </p>
          <div style={styles.btnGroup}>
            <button onClick={handleGetStarted} className="cta-button">Start Creating For Free</button>
            <p style={styles.noCredit}>No credit card required • Instant access</p>
          </div>
        </div>

        {/* Floating Visual Element */}
        <div className="floating" style={styles.visualElement}>
           <div className="glass-card" style={styles.previewBox}>
              <div style={styles.timelineRow}>
                <div style={{...styles.timelineBar, width: '40%', background: '#10b981'}}></div>
                <div style={{...styles.timelineBar, width: '25%', background: '#064e3b'}}></div>
                <div style={{...styles.timelineBar, width: '15%', background: '#065f46'}}></div>
              </div>
              <div style={styles.mockupTitle}>Generating Viral Hook... 88%</div>
           </div>
        </div>
      </header>

      {/* Social Proof */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}><h3>10M+</h3><p>Videos Created</p></div>
          <div style={styles.statItem}><h3>95%</h3><p>Faster Workflow</p></div>
          <div style={styles.statItem}><h3>4.9/5</h3><p>Creator Rating</p></div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={styles.features}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Built for Speed. <br/>Engineered for Reach.</h2>
          <p style={styles.sectionDesc}>Stop wasting hours on technical hurdles. Let our AI handle the grunt work while you focus on the vision.</p>
        </div>

        <div style={styles.grid}>
          <div className="glass-card" style={styles.card}>
            <div style={styles.icon}>⚡</div>
            <h3>Hyper-Realistic Voiceovers</h3>
            <p>100+ human-like voices in 40+ languages. Your audience won't believe it's AI.</p>
          </div>
          <div className="glass-card" style={styles.card}>
            <div style={styles.icon}>🎬</div>
            <h3>Smart Scene Selection</h3>
            <p>Our AI analyzes your script and automatically pulls the most engaging B-roll footage.</p>
          </div>
          <div className="glass-card" style={styles.card}>
            <div style={styles.icon}>🔥</div>
            <h3>Viral Hook Generator</h3>
            <p>Stuck? Let Sora AI write the first 3 seconds that stop the scroll every single time.</p>
          </div>
          <div className="glass-card" style={styles.card}>
            <div style={styles.icon}>📈</div>
            <h3>Algorithm Optimizer</h3>
            <p>Automatically formats your content for TikTok, Reels, and Shorts simultaneously.</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={styles.finalCta}>
        <div className="glass-card" style={styles.ctaBox}>
          <h2 style={{fontSize: '3rem', marginBottom: '1.5rem'}}>Ready to dominate?</h2>
          <p style={{fontSize: '1.2rem', color: '#9ca3af', marginBottom: '2.5rem'}}>
            Join 50,000+ creators who are already scaling their channels with StoryForge.
          </p>
          <button onClick={handleGetStarted} className="cta-button">Get Started Now</button>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 StoryForge AI. Crafted for the bold.</p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  mainWrapper: {
    paddingTop: '80px',
  },
  nav: {
    position: 'fixed',
    top: 0, width: '100%',
    zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '-1px',
  },
  navBtn: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid #10b981',
    padding: '10px 24px',
    borderRadius: '100px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '120px 20px',
    position: 'relative',
  },
  heroTextContainer: {
    maxWidth: '900px',
    zIndex: 2,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '8px 20px',
    borderRadius: '100px',
    fontSize: '0.8rem',
    fontWeight: 700,
    marginBottom: '2rem',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  dot: {
    marginRight: '8px',
    fontSize: '10px',
  },
  mainTitle: {
    fontSize: 'clamp(3rem, 8vw, 5.5rem)',
    fontWeight: 800,
    margin: '0 0 2rem 0',
    lineHeight: 0.9,
  },
  heroSub: {
    fontSize: '1.4rem',
    color: '#9ca3af',
    lineHeight: 1.6,
    marginBottom: '3.5rem',
    maxWidth: '750px',
    marginInline: 'auto',
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  noCredit: {
    fontSize: '0.85rem',
    color: '#4b5563',
  },
  visualElement: {
    marginTop: '60px',
    width: '100%',
    maxWidth: '600px',
  },
  previewBox: {
    padding: '30px',
    textAlign: 'left',
  },
  timelineRow: {
    display: 'flex',
    gap: '10px',
    height: '40px',
    marginBottom: '20px',
  },
  timelineBar: {
    borderRadius: '8px',
  },
  mockupTitle: {
    color: '#10b981',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  statsSection: {
    padding: '60px 20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  statsGrid: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    textAlign: 'center',
  },
  statItem: {
    h3: { fontSize: '2.5rem', margin: 0, color: '#10b981' },
    p: { color: '#6b7280', margin: '5px 0 0 0' }
  },
  features: {
    padding: '120px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '80px',
  },
  sectionTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    marginBottom: '1.5rem',
  },
  sectionDesc: {
    color: '#9ca3af',
    fontSize: '1.2rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
  },
  card: {
    padding: '50px 40px',
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  finalCta: {
    padding: '120px 20px',
    textAlign: 'center',
  },
  ctaBox: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '80px 40px',
  },
  footer: {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#374151',
    fontSize: '0.9rem',
  }
};