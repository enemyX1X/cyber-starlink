"use client";
import { useEffect, useState } from "react";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [commentInput, setCommentInput] = useState({});

  // Fetch posts
  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }

  // Like a post
  async function likePost(postId) {
    await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    fetchPosts();
  }

  // Add comment
  async function addComment(postId, author) {
    if (!commentInput[postId]) return;
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        content: commentInput[postId],
        author,
      }),
    });
    setCommentInput({ ...commentInput, [postId]: "" });
    fetchPosts();
  }

  useEffect(() => {
    fetchPosts();
    // Optional: auto refresh every 5s for near real-time
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => likePost(post.id)}>❤️ {post.likes}</button>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Comments</h3>
            {post.comments.map((c) => (
              <div key={c.id} className="border-t py-1">
                <span className="font-bold">{c.author}: </span>
                {c.content}
              </div>
            ))}

            <div className="flex mt-2 gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput[post.id] || ""}
                onChange={(e) =>
                  setCommentInput({ ...commentInput, [post.id]: e.target.value })
                }
                className="border rounded p-1 flex-1"
              />
              <button onClick={() => addComment(post.id, "User")}>Reply</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
