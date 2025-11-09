"use client";
import React, { useState, useEffect } from "react";

// 💾 Local Storage Hybrid System
const STORAGE_KEY = "cyber_discussions_v1";

export default function DiscussionsPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [blur, setBlur] = useState(20); // background dim control (0–100%)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const addPost = () => {
    if (!newPost.trim()) return;
    setPosts([
      ...posts,
      {
        id: Date.now(),
        text: newPost,
        comments: [],
        reactions: 0,
      },
    ]);
    setNewPost("");
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [...p.comments, { id: Date.now(), text }],
            }
          : p
      )
    );
  };

  const addReaction = (postId) => {
    setPosts(
      posts.map((p) =>
        p.id === postId ? { ...p, reactions: p.reactions + 1 } : p
      )
    );
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(posts, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "memory.json";
    a.click();
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setPosts(JSON.parse(event.target.result));
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <main
      className="min-h-screen text-white relative"
      style={{
        background: "rgba(0,0,0,0.4)",
        backdropFilter: `blur(${blur / 4}px) brightness(${100 - blur * 0.3}%)`,
        transition: "all 0.4s ease",
      }}
    >
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          🚀 AI Discussion Hub
        </h1>

        {/* Controls */}
        <div className="flex justify-between mb-6 items-center flex-wrap gap-2">
          <input
            type="text"
            placeholder="Share your thoughts..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="flex-grow bg-gray-800 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
          />
          <button
            onClick={addPost}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Post
          </button>
          <div className="flex gap-2">
            <label className="bg-gray-700 px-3 py-2 rounded-lg cursor-pointer">
              Import
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={importData}
              />
            </label>
            <button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              Export
            </button>
          </div>
        </div>

        {/* Background blur control */}
        <div className="mb-6">
          <label className="text-sm opacity-70">
            Background Blur/Darkness ({blur}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={blur}
            onChange={(e) => setBlur(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 bg-opacity-80 rounded-xl p-4 shadow-md"
            >
              <p className="text-lg">{post.text}</p>
              <div className="flex items-center gap-4 mt-2 text-sm opacity-80">
                <button
                  onClick={() => addReaction(post.id)}
                  className="hover:text-yellow-400 transition"
                >
                  👍 {post.reactions}
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {post.comments.map((c) => (
                  <div
                    key={c.id}
                    className="ml-4 border-l border-gray-700 pl-4 text-sm opacity-90"
                  >
                    💬 {c.text}
                  </div>
                ))}
                <CommentBox onAdd={(t) => addComment(post.id, t)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// Component for adding comments
function CommentBox({ onAdd }) {
  const [text, setText] = useState("");
  return (
    <div className="flex mt-2 gap-2">
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow bg-gray-800 px-3 py-1 rounded-lg border border-gray-700 text-sm"
      />
      <button
        onClick={() => {
          onAdd(text);
          setText("");
        }}
        className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-lg text-sm"
      >
        Reply
      </button>
    </div>
  );
}
