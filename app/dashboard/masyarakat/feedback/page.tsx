"use client";

import { useState } from "react";
import { createClient } from "../../../../lib/supabase/client"; // Sesuaikan path-nya
import { useRouter } from "next/navigation";

export default function HalamanFeedback() {
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Menggunakan instance supabase yang sudah terkonfigurasi dengan auth persistence
  const supabase = createClient();

  const kirimFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mengambil user dari instance supabase yang benar
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Anda belum login atau sesi telah berakhir.");
      }

      const { error } = await supabase.from("feedback").insert([
        { 
          pesan: pesan, 
          user_id: user.id 
        }
      ]);

      if (error) throw error;

      alert("Terima kasih atas saran Anda!");
      router.back();
    } catch (err: any) {
      console.error("Error Detail:", err);
      alert("Gagal kirim feedback: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
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
        maxWidth: '500px',
        backgroundColor: 'rgba(19, 25, 38, 0.75)',
        backdropFilter: 'blur(24px)',
        padding: '40px 32px',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900 }}>
            Beri <span style={{ color: '#818cf8' }}>Feedback</span>
          </h1>
        </div>

        <form onSubmit={kirimFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <textarea 
            rows={5} 
            placeholder="Tulis saran atau keluhan Anda di sini..." 
            value={pesan} 
            onChange={(e) => setPesan(e.target.value)} 
            required 
            style={{
              width: '100%',
              backgroundColor: 'rgba(24, 32, 50, 0.8)',
              border: '1px solid rgba(51, 65, 85, 0.6)',
              borderRadius: '14px',
              padding: '16px',
              color: '#ffffff',
              outline: 'none'
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
            {loading ? "Mengirim..." : "Kirim Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}