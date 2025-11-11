"use client";
import { useState } from "react";

export default function BackgroundGrid() {
  const [opacity, setOpacity] = useState(0.6);

  // Video sources – you can replace local paths later
  const gridSources = {
    topLeft: "https://www.youtube.com/embed/21X5lGlDOfg?autoplay=1&mute=1&loop=1", // NASA live
    topRight: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1", // Placeholder YouTube
    bottomLeft: "/media/loop.mp4", // local MP4/GIF (place file in /public/media/)
    bottomRight: "https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1&loop=1", // another YouTube
  };

  return (
    <div
      className="fixed inset-0 grid grid-cols-2 grid-rows-2 gap-[1px] z-0 bg-black"
      style={{ opacity }}
    >
      {/* Top-left: NASA */}
      <iframe
        src={gridSources.topLeft}
        className="w-full h-full object-cover"
        allow="autoplay; fullscreen"
      ></iframe>

      {/* Top-right: YouTube placeholder */}
      <iframe
        src={gridSources.topRight}
        className="w-full h-full object-cover"
        allow="autoplay; fullscreen"
      ></iframe>

      {/* Bottom-left: Local MP4 / GIF */}
      <video
        src={gridSources.bottomLeft}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Bottom-right: YouTube or stored video */}
      <iframe
        src={gridSources.bottomRight}
        className="w-full h-full object-cover"
        allow="autoplay; fullscreen"
      ></iframe>

      {/* Brightness / dimming control */}
      <div className="absolute bottom-4 right-4 bg-black/60 p-3 rounded-xl z-50 flex items-center backdrop-blur-md">
        <label className="mr-2 text-sm text-gray-200">Brightness</label>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity * 100}
          onChange={(e) => setOpacity(e.target.value / 100)}
          className="w-32 accent-cyan-400"
        />
        <span className="ml-2 text-gray-300 text-xs">{Math.round(opacity * 100)}%</span>
      </div>
    </div>
  );
}
