"use client";
import { useState } from "react";

export default function VoiceCard() {
  const [txt, setTxt] = useState('Hello, Cyber Starlink at your command.');

  const speak = () => {
    if (!('speechSynthesis' in window)) return alert('TTS unsupported');
    const u = new SpeechSynthesisUtterance(txt);
    u.rate = 1;
    u.pitch = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="card">
      <h3 style={{ color: 'var(--blood)' }} className="text-lg font-semibold">Voice</h3>
      <p className="text-sm opacity-70">Text-to-speech engine</p>
      <textarea
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        rows={3}
        className="w-full p-2 rounded bg-black/30 border border-red-800 mt-3"
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button className="btn" onClick={speak}>Speak</button>
      </div>
    </div>
  );
}
