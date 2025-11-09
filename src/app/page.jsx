"use client";
import Image from "next/image";
import Jarvis from "../components/Jarvis";
import StatusHUD from "../components/StatusHUD";
import ChatCard from "../components/ChatCard";
import ImageCard from "../components/ImageCard";
import VoiceCard from "../components/VoiceCard";

export default function Page() {
  return (
    <main>
      <div className="grid-layer" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="hero">
          <div className="logo">
            <Image src="/logo.jpg" alt="logo" width={140} height={140} />
          </div>
          <div className="title">CYBER STARLINK</div>
          <div className="tag">Next-Gen Intelligence</div>

          <div className="cards" style={{ width: "100%", marginTop: 24 }}>
            <ChatCard />
            <ImageCard />
            <VoiceCard />
          </div>
        </div>

        <div className="cards" style={{ marginTop: 32 }}>
          <div className="card">
            <h3 className="text-lg font-semibold" style={{ color: "var(--blood)" }}>
              Music Gen (Coming Soon)
            </h3>
            <p className="text-sm opacity-70">Neural audio pipelines — planned.</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold" style={{ color: "var(--blood)" }}>
              Video Gen (Coming Soon)
            </h3>
            <p className="text-sm opacity-70">Text-to-video modules in roadmap.</p>
          </div>
        </div>

        <div className="footer">cyber starlink • enemyX • 2025</div>
      </div>

      <StatusHUD />
      <Jarvis />
    </main>
  );
}
