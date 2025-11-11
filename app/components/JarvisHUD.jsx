// src/components/JarvisHUD.jsx
"use client";
import { useEffect, useState } from "react";

export default function JarvisHUD() {
  const [listening, setListening] = useState(false);
  const [txt, setTxt] = useState("");
  const [last, setLast] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;
  }, []);

  const speak = (text) => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return alert("TTS unsupported");
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 0.85;
    // heuristics: pick deep male voice if available
    const voices = synth.getVoices();
    const prefer = voices.find((v) => /male|deep|Daniel|Matthew|Alex|en-US/i.test(v.name + " " + (v.lang || "")));
    if (prefer) u.voice = prefer;
    synth.speak(u);
    setLast(text);
  };

  // Speech recognition (if available)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = "en-US";
    r.onresult = async (e) => {
      const t = e.results[0][0].transcript;
      setTxt(t);
      // save chat to memory endpoint
      await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "chat", chat: { text: t, from: "user" } })
      });
      speak("Received. Searching memory for context.");
    };
    window.__cs_recog = r;
  }, []);

  const startListen = () => {
    const r = window.__cs_recog;
    if (!r) return alert("SpeechRecognition not supported");
    setListening(true);
    r.start();
    r.onend = () => setListening(false);
  };

  const sendText = async () => {
    if (!txt.trim()) return;
    await fetch("/api/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "chat", chat: { text: txt, from: "user" } })
    });
    speak("Saved to memory");
    setTxt("");
  };

  return (
    <div className="fixed right-6 bottom-6 z-40">
      <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/5 w-80">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-semibold text-red-400">Jarvis</div>
          <div className="text-xs text-gray-300">{listening ? "Listening..." : "Idle"}</div>
        </div>

        <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={3}
          className="w-full p-2 rounded bg-black/30 text-sm text-gray-100" placeholder="Say something or type..." />

        <div className="flex gap-2 mt-2">
          <button onClick={() => speak("Cyber Starlink ready. Awaiting commands.")}
            className="px-3 py-1 rounded bg-red-400 text-black font-semibold">Speak</button>
          <button onClick={startListen} className="px-3 py-1 rounded bg-gray-800 text-gray-100">{listening ? "..." : "Listen"}</button>
          <button onClick={sendText} className="px-3 py-1 rounded bg-gray-700 text-gray-100">Save</button>
        </div>

        <div className="text-xs text-gray-400 mt-2">Last: {last}</div>
      </div>
    </div>
  );
}
