"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const registerWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });
        if (!res.ok) throw new Error();
        router.push("/dashboard");
      } catch (e) {
        setMsg({ text: "Google registration failed.", type: "error" });
        setLoading(false);
      }
    },
    prompt: 'select_account', // 🔥 EZT KERESTÜK
  });

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (error) setMsg({ text: "Error during sign up.", type: "error" });
    else setMsg({ text: "Check your email!", type: "success" });
    setLoading(false);
  };

  return (
    <main className="auth-container">
      {/* CSS ugyanaz mint feljebb */}
      <div className="glass-card">
        <h1>JOIN <span>FORGE</span></h1>
        <form onSubmit={handleEmailRegister}>
          <input name="email" type="email" placeholder="Email" required className="auth-input" />
          <input name="password" type="password" placeholder="Password" required className="auth-input" />
          <button className="submit-btn">REGISTER</button>
        </form>
        <button onClick={() => registerWithGoogle()} className="google-btn">
          Continue with Google
        </button>
        {msg.text && <div className={msg.type === "error" ? "error-msg" : "success-msg"}>{msg.text}</div>}
      </div>
    </main>
  );
}