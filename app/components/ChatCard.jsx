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

  // Local fallback
  const fakeReply = (userMessage) => {
    const replies = [
      `Analyzing: "${userMessage}"... Result seems inconclusive.`,
      `Cyber Starlink cannot connect to DeepSeek — switching to local inference.`,
      `Offline mode engaged. Estimating: "${userMessage}" may relate to Earth data.`,
      `Processing locally... ${userMessage}? Possibly a simple concept.`,
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
      console.log("🛰️ Sending to DeepSeek...");
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`, // 🔑 Replace with your key
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
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
      <h2 className="text-cyan-400 text-sm mb-3 font-semibold tracking-wide text-center">
        💬 Cyber Starlink Neural Chat
      </h2>

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
