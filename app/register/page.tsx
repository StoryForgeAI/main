"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/login` }
    });

    if (error) {
      setMsg({ text: "Account creation failed. User may already exist.", type: "error" });
    } else {
      setMsg({ text: "Mission Success! Check your inbox to activate your empire.", type: "success" });
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const json = await res.json();
      if (json.error || !res.ok) {
        setMsg({ text: "Google onboarding failed.", type: "error" });
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setMsg({ text: "Google onboarding crashed.", type: "error" });
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMsg({ text: "Google authentication aborted.", type: "error" });
  };

  return (
    <main className="auth-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        :root { --emerald: #10b981; --cyan: #06b6d4; --deep-blue: #020617; }
        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--deep-blue); color: white; overflow: hidden; }
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; width: 100vw; position: relative; padding: 20px; box-sizing: border-box; }
        .aurora-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: var(--deep-blue); }
        .aurora-layer { position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 25%, transparent 50%); filter: blur(100px); animation: aurora-rotate 25s linear infinite; }
        @keyframes aurora-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .glass-card { width: 100%; max-width: 420px; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 40px; padding: 50px 40px; text-align: center; box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5); animation: slideUp 0.8s cubic-bezier(0.2, 1, 0.3, 1); box-sizing: border-box; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .brand-title { font-size: 2rem; font-weight: 800; letter-spacing: -1.5px; margin: 0 0 8px 0; }
        .brand-title span { color: var(--emerald); }
        .subtitle { color: #9ca3af; margin-bottom: 35px; font-size: 0.95rem; font-weight: 500; }
        .input-group { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
        .auth-input { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; padding: 16px 20px; color: white; font-size: 1rem; outline: none; transition: all 0.3s ease; width: 100%; box-sizing: border-box; }
        .auth-input:focus { border-color: var(--emerald); background: rgba(16, 185, 129, 0.05); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
        .submit-btn { background: linear-gradient(135deg, var(--emerald), var(--cyan)); color: #020617; font-weight: 800; padding: 18px; border-radius: 18px; border: none; cursor: pointer; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); width: 100%; }
        .divider { display: flex; align-items: center; text-align: center; margin: 30px 0; color: #4b5563; font-size: 0.85rem; font-weight: 600; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .divider:not(:empty)::before { margin-right: 15px; }
        .divider:not(:empty)::after { margin-left: 15px; }
        .status-msg { padding: 12px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; margin-bottom: 20px; }
        .footer-text { margin-top: 35px; font-size: 0.9rem; color: #9ca3af; }
        .link { color: var(--emerald); text-decoration: none; font-weight: 700; margin-left: 5px; }
      `}</style>

      <div className="aurora-bg">
        <div className="aurora-layer"></div>
      </div>

      <div className="glass-card">
        <h1 className="brand-title">STORY<span>FORGE</span></h1>
        <p className="subtitle">Start your 100x content journey today.</p>
        
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input name="email" type="email" placeholder="Professional Email" required className="auth-input" />
            <input name="password" type="password" placeholder="Secure Password" required className="auth-input" />
          </div>
          
          {msg.text && (
            <div className="status-msg" style={{ 
              backgroundColor: msg.type === "success" ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: msg.type === "success" ? '#10b981' : '#ef4444'
            }}>
              {msg.text}
            </div>
          )}

          <button disabled={loading} className="submit-btn">
            {loading ? "INITIALIZING..." : "CLAIM ACCESS"}
          </button>
        </form>

        <div className="divider">OR SCALE WITH</div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          prompt="select_account"
        />
        
        <p className="footer-text">
          Already part of the elite? <a href="/login" className="link">Log in!</a>
        </p>
      </div>
    </main>
  );
}