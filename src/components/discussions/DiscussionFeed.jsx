"use client";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function DiscussionFeed() {
  const [posts, setPosts] = useState([]);

  const loadPosts = () => {
    const stored = JSON.parse(localStorage.getItem("discussions") || "[]");
    setPosts(stored);
  };

  useEffect(() => {
    loadPosts();
    window.addEventListener("storage", loadPosts);
    return () => window.removeEventListener("storage", loadPosts);
  }, []);

  return (
    <div className="w-full max-w-3xl space-y-6">
      {posts.length === 0 ? (
        <p className="text-gray-300 text-center">No discussions yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
