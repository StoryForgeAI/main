"use client";
import React, { useEffect, useState } from 'react';

export default function StoryForgeLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    window.location.href = "https://aistoryforge.vercel.app/dashboard";
  };

  return (
    <div className="main-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
        
        :root {
          --emerald: #10b981;
          --cyan: #06b6d4;
          --deep-blue: #020617;
        }

        body {
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: var(--deep-blue);
          color: white;
          overflow-x: hidden;
        }

        /* --- AURORA ANIMATION --- */
        .aurora-bg {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: -1;
          background: var(--deep-blue);
          overflow: hidden;
        }

        .aurora-layer {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: radial-gradient(circle at 50% 50%, 
            rgba(16, 185, 129, 0.15) 0%, 
            rgba(6, 182, 212, 0.1) 25%, 
            transparent 50%);
          filter: blur(80px);
          animation: aurora-move 20s linear infinite;
          opacity: 0.6;
        }

        @keyframes aurora-move {
          0% { transform: rotate(0deg) translate(5%, 5%); }
          50% { transform: rotate(180deg) translate(-5%, -5%); }
          100% { transform: rotate(360deg) translate(5%, 5%); }
        }

        /* --- UI COMPONENTS --- */
        .nav-glass {
          position: fixed;
          top: 0; width: 100%; z-index: 1000;
          transition: all 0.4s ease;
          padding: 20px 0;
        }

        .nav-scrolled {
          background: rgba(2, 6, 23, 0.85);
          backdrop-filter: blur(20px);
          padding: 15px 0;
          border-bottom: 1px solid rgba(16, 185, 129, 0.2);
        }

        .hero-title {
          font-size: clamp(3.5rem, 10vw, 7rem);
          font-weight: 800;
          line-height: 0.85;
          letter-spacing: -4px;
          background: linear-gradient(to right, #fff, var(--emerald), var(--cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 48px;
          transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .glass-panel:hover {
          background: rgba(16, 185, 129, 0.05);
          border-color: var(--emerald);
          transform: translateY(-10px) scale(1.01);
        }

        .cta-glow {
          background: linear-gradient(135deg, var(--emerald), var(--cyan));
          color: #000;
          padding: 24px 56px;
          border-radius: 100px;
          font-weight: 800;
          font-size: 1.2rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.3);
          text-transform: uppercase;
        }

        .cta-glow:hover {
          transform: scale(1.05);
          box-shadow: 0 0 60px rgba(6, 182, 212, 0.5);
          letter-spacing: 1px;
        }

        .image-container {
          width: 100%;
          height: 400px;
          border-radius: 32px;
          overflow: hidden;
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          margin-top: 40px;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
          transition: opacity 0.3s;
        }

        .image-container img:hover {
          opacity: 1;
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, var(--emerald), var(--cyan));
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 25px;
        }
      `}</style>

      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-layer"></div>
        <div className="aurora-layer" style={{ animationDelay: '-5s', opacity: 0.4 }}></div>
      </div>

      {/* Navigation */}
      <nav className={`nav-glass ${scrolled ? 'nav-scrolled' : ''}`}>
        <div style={styles.navContent}>
          <div style={styles.logo}>STORY<span style={{color: '#10b981'}}>FORGE</span></div>
          <button onClick={handleGetStarted} style={styles.navBtn}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.badge}>REVOLUTIONIZING CONTENT WITH SORA AI</div>
        <h1 className="hero-title">Escape The <br/> Average.</h1>
        <p style={styles.heroSub}>
          The elite AI platform for creators who demand viral success. We don't just generate video; 
          we engineer digital dopamine for your audience.
        </p>
        <button onClick={handleGetStarted} className="cta-glow">Launch Your Empire</button>

        {/* --- IMAGE SLOT 1 --- */}
        <div className="image-container" style={{maxWidth: '1000px', marginInline: 'auto', marginTop: '80px'}}>
           <img src="/image1.png" alt="Platform Dashboard Preview" />
        </div>
      </section>

      {/* Feature Grid */}
      <section style={styles.section}>
        <div style={styles.grid}>
          <div className="glass-panel" style={styles.card}>
            <div className="feature-icon">🚀</div>
            <h3 style={styles.cardTitle}>Instant Virality</h3>
            <p style={styles.cardText}>Our AI analyzes current trends in real-time to ensure your content hits the FYP every single time.</p>
            {/* --- IMAGE SLOT 2 --- */}
            <div className="image-container" style={{height: '200px', marginTop: '20px'}}>
               <img src="/image2.png" alt="Analytics View" />
            </div>
          </div>

          <div className="glass-panel" style={styles.card}>
            <div className="feature-icon">💎</div>
            <h3 style={styles.cardTitle}>Cinematic Quality</h3>
            <p style={styles.cardText}>Hollywood-grade visuals and audio mastered by artificial intelligence. Stand out from the noise.</p>
            {/* --- IMAGE SLOT 3 --- */}
            <div className="image-container" style={{height: '200px', marginTop: '20px'}}>
               <img src="/image3.png" alt="AI Generation Preview" />
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Text Section */}
      <section style={styles.textSection}>
        <div className="glass-panel" style={styles.textWall}>
          <h2 style={{fontSize: '3rem', marginBottom: '30px'}}>Master the Attention Economy</h2>
          <p style={styles.marketingPara}>
            Traditional editing is dead. If you are still spending hours cutting clips, you've already lost. 
            StoryForge AI leverages neuro-linguistic programming to write scripts that hook. We use 
            computational aesthetics to select colors that stop the scroll.
          </p>
          <p style={styles.marketingPara}>
            Our Sora-powered engine doesn't just put pictures together—it understands emotion. 
            Whether you're building a personal brand or a faceless automation channel, 
            we provide the unfair advantage you've been looking for.
          </p>
          <div style={{marginTop: '40px'}}>
            <button onClick={handleGetStarted} className="cta-glow">Dominate Now</button>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 STORYFORGE AI • BEYOND HUMAN IMAGINATION</p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 900,
    letterSpacing: '-2px',
    color: '#fff'
  },
  navBtn: {
    background: 'transparent',
    color: '#10b981',
    border: '2px solid #10b981',
    padding: '10px 30px',
    borderRadius: '100px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  hero: {
    padding: '180px 20px 100px',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  badge: {
    fontSize: '0.8rem',
    fontWeight: 800,
    letterSpacing: '2px',
    color: '#10b981',
    marginBottom: '30px',
  },
  heroSub: {
    fontSize: '1.4rem',
    color: '#9ca3af',
    maxWidth: '700px',
    margin: '40px auto 60px',
    lineHeight: 1.6,
  },
  section: {
    padding: '100px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '40px',
  },
  card: {
    padding: '60px 40px',
  },
  cardTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
    fontWeight: 800,
  },
  cardText: {
    color: '#9ca3af',
    lineHeight: 1.8,
    fontSize: '1.1rem',
  },
  textSection: {
    padding: '100px 20px 200px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  textWall: {
    padding: '100px 60px',
    textAlign: 'center',
  },
  marketingPara: {
    fontSize: '1.3rem',
    color: '#9ca3af',
    lineHeight: 2,
    maxWidth: '900px',
    margin: '0 auto 30px',
  },
  footer: {
    padding: '80px 20px',
    textAlign: 'center',
    color: '#334155',
    fontSize: '0.8rem',
    letterSpacing: '4px',
    borderTop: '1px solid rgba(255,255,255,0.03)',
  }
};