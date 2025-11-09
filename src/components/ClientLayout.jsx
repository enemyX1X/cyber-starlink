// src/components/ClientLayout.jsx
"use client";
import { useEffect, useState } from "react";
import BackgroundGrid from "./BackgroundGrid";
import NavBar from "./NavBar";
import JarvisHUD from "./JarvisHUD";

export default function ClientLayout({ children }) {
  const [blur, setBlur] = useState(40);
  const [opacity, setOpacity] = useState(60);

  useEffect(() => {
    fetch("/api/memory")
      .then((r) => r.json())
      .then((j) => {
        if (j.settings) {
          setBlur(j.settings.blur ?? 40);
          setOpacity(j.settings.opacity ?? 60);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <BackgroundGrid blur={blur} opacity={opacity} />
      <div className="absolute inset-0 bg-black/30 -z-5" />
      <NavBar onBlurChange={(v) => setBlur(v)} />
      <main className="relative z-10 min-h-screen">{children}</main>
      <JarvisHUD />
    </>
  );
}
