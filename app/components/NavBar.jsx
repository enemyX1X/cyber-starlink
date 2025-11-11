"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(()=> {
    const m = document.cookie.match(/(?:^|; )cs_user=([^;]+)/);
    if (m) setUser(decodeURIComponent(m[1]));
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10 flex items-center justify-between px-6 py-3">
      <div className="flex items-center space-x-3">
        <Image src="/logo.png" alt="logo" width={36} height={36}/>
        <div className="text-cyan-300 font-bold">CYBER STARLINK</div>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="hover:text-cyan-200">Home</Link>
        <Link href="/discussions" className="hover:text-cyan-200">Discussions</Link>
        {user ? <div className="text-sm">Hi, <strong>{user}</strong></div> : <Link href="/discussions" className="text-sm">Login</Link>}
      </div>
    </nav>
  );
}
