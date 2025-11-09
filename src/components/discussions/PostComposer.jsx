"use client";
import { useState } from "react";

export default function PostComposer() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (!content.trim()) return;
    const newPost = {
      id: Date.now(),
      author: "Guest",
      content,
      image,
      reactions: { like: 0, love: 0 },
      comments: [],
      timestamp: new Date().toISOString(),
    };
    const stored = JSON.parse(localStorage.getItem("discussions") || "[]");
    stored.unshift(newPost);
    localStorage.setItem("discussions", JSON.stringify(stored));
    setContent("");
    setImage(null);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl p-4 rounded-2xl mb-8 shadow-lg">
      <textarea
        className="w-full bg-transparent border border-white/20 rounded-lg p-3 text-white"
        placeholder="Share something about AI..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-between mt-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
        >
          Post
        </button>
      </div>
    </div>
  );
}
