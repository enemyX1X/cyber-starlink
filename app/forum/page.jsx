"use client";
import { useEffect, useState, useRef } from "react";

function timeAgo(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

// Small helper to build nested comment tree
function buildTree(comments) {
  const map = {};
  comments.forEach(c => (map[c.id] = { ...c, children: [] }));
  const roots = [];
  comments.forEach(c => {
    if (c.parentId && map[c.parentId]) map[c.parentId].children.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
}

export default function ForumPage() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const intervalRef = useRef(null);

  // load posts
  const loadPosts = async () => {
    try {
      const r = await fetch("/api/posts");
      if (!r.ok) return;
      const data = await r.json();
      // convert comment parentId to number (safe)
      setPosts(data);
    } catch (e) {
      console.error("loadPosts error", e);
    }
  };

  useEffect(() => {
    loadPosts();
    // auto refresh feed every 8 seconds
    intervalRef.current = setInterval(loadPosts, 8000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // login via existing /api/login route (creates or returns user)
  const doLogin = async (name) => {
    if (!name?.trim()) return alert("Enter a username");
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await r.json();
      if (data?.id) {
        setUsername(data.name);
        setLoggedIn(true);
        loadPosts();
      } else {
        alert("Login failed");
      }
    } catch (e) {
      console.error("login error", e);
      alert("Login error");
    }
  };

  const createPost = async () => {
    if (!content.trim()) return alert("Write something first");
    setLoading(true);
    try {
      const r = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), authorName: username }),
      });
      if (!r.ok) throw new Error("Post failed");
      await r.json();
      setTitle("");
      setContent("");
      await loadPosts();
    } catch (e) {
      console.error("createPost", e);
      alert("Failed to post");
    } finally {
      setLoading(false);
    }
  };

  const doLike = async (id) => {
    try {
      const r = await fetch("/api/like", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!r.ok) throw new Error("like failed");
      const updated = await r.json();
      setPosts((p) => p.map(x => x.id === updated.id ? updated : x));
    } catch (e) {
      console.error("doLike", e);
    }
  };

  const addComment = async (postId, text, parentId = null) => {
    if (!text.trim()) return;
    try {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text.trim(), authorName: username, parentId }),
      });
      if (!r.ok) throw new Error("comment failed");
      await r.json();
      await loadPosts();
    } catch (e) {
      console.error("addComment", e);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(255,7,58,0.03),transparent_10%),radial-gradient(circle_at_90%_90%,rgba(255,107,122,0.02),transparent_10%),linear-gradient(180deg,#000000_0%,#050406_100%)] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="w-12 h-12 rounded-full border-2 border-red-700 shadow-lg" />
            <div>
              <div className="text-2xl font-extrabold tracking-wider" style={{ color: "var(--blood, #ff073a)" }}>
                CYBER STARLINK
              </div>
              <div className="text-xs opacity-60">Next-Gen Intelligence Forum</div>
            </div>
          </div>

          {!loggedIn ? (
            <div className="flex gap-2 items-center">
              <input id="loginName" placeholder="unique username" className="px-3 py-2 rounded bg-black/60 text-white border border-white/10" />
              <button
                onClick={() => {
                  const el = document.getElementById("loginName");
                  doLogin(el?.value);
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-sm opacity-80">Logged in as <b className="text-cyan-300">{username}</b></div>
              <button onClick={() => { setLoggedIn(false); setUsername(""); }} className="px-3 py-1 bg-black/40 rounded border border-white/10">Logout</button>
            </div>
          )}
        </div>

        {/* Composer */}
        {loggedIn && (
          <section className="bg-black/50 border border-red-900/30 rounded-lg p-4 mb-6 shadow-xl">
            <input
              placeholder="Post title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded mb-2 bg-black/70"
            />
            <textarea
              placeholder="Share something with the network..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded h-24 bg-black/70"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="text-xs opacity-60">Posting as <b>{username}</b></div>
              <div className="flex gap-2">
                <button onClick={createPost} disabled={loading} className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded font-semibold text-black">
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Feed */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-black/60 border border-white/5 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="text-lg font-bold text-cyan-300">{post.title || "Untitled"}</div>
                  <div className="text-xs opacity-60">by <b>{post.author?.name || "Anon"}</b> • {timeAgo(post.createdAt)}</div>
                </div>
                <div className="text-right">
                  <button onClick={() => doLike(post.id)} className="bg-black/40 px-2 py-1 rounded border border-white/10">❤️ {post.likes}</button>
                </div>
              </div>

              <p className="mt-3 opacity-80">{post.content}</p>

              {/* Comments: build tree */}
              <div className="mt-4">
                <h4 className="text-sm text-cyan-400 mb-2">Comments</h4>
                <CommentTree post={post} onAdd={(text, parentId) => addComment(post.id, text, parentId)} />
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

// CommentTree component renders nested comments and reply boxes
function CommentTree({ post, onAdd }) {
  const [replyMap, setReplyMap] = useState({}); // parentId -> draft text

  const comments = (post.comments || []).map(c => ({
    id: c.id,
    content: c.content,
    parentId: c.parentId,
    author: c.author?.name || "Anon",
    createdAt: c.createdAt,
  }));
  const roots = buildTree(comments);

  const renderNode = (node, depth = 0) => (
    <div key={node.id} className={`pl-${depth * 4} mb-2`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-xs">{(node.author||"A").charAt(0).toUpperCase()}</div>
        <div className="flex-1">
          <div className="text-sm"><b className="text-cyan-300">{node.author}</b> <span className="text-xs opacity-60">· {new Date(node.createdAt).toLocaleString()}</span></div>
          <div className="text-sm opacity-80 mt-1">{node.content}</div>

          {/* reply toggle + input */}
          <div className="mt-2">
            <ReplyBox parentId={node.id} onAdd={(text) => onAdd(text, node.id)} />
          </div>

          {node.children?.map(child => renderNode(child, depth + 1))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* top-level reply box */}
      <div className="mb-3">
        <ReplyBox parentId={null} onAdd={(text) => onAdd(text, null)} placeholder="Add a comment..." />
      </div>

      {roots.length === 0 ? <div className="text-xs opacity-60">Be the first to comment</div> : roots.map(r => renderNode(r))}
    </div>
  );
}

function ReplyBox({ parentId, onAdd, placeholder = "Write a reply..." }) {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2 items-start">
      <input value={text} onChange={e => setText(e.target.value)} placeholder={placeholder} className="flex-1 p-2 rounded bg-black/70 text-white text-sm" />
      <button onClick={() => { if (text.trim()) { onAdd(text); setText(""); } }} className="px-3 py-1 bg-cyan-500 rounded text-black text-sm">Reply</button>
    </div>
  );
}
