"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NavbarWrapper() {
  const [glitchText, setGlitchText] = useState("CYBER STARLINK");
  const [trailWidths, setTrailWidths] = useState([]);

  // Run only on client to avoid SSR mismatch
  useEffect(() => {
    const widths = Array.from({ length: 5 }, () => 15 + Math.random() * 10);
    setTrailWidths(widths);

    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const variants = [
          "CY8ER ST4RL1NK",
          "CYBΞR ⋆ STΔRLINK",
          "C¥BER S†ARL!NK",
          "CYBER STARLINK_",
        ];
        const rand = variants[Math.floor(Math.random() * variants.length)];
        setGlitchText(rand);
        setTimeout(() => setGlitchText("CYBER STARLINK"), 300);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap"
        rel="stylesheet"
      />

      <motion.nav
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden"
        style={{
          padding: "1.2rem",
          background:
            "radial-gradient(circle at 30% 50%, #001018 0%, #000814 70%, #000510 100%)",
          color: "#00ffff",
          textAlign: "center",
          fontWeight: "bold",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          borderBottom: "1px solid rgba(0,255,255,0.4)",
          boxShadow: "0 0 25px rgba(0,255,255,0.4)",
          fontFamily: "'Orbitron', monospace",
        }}
      >
        {/* ========= Title ========= */}
        <motion.div
          style={{
            position: "relative",
            zIndex: 5,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "1.3rem",
            letterSpacing: "3px",
            textTransform: "uppercase",
            textShadow:
              "0 0 10px #00ffff, 0 0 20px #00aaff, 0 0 40px #0066ff",
          }}
        >
          <motion.span
            animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.2 }}
            style={{
              display: "inline-block",
              filter: "drop-shadow(0 0 8px #00ffff)",
            }}
          >
            🚀
          </motion.span>

          <motion.span
            animate={{
              opacity: [1, 0.7, 1],
              x: [0, 2, -2, 0],
              skewX: [0, 10, -10, 0],
            }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            {glitchText}
          </motion.span>
        </motion.div>

        {/* ========= Centered HOME Button ========= */}
        <div className="mt-2 z-10 relative">
          <Link
            href="/"
            className="inline-block px-4 py-1.5 rounded-md text-cyan-200 border border-cyan-400/50 
                       hover:bg-cyan-400 hover:text-black transition-all duration-300 
                       text-sm font-semibold tracking-wider"
            style={{
              textShadow: "0 0 8px #00ffff, 0 0 16px #00aaff",
              boxShadow: "0 0 10px rgba(0,255,255,0.4)",
            }}
          >
            HOME
          </Link>
        </div>

        {/* ========= Discussion Button (Top Right) ========= */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10"
        >
          <Link
            href="/network"
            className="px-4 py-2 text-sm font-bold bg-cyan-500 text-black rounded-xl 
                       shadow-lg hover:bg-cyan-400 transition-all duration-300"
          >
            Discussion
          </Link>
        </div>

        {/* ========= Moving Tron Light Trails ========= */}
        {trailWidths.map((width, i) => (
          <motion.div
            key={`trail-${i}`}
            initial={{ x: "-20%" }}
            animate={{ x: "120%" }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 h-full"
            style={{
              width: `${width}%`,
              background:
                "linear-gradient(90deg, transparent, rgba(0,255,255,0.6), rgba(0,255,255,0))",
              filter: "blur(8px)",
              zIndex: 1,
              opacity: 0.4,
            }}
          />
        ))}

        {/* ========= Lightcycles ========= */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`cycle-${i}`}
            initial={{ x: "-15%" }}
            animate={{ x: "115%" }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute text-cyan-400 opacity-90 text-xl"
            style={{
              bottom: `${8 + i * 8}px`,
              zIndex: 3,
              filter: "drop-shadow(0 0 6px cyan)",
            }}
          >
            🏍️
          </motion.div>
        ))}

        {/* ========= Scanlines ========= */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,255,255,0.05) 0px, rgba(0,255,255,0.05) 1px, transparent 2px, transparent 4px)",
            opacity: 0.2,
            zIndex: 2,
          }}
        />

        {/* ========= Neon Glow Overlay ========= */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,255,255,0.15), transparent 70%)",
            zIndex: 1,
          }}
        />
      </motion.nav>
    </>
  );
}
