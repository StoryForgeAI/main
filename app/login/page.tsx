"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg("Access denied. Please check your credentials.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
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
        setErrorMsg("Google login failed.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setErrorMsg("Google authentication failed.");
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Google authentication aborted.");
  };

  return (
    <main className="auth-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        :root { --emerald: #10b981; --cyan: #06b6d4; --deep-blue: #020617; }
        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--deep-blue); color: white; overflow: hidden; }
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; position: relative; }
        .aurora-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: var(--deep-blue); }
        .aurora-layer { position: absolute; width: 150%; height: 150%; top: -25%; left: -25%; background: radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, rgba(16, 185, 129, 0.08) 30%, transparent 60%); filter: blur(120px); animation: aurora-pulse 15s ease-in-out infinite alternate; }
        @keyframes aurora-pulse { from { transform: scale(1) translate(0, 0); opacity: 0.5; } to { transform: scale(1.2) translate(5%, 5%); opacity: 0.8; } }
        .glass-card { width: 100%; max-width: 420px; background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 40px; padding: 60px 45px; text-align: center; box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5); }
        .brand-title { font-size: 2.2rem; font-weight: 800; letter-spacing: -2px; margin-bottom: 10px; }
        .brand-title span { color: var(--emerald); }
        .subtitle { color: #9ca3af; margin-bottom: 40px; font-size: 1rem; font-weight: 500; }
        .input-group { display: flex; flex-direction: column; gap: 18px; margin-bottom: 30px; }
        .auth-input { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 18px 24px; color: white; font-size: 1rem; outline: none; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .submit-btn { background: linear-gradient(135deg, var(--emerald), var(--cyan)); color: #020617; font-weight: 800; padding: 20px; border-radius: 20px; border: none; cursor: pointer; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); }
        .divider { display: flex; align-items: center; margin: 35px 0; color: #4b5563; font-size: 0.8rem; font-weight: 700; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .divider:not(:empty)::before { margin-right: 20px; }
        .divider:not(:empty)::after { margin-left: 20px; }
        .footer-text { margin-top: 40px; font-size: 0.95rem; color: #6b7280; }
        .link { color: var(--cyan); text-decoration: none; font-weight: 700; margin-left: 6px; }
        .error-msg { color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; margin-top: 15px; }
      `}</style>

      <div className="aurora-bg"><div className="aurora-layer"></div></div>
      <div className="glass-card">
        <h1 className="brand-title">STORY<span>FORGE</span></h1>
        <p className="subtitle">Resume your creative dominion.</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input name="email" type="email" placeholder="Commander Email" required className="auth-input" />
            <input name="password" type="password" placeholder="Secret Key" required className="auth-input" />
          </div>
          <button disabled={loading} className="submit-btn" style={{width: '100%'}}>{loading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}</button>
          {errorMsg && <div className="error-msg">{errorMsg}</div>}
        </form>
        <div className="divider">SECURE ACCESS</div>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} use_one_tap={false} prompt="select_account" />
        <p className="footer-text">New to the forge? <a href="/register" className="link">Join the elite.</a></p>
      </div>
    </main>
  );
}