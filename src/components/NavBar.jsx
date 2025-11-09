"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-red-500 tracking-widest">
          🚀 CYBER STARLINK
        </h1>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-6 text-sm">
          <Link href="/" className="hover:text-red-400 transition">
            🏠 Home
          </Link>
          <Link href="/discussions" className="hover:text-red-400 transition">
            🧠 Discussions
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile links */}
      {isOpen && (
        <div className="flex flex-col bg-black/80 text-center md:hidden">
          <Link
            href="/"
            className="py-2 border-t border-white/10 hover:bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            🏠 Home
          </Link>
          <Link
            href="/discussions"
            className="py-2 border-t border-white/10 hover:bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            🧠 Discussions
          </Link>
        </div>
      )}
    </nav>
  );
}
