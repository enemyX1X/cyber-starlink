"use client";
import { useState } from "react";

export default function ChatCard() {
  const [q, setQ] = useState('');
  const [r, setR] = useState('');

  const ask = async () => {
    if (!q.trim()) return;
    setR('Thinking... (demo)');
    setTimeout(() => setR('Demo reply: Cyber Starlink acknowledges your query.'), 1000);
  };

  return (
    <div className="card">
      <h3 style={{ color: 'var(--blood)' }} className="text-lg font-semibold">Chat</h3>
      <p className="text-sm opacity-70">Text + voice assistant</p>
      <div style={{ marginTop: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask something..."
          className="w-full p-2 rounded bg-black/30 border border-red-800"
        />
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button className="btn" onClick={ask}>Send</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#cbd5e1' }}>{r}</div>
      </div>
    </div>
  );
}
