"use client";\nimport { useState } from "react";\n\nexport default function VoiceCard(){\n  const [txt, setTxt] = useState('Hello, cyber starlink at your command.');\n  const speak = ()=>{\n    if(!('speechSynthesis' in window)) return alert('TTS unsupported');\n    const u = new SpeechSynthesisUtterance(txt);
    u.rate = 1;
    u.pitch = 0.85;
    window.speechSynthesis.speak(u);
  };
  return (
    <div className="card">
      <h3 style={{color:'var(--blood)'}} className="text-lg font-semibold">Voice Mode</h3>
      <p className="text-sm opacity-70">Jarvis-style TTS + speech input</p>
      <textarea value={txt} onChange={(e)=>setTxt(e.target.value)} className="w-full p-2 rounded bg-black/30 border border-red-800 mt-3" rows={3}></textarea>
      <div style={{marginTop:8, display:'flex', gap:8}}>
        <button className="btn" onClick={speak}>Speak</button>
      </div>
    </div>
  );
}
