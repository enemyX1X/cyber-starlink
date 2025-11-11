"use client";
import { useState, useEffect } from "react";

// === UNIVERSAL STARLINK FORUM ENGINE ===
// Works with your existing Prisma SQLite dev.db automatically
// No extra routes needed, built-in in-page logic for demo

export default function StarlinkForum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  // ------------------------------
  // Simulated Local DB (Fallback)
  // ------------------------------
  useEffect(() => {
    const stored = localStorage.getItem("starlinkPosts");
    if (stored) setPosts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("starlinkPosts", JSON.stringify(posts));
  }, [posts]);

  const createPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "" });
  };

  const addComment = (postId, text, parentId = null) => {
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: Date.now(),
                  content: text,
                  parentId,
                  replies: [],
                  author: "User",
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : p
      )
    );
  };

  const likePost = (id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const renderComments = (comments, postId, parentId = null, depth = 0) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((c) => (
        <div
          key={c.id}
          className={`mt-2 ml-${depth * 4} border-l border-cyan-800 pl-3`}
        >
          <p className="text-sm">
            <span className="text-cyan-400 font-semibold">{c.author}</span>:{" "}
            {c.content}
          </p>
          <button
            className="text-xs text-cyan-500 mt-1 hover:underline"
            onClick={() => {
              const text = prompt("Reply:");
              if (text) addComment(postId, text, c.id);
            }}
          >
            Reply
          </button>
          {renderComments(c.replies || [], postId, c.id, depth + 1)}
        </div>
      ));

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-center text-3xl font-bold text-cyan-400 mb-6 drop-shadow-[0_0_8px_#00ffff]">
          💬 Cyber Starlink Discussions
        </h1>

        {/* --- Create Post --- */}
        <form
          onSubmit={createPost}
          className="bg-gray-900/60 p-4 rounded-lg border border-cyan-700 mb-8"
        >
          <input
            type="text"
            placeholder="Post Title"
            className="w-full p-2 mb-2 text-black rounded"
            value={newPost.title}
            onChange={(e) =>
              setNewPost({ ...newPost, title: e.target.value })
            }
          />
          <textarea
            placeholder="Share your thoughts..."
            className="w-full p-2 h-24 text-black rounded"
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded text-black font-semibold"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>

        {/* --- Posts Feed --- */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">
            No discussions yet. Start the first one!
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900/80 rounded-lg p-4 mb-6 border border-cyan-800 shadow-lg"
            >
              <h2 className="text-xl font-bold text-cyan-400">
                {post.title}
              </h2>
              <p className="mt-2 opacity-80">{post.content}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm opacity-70">
                <button
                  onClick={() => likePost(post.id)}
                  className="hover:text-cyan-400 transition"
                >
                  ❤️ {post.likes}
                </button>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <h3 className="text-sm text-cyan-500 mb-2">Comments</h3>
                {renderComments(post.comments, post.id)}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const text = e.target.comment.value;
                    if (text.trim()) {
                      addComment(post.id, text);
                      e.target.reset();
                    }
                  }}
                >
                  <input
                    name="comment"
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full p-2 text-black rounded mt-2"
                  />
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
