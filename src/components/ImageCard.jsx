"use client";
import { useState } from "react";

export default function ImageCard() {
  const [p, setP] = useState('');
  const [u, setU] = useState(null);

  const gen = () => {
    if (!p.trim()) return;
    setU('https://image.pollinations.ai/prompt/' + encodeURIComponent(p));
  };

  return (
    <div className="card">
      <h3 style={{ color: 'var(--blood)' }} className="text-lg font-semibold">Image Lab</h3>
      <p className="text-sm opacity-70">Generate neon visuals (Pollinations)</p>
      <input
        value={p}
        onChange={(e) => setP(e.target.value)}
        placeholder="Neon city, cyberpunk"
        className="w-full p-2 rounded bg-black/30 border border-red-800 mt-3"
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button className="btn" onClick={gen}>Generate</button>
      </div>
      {u && (
        <div style={{ marginTop: 8 }}>
          <img src={u} alt="gen" style={{ width: '100%', borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}
