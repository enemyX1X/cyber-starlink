"use client";
import { useState, useEffect } from "react";
import Jarvis from "./components/Jarvis";
import StatusHUD from "./components/StatusHUD";
import ChatCard from "./components/ChatCard";
import ImageCard from "./components/ImageCard";
import VoiceCard from "./components/VoiceCard";

import Image from "next/image";

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const [brightness, setBrightness] = useState(70);
  const [muted, setMuted] = useState({
    v1: true,
    yt1: true,
    yt2: true,
    v4: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = (id) => {
    setMuted((prev) => {
      const newState = !prev[id];
      // handle YouTube toggling dynamically by resetting src
      if (id === "yt1" || id === "yt2") {
        const iframe = document.getElementById(id);
        if (iframe) {
          const src = new URL(iframe.src);
          src.searchParams.set("mute", newState ? "1" : "0");
          iframe.src = src.toString();
        }
      }
      return { ...prev, [id]: newState };
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* ---- 2x2 Video Grid Background ---- */}
      <div
        className="absolute inset-0 grid grid-cols-2 grid-rows-2 z-0 transition-all duration-700"
        style={{ filter: `brightness(${brightness}%)` }}
      >
        {/* Quad 1 - Local MP4 */}
        <div className="relative w-full h-full">
          <video
            className="w-full h-full object-cover"
            src="/media/local1.mp4"
            autoPlay
            loop
            playsInline
            muted={muted.v1}
          />
          <button
            onClick={() => toggleMute("v1")}
            className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 text-xs rounded cursor-pointer"
          >
            {muted.v1 ? "🔇" : "🔊"}
          </button>
        </div>

        {/* Quad 2 - YouTube */}
        <div className="relative w-full h-full">
          <iframe
            id="yt1"
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/TNQsmPf24go?autoplay=1&mute=0&loop=1&playlist=TNQsmPf24go&controls=0&modestbranding=1&rel=0"
            title="YouTube Video 1"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
          <button
            onClick={() => toggleMute("yt1")}
            className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 text-xs rounded cursor-pointer"
          >
            {muted.yt1 ? "🔇" : "🔊"}
          </button>
        </div>

        {/* Quad 3 - YouTube */}
        <div className="relative w-full h-full">
          <iframe
            id="yt2"
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/Ei-TcECJVXU?autoplay=1&mute=0&loop=1&playlist=Ei-TcECJVXU&controls=0&modestbranding=1&rel=0"
            title="YouTube Video 2"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
          <button
            onClick={() => toggleMute("yt2")}
            className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 text-xs rounded cursor-pointer"
          >
            {muted.yt2 ? "🔇" : "🔊"}
          </button>
        </div>

        {/* Quad 4 - Local MP4 */}
        <div className="relative w-full h-full">
          <video
            className="w-full h-full object-cover"
            src="/media/local4.mp4"
            autoPlay
            loop
            playsInline
            muted={muted.v4}
          />
          <button
            onClick={() => toggleMute("v4")}
            className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 text-xs rounded cursor-pointer"
          >
            {muted.v4 ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* ---- Overlayed UI ---- */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div
          className={`transition-all duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top Bar - Logo, Title, Status */}
          <div className="flex items-center justify-between w-full max-w-5xl mx-auto mb-6 px-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Cyber Starlink Logo"
                width={45}
                height={45}
                className="drop-shadow-[0_0_10px_#0ff]"
              />
              <h1 className="text-xl font-bold text-cyan-400 drop-shadow-[0_0_8px_#00ffff] whitespace-nowrap">
                CYBER STARLINK
              </h1>
            </div>
            <StatusHUD />
          </div>

          {/* Core HUD */}
          <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
            <ChatCard />
            <ImageCard />
            <VoiceCard />
          </div>

          {/* Brightness Control */}
          <div className="mt-8 text-center">
            <label className="text-xs opacity-70">Background Brightness</label>
            <input
              type="range"
              min="20"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(e.target.value)}
              className="w-48 mt-2 accent-cyan-500"
            />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm opacity-50">
            quantum internet • Next-Gen space orbit intelligence network • 2025
          </div>
        </div>
      </div>

      <Jarvis />
    </main>
  );
}
