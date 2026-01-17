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
    <div className="main-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
        
        :root {
          --emerald: #10b981;
          --deep-forest: #064e3b;
          --black: #020617;
          --glass: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(16, 185, 129, 0.2);
        }

        body {
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: var(--black);
          color: white;
          overflow-x: hidden;
        }

        .bg-glow {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, #064e3b 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, #065f46 0%, transparent 40%);
          z-index: -1;
          opacity: 0.4;
          filter: blur(60px);
        }

        .nav-scrolled {
          background: rgba(2, 6, 23, 0.8) !important;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
        }

        .hero-gradient {
          background: linear-gradient(to bottom right, #fff 40%, var(--emerald) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-card {
          background: var(--glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 40px;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .glass-card:hover {
          background: rgba(16, 185, 129, 0.08);
          transform: translateY(-12px);
          border-color: var(--emerald);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .cta-button {
          background: var(--emerald);
          color: #020617;
          padding: 22px 50px;
          border-radius: 100px;
          font-weight: 800;
          font-size: 1.1rem;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        }

        .cta-button:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 20px 50px rgba(16, 185, 129, 0.6);
          filter: brightness(1.1);
        }

        .stat-card h3 {
          font-size: 3.5rem;
          margin: 0;
          background: linear-gradient(to bottom, var(--emerald), #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }

        .floating {
          animation: float 8s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(1deg); }
        }

        .reveal {
          animation: reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="bg-glow" />

      {/* Navigation */}
      <nav style={styles.nav} className={scrolled ? 'nav-scrolled' : ''}>
        <div style={styles.navContent}>
          <div style={styles.logo}>STORY<span style={{color: '#10b981'}}>FORGE</span></div>
          <button onClick={handleGetStarted} style={styles.navBtn}>Launch App</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={styles.hero} className="reveal">
        <div style={styles.statusBadge}>
          <span style={{color: '#10b981', marginRight: '8px'}}>●</span> 
          NEXT-GEN SORA ENGINE ACTIVE
        </div>
        <h1 className="hero-gradient" style={styles.mainTitle}>
          Content Creation <br /> 
          At The Speed Of <span style={{color: '#10b981'}}>Thought</span>
        </h1>
        <p style={styles.heroSub}>
          Stop fighting the algorithm. StoryForge uses advanced neuro-predictive AI to craft 
          visuals and scripts that are mathematically optimized to go viral. 
        </p>
        <div style={styles.heroBtns}>
          <button onClick={handleGetStarted} className="cta-button">Claim Your Free Access</button>
          <p style={{color: '#4b5563', marginTop: '15px', fontSize: '0.9rem'}}>Used by 50,000+ top-tier creators</p>
        </div>

        <div className="floating" style={styles.visualContainer}>
          <div className="glass-card" style={styles.mockupCard}>
            <div style={{display: 'flex', gap: '8px', marginBottom: '20px'}}>
              <div style={{width: 12, height: 12, borderRadius: '50%', background: '#ef4444'}} />
              <div style={{width: 12, height: 12, borderRadius: '50%', background: '#f59e0b'}} />
              <div style={{width: 12, height: 12, borderRadius: '50%', background: '#10b981'}} />
            </div>
            <div style={{height: '200px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{color: '#10b981', fontWeight: 800, letterSpacing: '2px'}}>AI RENDERING... 92%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section style={styles.section}>
        <div style={styles.statsGrid}>
          <div className="stat-card"><h3>24/7</h3><p style={styles.statLabel}>Viral Monitoring</p></div>
          <div className="stat-card"><h3><small>$</small>0</h3><p style={styles.statLabel}>Initial Investment</p></div>
          <div className="stat-card"><h3>140+</h3><p style={styles.statLabel}>Supported Countries</p></div>
        </div>
      </section>

      {/* Marketing Content */}
      <section style={styles.section}>
        <div style={styles.grid}>
          <div className="glass-card" style={styles.featureCard}>
            <div style={styles.iconBox}>⚡</div>
            <h3 style={styles.cardTitle}>One-Click Distribution</h3>
            <p style={styles.cardText}>Upload once, dominate everywhere. Our AI automatically tweaks pacing and hooks for TikTok, YouTube Shorts, and Reels simultaneously.</p>
          </div>
          <div className="glass-card" style={styles.featureCard}>
            <div style={styles.iconBox}>🧠</div>
            <h3 style={styles.cardTitle}>Psychological Scripting</h3>
            <p style={styles.cardText}>Our scripts aren't just text. They are built using retention-science to keep viewers watching until the very last second.</p>
          </div>
          <div className="glass-card" style={styles.featureCard}>
            <div style={styles.iconBox}>🌌</div>
            <h3 style={styles.cardTitle}>Cinematic Sora AI</h3>
            <p style={styles.cardText}>Access the world's most powerful video generation engine. Photorealistic scenes from simple text prompts in seconds.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalSection}>
        <div className="glass-card" style={styles.finalBox}>
          <h2 style={{fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px'}}>The future of creators is here.</h2>
          <p style={{fontSize: '1.2rem', color: '#9ca3af', marginBottom: '40px', maxWidth: '600px', marginInline: 'auto'}}>
            Don't get left behind in the manual era. Scale your influence with the power of artificial intelligence.
          </p>
          <button onClick={handleGetStarted} className="cta-button">Join the Revolution</button>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 STORYFORGE AI — UNLIMITED CREATIVITY</p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    top: 0, width: '100%',
    zIndex: 1000,
    transition: 'all 0.4s ease',
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
    fontSize: '1.8rem',
    fontWeight: 900,
    letterSpacing: '-1.5px',
  },
  navBtn: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    border: '1px solid #10b981',
    padding: '12px 28px',
    borderRadius: '100px',
    cursor: 'pointer',
    fontWeight: 700,
  },
  hero: {
    padding: '160px 20px 100px',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  statusBadge: {
    background: 'rgba(16, 185, 129, 0.05)',
    padding: '10px 24px',
    borderRadius: '100px',
    fontSize: '0.85rem',
    fontWeight: 700,
    border: '1px solid var(--glass-border)',
    display: 'inline-block',
    marginBottom: '40px',
  },
  mainTitle: {
    fontSize: 'clamp(3.5rem, 10vw, 6.5rem)',
    fontWeight: 800,
    lineHeight: 0.85,
    marginBottom: '30px',
    letterSpacing: '-3px',
  },
  heroSub: {
    fontSize: '1.4rem',
    color: '#9ca3af',
    maxWidth: '800px',
    margin: '0 auto 50px',
    lineHeight: 1.6,
  },
  heroBtns: {
    marginBottom: '80px',
  },
  visualContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  mockupCard: {
    padding: '40px',
    textAlign: 'left',
  },
  section: {
    padding: '100px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginTop: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    padding: '60px 40px',
  },
  iconBox: {
    fontSize: '3rem',
    marginBottom: '30px',
  },
  cardTitle: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    fontWeight: 700,
  },
  cardText: {
    color: '#9ca3af',
    lineHeight: 1.7,
    fontSize: '1.1rem',
  },
  finalSection: {
    padding: '100px 20px 150px',
    textAlign: 'center',
  },
  finalBox: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '100px 40px',
    backgroundImage: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent)',
  },
  footer: {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#334155',
    letterSpacing: '2px',
    fontSize: '0.8rem',
    borderTop: '1px solid rgba(255,255,255,0.02)',
  }
};