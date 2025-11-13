"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const m = document.cookie.match(/(?:^|; )cs_user=([^;]+)/);
    if (m) setUser(decodeURIComponent(m[1]));
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full z-50 overflow-hidden backdrop-blur-md bg-black/40 border-b border-red-500/30 flex items-center justify-between px-6 py-3 shadow-[0_0_25px_rgba(255,0,0,0.3)]"
    >
      {/* 🔥 Moving Neon Red Light Trails */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 h-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,0,0,0.7), transparent)",
            filter: "blur(6px)",
            opacity: 0.5,
          }}
          initial={{ x: "-15%" }}
          animate={{ x: "120%" }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear",
          }}
        />
      ))}

      {/* 🚀 Logo + Title */}
      <div className="flex items-center space-x-3 relative z-10">
        <Image src="/logo.png" alt="logo" width={36} height={36} />
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-red-600 font-extrabold text-lg tracking-wider drop-shadow-[0_0_6px_#ff0000]">
          CYBER STARLINK
        </div>
      </div>

      {/* 🔗 Navigation Links */}
      <div className="hidden md:flex items-center gap-6 relative z-10 text-sm font-medium">
        <Link href="/" className="hover:text-red-400 transition">Home</Link>

        {/* 💬 Glowing Discussions Button */}
        <Link
          href="/discussions"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-pink-500 to-red-700 text-white shadow-[0_0_10px_rgba(255,0,0,0.8)] hover:shadow-[0_0_20px_rgba(255,0,0,1)] transition duration-300 font-semibold"
        >
          💬 Discussions
        </Link>

        {user ? (
          <div className="text-red-300">
            Hi, <strong>{user}</strong>
          </div>
        ) : (
          <Link href="/discussions" className="text-red-300 hover:text-red-400 transition">
            Login
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
