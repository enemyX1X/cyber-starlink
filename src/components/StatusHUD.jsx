"use client";\nimport { useEffect, useState } from "react";\n\nexport default function StatusHUD(){\n  const [ping, setPing] = useState(null);\n  const [ok, setOk] = useState(false);\n\n  useEffect(()=>{\n    const check = async ()=>{\n      const t0 = performance.now();\n      try {\n        const r = await fetch('/api/ping');\n        const t1 = performance.now();\n        setPing(Math.round(t1-t0));\n        setOk(r.ok);\n      } catch(e){ setOk(false); setPing(null); }\n    };\n    check();\n    const id = setInterval(check,30000);
    return ()=>clearInterval(id);
  },[]);

  return (
    <div className="hud">
      <div style={{fontWeight:700,color:'var(--blood)'}}>AI CORE</div>
      <div style={{fontSize:12, marginTop:6}}>Status: {ok ? <span style={{color:'#4ade80'}}>online</span> : <span style={{color:'#fb7185'}}>offline</span>}</div>
      <div style={{fontSize:12}}>Ping: {ping !== null ? ping + ' ms' : '—'}</div>
    </div>
  );
}
