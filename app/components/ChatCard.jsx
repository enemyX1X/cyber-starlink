"use client";
import React, { useState } from "react";

const ChatCard = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    console.log("🛰️ Sending to /api/chat...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are Jarvis, the Cyber Starlink AI assistant." },
            ...messages.map((m) => ({ role: m.role, content: m.text })),
            { role: "user", content: input },
          ],
        }),
      });

      if (!res.ok) {
        const errData = await res.text();
        console.error("❌ DeepSeek error:", errData);
        throw new Error(`DeepSeek failed: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "⚠️ No response received.";

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      console.warn("⚠️ DeepSeek unavailable:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Offline mode engaged. Estimating: "${input}" may relate to Earth data.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-gray-900 text-white p-6 rounded-2xl shadow-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">💬 Cyber Starlink Neural Chat</h2>
      <div className="bg-gray-800 p-3 rounded-lg h-72 overflow-y-auto mb-4 space-y-2">
        <div className="text-sm text-gray-400">👋 Cyber Starlink is online. How can I assist?</div>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl ${
              m.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
            } max-w-[80%]`}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-sm text-yellow-400">Processing...</div>}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-grow bg-gray-800 text-white p-2 rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatCard;
