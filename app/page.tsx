"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    window.location.href = "https://sforge.vercel.app/dashboard";
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: #000;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          background: linear-gradient(to bottom right, #10b981, #064e3b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .fade-in {
          animation: fadeIn 1.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-glow:hover {
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
          transform: scale(1.05);
        }
      `}</style>

      {/* Hero Section */}
      <section style={styles.heroSection} className="fade-in">
        <div style={styles.badge}>NEW: Sora AI video generátor elérhető</div>
        <h1 className="hero-title">A Leggyorsabb Út a<br />Virális Videókhoz</h1>
        <p style={styles.heroSubtitle}>
          Az AI eszköztár videógeneráláshoz, forgatókönyvíráshoz, szinkronizáláshoz és feliratozáshoz. 
          Minden, amire szükséged van a tartalomgyártáshoz, egyetlen platformon.
        </p>
        <button 
          onClick={handleGetStarted} 
          style={styles.mainButton} 
          className="btn-glow"
        >
          GET STARTED
        </button>
        <div style={styles.trustedBy}>
          <span style={{color: '#4b5563'}}>Több millió megtekintéssel rendelkező alkotók bizalmával.</span>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Funkciók a Legjobb Videókhoz</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>AI Scripting</h3>
            <p style={styles.featureText}>Generálj azonnal kiváló minőségű forgatókönyveket. Csak írd le az ötleted vagy illessz be egy YouTube linket.</p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>AI Voiceovers</h3>
            <p style={styles.featureText}>Készíts professzionális szinkronhangokat a videóidhoz anélkül, hogy szinkronszínészt kellene felfogadnod.</p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>Caption Presets</h3>
            <p style={styles.featureText}>Válassz a virális csatornák által használt felirat-előbeállítások könyvtárából.</p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>Intelligens Editor</h3>
            <p style={styles.featureText}>Vágj, igazíts és adj hozzá effekteket – mindezt egy zökkenőmentes munkaterületen.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={styles.contentSection}>
        <div style={styles.contentWrapper}>
          <div style={styles.textContent}>
            <h2 style={styles.subTitle}>Miért a Story Forge AI?</h2>
            <p style={styles.longText}>
              A modern tartalomgyártás világában az idő a legértékesebb kincsed. A Story Forge AI-t úgy terveztük, 
              hogy a kreatív folyamat nehéz részét levegye a válladról. Legyen szó TikTok-ról, YouTube Shorts-ról 
              vagy Instagram Reels-ről, algoritmusaink segítenek a figyelemfelkeltő "hook-ok" megalkotásában.
            </p>
            <p style={styles.longText}>
              Ne pazarolj órákat az unalmas vágási feladatokra. AI-nk automatikusan szinkronizálja a feliratokat 
              a hanggal, kiválasztja a legjobb háttérzenét és optimalizálja a videó ritmusát a maximális elköteleződés érdekében.
            </p>
          </div>
          <div style={styles.imagePlaceholder}>
            {/* Ide jöhet egy kép a felületről */}
            <div style={styles.mockup}>
              <div style={styles.mockupBar}></div>
              <div style={styles.mockupContent}>AI GENERATED PREVIEW</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2024 Story Forge AI. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '100px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  badge: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#9ca3af',
    maxWidth: '700px',
    marginBottom: '3rem',
    lineHeight: '1.6',
  },
  mainButton: {
    backgroundColor: '#10b981',
    color: '#000',
    padding: '18px 40px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '900',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  trustedBy: {
    marginTop: '3rem',
    fontSize: '0.9rem',
  },
  featuresSection: {
    padding: '80px 20px',
    backgroundColor: '#050505',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    marginBottom: '3rem',
    color: '#fff',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    background: '#0a0a0a',
    padding: '40px',
    borderRadius: '24px',
    border: '1px solid #1a1a1a',
    textAlign: 'left',
  },
  featureTitle: {
    color: '#10b981',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  featureText: {
    color: '#9ca3af',
    lineHeight: '1.5',
  },
  contentSection: {
    padding: '100px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  contentWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '60px',
    alignItems: 'center',
  },
  textContent: {
    flex: '1 1 400px',
  },
  subTitle: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
  },
  longText: {
    color: '#9ca3af',
    fontSize: '1.1rem',
    lineHeight: '1.8',
    marginBottom: '1.5rem',
  },
  imagePlaceholder: {
    flex: '1 1 400px',
    display: 'flex',
    justifyContent: 'center',
  },
  mockup: {
    width: '100%',
    maxWidth: '500px',
    height: '350px',
    background: '#0a0a0a',
    borderRadius: '12px',
    border: '1px solid #1a1a1a',
    position: 'relative',
    overflow: 'hidden',
  },
  mockupBar: {
    height: '30px',
    background: '#1a1a1a',
    width: '100%',
  },
  mockupContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100% - 30px)',
    color: '#10b981',
    fontWeight: 'bold',
    opacity: 0.5,
  },
  footer: {
    padding: '40px 20px',
    textAlign: 'center',
    borderTop: '1px solid #1a1a1a',
    color: '#4b5563',
    fontSize: '0.9rem',
  }
};