"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatCard() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Cyber Starlink is online. How can I assist?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Local fallback (if DeepSeek fails)
  const fakeReply = (userMessage) => {
    const replies = [
      `Analyzing: "${userMessage}"... Result seems inconclusive.`,
      `Cyber Starlink cannot connect to DeepSeek — switching to local inference.`,
      `Offline mode engaged. Estimating: "${userMessage}" may relate to Earth data.`,
      `Processing locally... "${userMessage}"? Possibly a simple concept.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      console.log("🛰️ Sending to /api/chat...");

      // ✅ NO API KEY HERE — the backend handles that securely
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are Jarvis, an advanced AI assistant with precise, informative responses." },
            ...messages.map((m) => ({ role: m.role, content: m.text })),
            { role: "user", content: input },
          ],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ DeepSeek error:", errText);
        throw new Error(`DeepSeek failed: ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();

      if (reply) {
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      } else {
        console.warn("⚠️ Empty response, switching to fallback.");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: fakeReply(input) },
        ]);
      }
    } catch (err) {
      console.error("⚠️ DeepSeek unavailable:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: fakeReply(input) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-black/60 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-md shadow-lg w-full max-w-md mx-auto">
      {/* Header */}
      <h2
      className="text-center text-transparent bg-clip-text bg-gradient-to-r
                 from-red-500 via-pink-600 to-red-700 font-extrabold text-xl sm:text-2xl
                 mb-4 tracking-wider select-none drop-shadow-[0_0_8px_#ff0040]"
>
  💬 Cyber Starlink connected...
</h2>


      {/* Chat window */}
      <div className="h-80 overflow-y-auto space-y-3 mb-3 p-2 bg-black/30 rounded-xl border border-white/10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg text-sm ${
              msg.role === "assistant"
                ? "bg-cyan-900/40 text-cyan-300"
                : "bg-white/10 text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input + Send */}
      <div className="flex items-center space-x-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 resize-none bg-black/40 text-white text-sm rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:border-cyan-400"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
            loading
              ? "bg-cyan-900/40 text-cyan-300"
              : "bg-cyan-500 hover:bg-cyan-600 text-black"
          }`}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
