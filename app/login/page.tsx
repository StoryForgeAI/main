"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
      setErrorMsg("Invalid login credentials!");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>StoryForge AI</h1>
        <p style={styles.subtitle}>Welcome back</p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <input name="email" type="email" placeholder="Email" required style={styles.input} />
          <input name="password" type="password" placeholder="Password" required style={styles.input} />
          
          <button disabled={loading} style={styles.btn}>
            {loading ? "..." : "LOGIN"}
          </button>

          {errorMsg && (
            <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }}>
              {errorMsg}
            </p>
          )}
        </form>

        <div style={styles.divider}>or</div>

        {/* Google Gomb */}
        <button onClick={handleGoogleAuth} style={styles.googleBtn}>
          <img src="https://www.google.com/favicon.ico" width="18" alt="G" /> Sign in with Google
        </button>

        <p style={styles.footerText}>
          Don't have an account? <a href="/register" style={styles.link}>Sign up!</a>
        </p>
      </div>
    </main>
  );
}

const styles: any = {
  container: { display: 'flex', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#10b981', paddingTop: '60px', fontFamily: 'sans-serif' },
  card: { width: '100%', maxWidth: '380px', backgroundColor: 'white', borderRadius: '30px', padding: '40px', textAlign: 'center', height: 'fit-content', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
  title: { color: '#065f46', fontWeight: '900', fontSize: '24px', margin: '0 0 5px 0' },
  subtitle: { color: '#6b7280', marginBottom: '25px', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '15px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none', fontSize: '16px' },
  btn: { backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', padding: '15px', borderRadius: '15px', border: 'none', cursor: 'pointer', fontSize: '16px' },
  divider: { margin: '20px 0', color: '#9ca3af', fontSize: '14px', fontWeight: '500' },
  googleBtn: { width: '100%', padding: '14px', borderRadius: '15px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: '600', color: '#374151' },
  footerText: { marginTop: '25px', fontSize: '14px', color: '#6b7280' },
  link: { color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }
};