"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code", // A legstabilabb mód
    onSuccess: async (codeResponse) => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          body: JSON.stringify({ code: codeResponse.code }),
        });

        const result = await res.json();
        if (result.error) throw new Error(result.error);

        // Session rögzítése a böngészőben
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        });

        if (sessionError) throw sessionError;
        router.push("/dashboard");
      } catch (e: any) {
        setErrorMsg(e.message || "Authentication failed.");
        setLoading(false);
      }
    },
    onError: () => setErrorMsg("Google login was cancelled."),
  });

  return (
    <main className="auth-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        :root { --emerald: #10b981; --cyan: #06b6d4; --deep-blue: #020617; }
        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--deep-blue); color: white; overflow: hidden; }
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; width: 100vw; }
        .aurora-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .aurora-layer { position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 30%, transparent 70%); animation: rotate 30s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .glass-card { width: 100%; max-width: 420px; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 40px; padding: 50px; text-align: center; box-shadow: 0 50px 100px rgba(0,0,0,0.5); }
        .brand-title { font-size: 2.2rem; font-weight: 800; letter-spacing: -2px; margin-bottom: 10px; }
        .brand-title span { color: var(--emerald); }
        .subtitle { color: #64748b; font-size: 0.9rem; margin-bottom: 35px; }
        .submit-btn { background: linear-gradient(135deg, var(--emerald), var(--cyan)); color: #020617; font-weight: 800; padding: 18px; border-radius: 18px; border: none; cursor: pointer; width: 100%; font-size: 1rem; margin-bottom: 20px; }
        .google-btn { width: 100%; padding: 16px; background: white; border: none; border-radius: 18px; color: black; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.2s; }
        .google-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }
        .divider { display: flex; align-items: center; margin: 30px 0; color: #334155; font-size: 0.75rem; font-weight: 800; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid rgba(255,255,255,0.05); margin: 0 15px; }
        .error-msg { color: #f87171; background: rgba(248, 113, 113, 0.1); padding: 12px; border-radius: 12px; font-size: 0.85rem; margin-top: 20px; }
      `}</style>

      <div className="aurora-bg"><div className="aurora-layer"></div></div>
      <div className="glass-card">
        <h1 className="brand-title">STORY<span>FORGE</span></h1>
        <p className="subtitle">Enter the next generation of AI content.</p>
        
        <button onClick={() => loginWithGoogle()} className="google-btn" disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="G" />
          {loading ? "PROCESSING..." : "CONTINUE WITH GOOGLE"}
        </button>

        <div className="divider">OR USE COMMANDER KEY</div>

        <div style={{opacity: 0.5, pointerEvents: 'none'}}>
          <input type="email" placeholder="Email" className="auth-input" style={{width: '100%', padding: '15px', borderRadius: '12px', background: '#0f172a', border: '1px solid #1e293b', marginBottom: '10px', color: 'white'}} />
          <button className="submit-btn" style={{filter: 'grayscale(1)'}}>LOGIN</button>
        </div>

        {errorMsg && <div className="error-msg">{errorMsg}</div>}
      </div>
    </main>
  );
}