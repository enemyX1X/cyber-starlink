"use client";
import { useState, useEffect } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(()=> {
    // try reading cookie
    const m = document.cookie.match(/(?:^|; )cs_user=([^;]+)/);
    if (m) setUser(decodeURIComponent(m[1]));
    if (onLogin && user) onLogin(user);
  }, []);

  const submit = async () => {
    if (!name.trim()) return;
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ username: name.trim() })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.username);
      if (onLogin) onLogin(data.username);
    } else {
      alert("Login failed");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    document.cookie = "cs_user=; Path=/; Max-Age=0";
    if (onLogin) onLogin(null);
  };

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="text-sm">Signed in as <span className="font-semibold">{user}</span></div>
        <button onClick={logout} className="px-2 py-1 bg-red-500 rounded text-xs">Logout</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="username" className="px-2 py-1 rounded bg-white/5"/>
      <button onClick={submit} className="px-2 py-1 bg-cyan-500 rounded">Login</button>
    </div>
  );
}
