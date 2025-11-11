"use client";

import { useState, useEffect } from "react";

export default function DiscussionPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/discussion");
        const data = await res.json();

        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Unexpected API response:", data);
          setPosts([]);
        }
      } catch (err) {
        console.error("Failed to load posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Discussion Forum</h1>

      {loading ? (
        <p className="text-gray-400">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400">No posts yet. Be the first to post!</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-700 p-4 rounded-lg hover:border-cyan-500 transition-colors"
            >
              <h2 className="font-bold text-lg text-cyan-300">{post.title}</h2>
              <p className="mt-2">{post.content}</p>
              <div className="mt-3 flex gap-4 text-sm text-gray-400">
                <span>Comments: {post.comments?.length ?? 0}</span>
                <span>Likes: {post.likes?.length ?? 0}</span>
              </div>
              {post.comments && post.comments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {post.comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-gray-900 p-2 rounded text-sm border-l-2 border-cyan-500"
                    >
                      {c.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
