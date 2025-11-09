"use client";
import { useState } from "react";

export default function PostCard({ post }) {
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");

  const handleReact = (type) => {
    const stored = JSON.parse(localStorage.getItem("discussions") || "[]");
    const updated = stored.map((p) =>
      p.id === post.id ? { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + 1 } } : p
    );
    localStorage.setItem("discussions", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment = { id: Date.now(), author: "Guest", text: commentText };
    const updated = [...comments, newComment];
    setComments(updated);

    const stored = JSON.parse(localStorage.getItem("discussions") || "[]");
    const newData = stored.map((p) =>
      p.id === post.id ? { ...p, comments: updated } : p
    );
    localStorage.setItem("discussions", JSON.stringify(newData));
    setCommentText("");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="bg-white/10 p-5 rounded-2xl shadow-lg">
      <p className="mb-3 text-lg">{post.content}</p>
      {post.image && (
        <img src={post.image} alt="Post" className="rounded-xl mb-3 max-h-80 object-cover" />
      )}
      <div className="flex gap-4 text-sm mb-2">
        <button onClick={() => handleReact("like")}>👍 {post.reactions.like}</button>
        <button onClick={() => handleReact("love")}>❤️ {post.reactions.love}</button>
      </div>

      <div className="mt-2 space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="bg-white/5 p-2 rounded-lg text-sm">
            <b>{c.author}: </b> {c.text}
          </div>
        ))}
        <div className="flex mt-2 gap-2">
          <input
            className="flex-1 bg-transparent border border-white/20 rounded-lg p-2 text-sm"
            placeholder="Write a reply..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={handleComment} className="px-3 py-1 bg-blue-600 rounded-lg text-sm">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
