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

  // GOOGLE AUTH KÉNYSZERÍTETT VÁLASZTÁSSAL
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // Itt a kód lekéri a profilt vagy a tokent továbbküldi az API-nak
        // Mivel a te API-d 'credential'-t vár (ID Token), ezt így küldjük:
        const res = await fetch("/api/auth/google", {
          method: "POST",
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });

        const json = await res.json();
        if (json.error || !res.ok) throw new Error("Auth failed");
        
        router.push("/dashboard");
      } catch (e) {
        setErrorMsg("Google synchronization failed.");
        setLoading(false);
      }
    },
    onError: () => setErrorMsg("Google login aborted."),
    flow: 'implicit',
    prompt: 'select_account', // 🔥 EZ KÉNYSZERÍTI A FIÓKVÁLASZTÁST MINDIG
  });

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (error) {
      setErrorMsg("Invalid credentials.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="auth-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background-color: #020617; color: white; }
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .glass-card { width: 100%; max-width: 400px; background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 30px; padding: 40px; text-align: center; }
        .auth-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; color: white; margin-bottom: 15px; box-sizing: border-box; }
        .submit-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #10b981, #06b6d4); border: none; border-radius: 12px; color: #020617; font-weight: 800; cursor: pointer; margin-bottom: 20px; }
        .google-btn { width: 100%; padding: 12px; background: white; border: none; border-radius: 12px; color: #000; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .error-msg { color: #ef4444; font-size: 0.8rem; margin-top: 10px; }
      `}</style>

      <div className="glass-card">
        <h1>STORY<span>FORGE</span></h1>
        <form onSubmit={handleEmailLogin}>
          <input name="email" type="email" placeholder="Email" required className="auth-input" />
          <input name="password" type="password" placeholder="Password" required className="auth-input" />
          <button disabled={loading} className="submit-btn">{loading ? "Wait..." : "LOGIN"}</button>
        </form>

        <button onClick={() => loginWithGoogle()} className="google-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="google" />
          Continue with Google
        </button>

        {errorMsg && <div className="error-msg">{errorMsg}</div>}
      </div>
    </main>
  );
}