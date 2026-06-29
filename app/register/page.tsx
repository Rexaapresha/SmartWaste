"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Pendaftaran User ke Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Gagal membuat akun.");

      // 2. Insert atau Update (upsert) ke tabel profiles
      // Menggunakan upsert agar tidak terjadi error jika ID sudah ada
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert([
          {
            id: data.user.id,
            role: "masyarakat",
          },
        ]);

      if (profileError) throw profileError;

      alert("Registrasi sukses! Silakan lanjutkan.");
      router.push("/login");
    } catch (err: any) {
      console.error("Detail Error Registrasi:", err);
      alert("Gagal Registrasi: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#0b0f19',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(19, 25, 38, 0.75)',
        backdropFilter: 'blur(24px)',
        padding: '40px 32px',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900 }}>
            SMART<span style={{ color: '#818cf8' }}>WASTE</span>
          </h1>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', padding: '14px', borderRadius: '14px', 
              border: emailFocused ? '1px solid #6366f1' : '1px solid rgba(51, 65, 85, 0.6)', 
              backgroundColor: 'rgba(24, 32, 50, 0.8)', color: '#fff', outline: 'none' 
            }}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', padding: '14px', borderRadius: '14px', 
              border: passwordFocused ? '1px solid #6366f1' : '1px solid rgba(51, 65, 85, 0.6)', 
              backgroundColor: 'rgba(24, 32, 50, 0.8)', color: '#fff', outline: 'none' 
            }}
          />

          <button
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#334155' : '#4f46e5',
              color: '#ffffff',
              padding: '15px',
              borderRadius: '14px',
              border: 'none',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Memproses..." : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
          Sudah terdaftar? <Link href="/login" style={{ color: '#818cf8', fontWeight: 700 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}