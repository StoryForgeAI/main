"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code", // Ez kell a biztonságos szerveroldali cseréhez
    ux_mode: "popup",
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeResponse.code }),
        });

        const result = await res.json();
        if (result.error) throw new Error(result.error);

        // Supabase session frissítése a kliens oldalon
        await supabase.auth.setSession({
          access_token: result.data.session.access_token,
          refresh_token: result.data.session.refresh_token,
        });

        router.push("/dashboard");
      } catch (e: any) {
        setErrorMsg(e.message || "Google registration failed.");
        setLoading(false);
      }
    },
    onError: () => setErrorMsg("Google login aborted."),
    // Ez kényszeríti a fiókválasztót minden alkalommal:
    overrideScope: true,
    scope: "openid email profile",
  });

  return (
    <main className="auth-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        :root { --emerald: #10b981; --cyan: #06b6d4; --deep-blue: #020617; }
        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--deep-blue); color: white; overflow: hidden; }
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; position: relative; }
        .aurora-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: var(--deep-blue); }
        .aurora-layer { position: absolute; width: 150%; height: 150%; top: -25%; left: -25%; background: radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, rgba(16, 185, 129, 0.08) 30%, transparent 60%); filter: blur(120px); }
        .glass-card { width: 100%; max-width: 420px; background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 40px; padding: 60px 45px; text-align: center; box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5); }
        .brand-title { font-size: 2.2rem; font-weight: 800; letter-spacing: -2px; margin-bottom: 30px; }
        .brand-title span { color: var(--emerald); }
        .input-group { display: flex; flex-direction: column; gap: 18px; margin-bottom: 30px; }
        .auth-input { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 18px 24px; color: white; font-size: 1rem; outline: none; }
        .submit-btn { background: linear-gradient(135deg, var(--emerald), var(--cyan)); color: #020617; font-weight: 800; padding: 20px; border-radius: 20px; border: none; cursor: pointer; font-size: 1.1rem; width: 100%; margin-bottom: 25px; }
        .divider { display: flex; align-items: center; margin: 30px 0; color: #4b5563; font-size: 0.8rem; font-weight: 700; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid rgba(255,255,255,0.06); margin: 0 15px; }
        .google-btn { width: 100%; padding: 16px; background: white; border: none; border-radius: 20px; color: #000; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; transition: transform 0.2s; }
        .google-btn:hover { transform: translateY(-2px); }
        .error-msg { color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 12px; font-size: 0.9rem; margin-top: 20px; }
      `}</style>

      <div className="aurora-bg"><div className="aurora-layer"></div></div>
      <div className="glass-card">
        <h1 className="brand-title">STORY<span>FORGE</span></h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <input name="email" type="email" placeholder="Commander Email" required className="auth-input" />
            <input name="password" type="password" placeholder="Secret Key" required className="auth-input" />
          </div>
          <button className="submit-btn" disabled={loading}>ENTER DASHBOARD</button>
        </form>

        <div className="divider">SECURE ACCESS</div>

        <button onClick={() => loginWithGoogle()} className="google-btn" disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="google" />
          {loading ? "AUTHENTICATING..." : "SIGN IN WITH GOOGLE"}
        </button>

        {errorMsg && <div className="error-msg">{errorMsg}</div>}
      </div>
    </main>
  );
}