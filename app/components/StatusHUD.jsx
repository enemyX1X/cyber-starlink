"use client";
import { useEffect, useState } from "react";

export default function StatusHUD() {
  const [ping, setPing] = useState(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const check = async () => {
      const t0 = performance.now();
      try {
        const r = await fetch('/api/ping');
        const t1 = performance.now();
        setPing(Math.round(t1 - t0));
        setOk(r.ok);
      } catch (e) {
        setOk(false);
        setPing(null);
      }
    };
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 18, right: 18, color: ok ? '#22c55e' : '#ef4444', fontSize: 13 }}>
      {ok ? `Online • ${ping}ms` : 'Offline'}
    </div>
  );
}
