"use client";
import { useState, useEffect } from "react";

export default function Discussions() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [newPost, setNewPost] = useState("");
  const [darkness, setDarkness] = useState(20);

  // Load existing posts from memory.json (if available)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cyber_discussions");
      if (saved) setPosts(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load memory", err);
    }
  }, []);

  // Save posts automatically
  useEffect(() => {
    localStorage.setItem("cyber_discussions", JSON.stringify(posts));
  }, [posts]);

  const addPost = () => {
    if (!newPost.trim() || !username.trim()) return;
    const newEntry = {
      id: Date.now(),
      user: username,
      text: newPost,
      comments: [],
      likes: 0,
      hearts: 0,
    };
    setPosts([newEntry, ...posts]);
    setNewPost("");
  };

  const addComment = (id, commentUser, commentText) => {
    if (!commentText.trim()) return;
    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: Date.now(), user: commentUser, text: commentText },
              ],
            }
          : p
      )
    );
  };

  const react = (id, type) => {
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, [type]: (p[type] || 0) + 1 } : p
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
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        setPosts(imported);
      } catch {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="min-h-screen text-white relative p-8"
      style={{
        background: `rgba(0,0,0,${darkness / 100})`,
        backdropFilter: `blur(${darkness / 5}px)`,
      }}
    >
      <h1 className="text-3xl font-bold mb-6">🚀 AI Discussion Hub</h1>

      {/* Username */}
      <input
        className="w-64 p-2 rounded bg-black/40 border border-red-600 mb-3"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* New Post */}
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full p-3 rounded bg-black/30 border border-red-700"
        rows={3}
      />

      <div className="flex gap-3 mt-3">
        <button
          onClick={addPost}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Post
        </button>
        <button
          onClick={exportData}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Export
        </button>
        <label className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded cursor-pointer">
          Import
          <input type="file" accept=".json" hidden onChange={importData} />
        </label>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm">Background Blur/Darkness</span>
          <input
            type="range"
            min="0"
            max="100"
            value={darkness}
            onChange={(e) => setDarkness(Number(e.target.value))}
          />
          <span>{darkness}%</span>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {posts.length === 0 && (
          <div className="text-gray-400 text-sm">
            No discussions yet. Start one above!
          </div>
        )}

        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-black/50 border border-red-900 rounded-xl p-4"
          >
            <div className="text-sm text-red-400 mb-1">@{p.user}</div>
            <div className="text-base mb-3">{p.text}</div>

            <div className="flex gap-4 text-sm mb-3">
              <button onClick={() => react(p.id, "likes")}>👍 {p.likes}</button>
              <button onClick={() => react(p.id, "hearts")}>
                ❤️ {p.hearts}
              </button>
            </div>

            {/* Comments */}
            <div className="ml-4">
              {p.comments.map((c) => (
                <div key={c.id} className="mb-2">
                  <span className="text-cyan-400">@{c.user}: </span>
                  <span>{c.text}</span>
                </div>
              ))}

              <CommentBox
                onSubmit={(text) => addComment(p.id, username, text)}
                disabled={!username}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentBox({ onSubmit, disabled }) {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2 mt-2">
      <input
        className="flex-1 p-2 rounded bg-black/40 border border-gray-700 text-sm"
        placeholder={disabled ? "Login name to comment" : "Add a comment..."}
        disabled={disabled}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          if (text.trim()) {
            onSubmit(text);
            setText("");
          }
        }}
        className="bg-gray-700 hover:bg-gray-600 px-3 rounded text-sm"
      >
        Reply
      </button>
    </div>
  );
}
