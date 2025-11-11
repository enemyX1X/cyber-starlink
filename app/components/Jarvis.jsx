"use client";
import { useEffect, useState } from "react";

export default function Jarvis() {
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [lastSpoken, setLastSpoken] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    function loadVoices() {
      const v = synth.getVoices();
      setVoices(v);
      const prefer = v.find(x => /male|deep|Daniel|Matthew|Alex|en-US/i.test(x.name + ' ' + (x.gender || '')));
      const fallback = v.find(x => /en-US/.test(x.lang)) || v[0];
      setSelectedVoice(prefer || fallback);
    }
    loadVoices();
    if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return alert('TTS not supported in this browser.');
    const u = new SpeechSynthesisUtterance(text);
    if (selectedVoice) u.voice = selectedVoice;
    u.rate = 1.0;
    u.pitch = 0.85;
    synth.speak(u);
    setLastSpoken(text);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'en-US';
    r.onresult = (e) => {
      const t = e.results[0][0].transcript;
      speak('Command received. Processing. This is a demo response from Cyber Starlink.');
    };
    window.__cs_recog = r;
  }, []);

  const startListen = () => {
    const r = window.__cs_recog;
    if (!r) return alert('SpeechRecognition not supported.');
    setListening(true);
    r.start();
    r.onend = () => setListening(false);
  };

  return (
    <div style={{ position: 'fixed', left: 18, bottom: 18 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn" onClick={() => speak('Cyber Starlink ready. Awaiting commands.')}>🔊 Jarvis Speak</button>
        <button className="btn" onClick={startListen}>{listening ? 'Listening...' : '🎙️ Listen'}</button>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#cbd5e1' }}>Last: {lastSpoken}</div>
    </div>
  );
}
