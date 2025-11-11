// src/app/api/memory/route.js
import fs from "fs/promises";
import path from "path";

const MEMORY_DIR = path.join("C:", "Users", "DELL", "cyber-starlink", "memory");
const MEMORY_FILE = path.join(MEMORY_DIR, "memory.json");

async function ensureMemory() {
  try {
    await fs.mkdir(MEMORY_DIR, { recursive: true });
    try {
      await fs.access(MEMORY_FILE);
    } catch {
      const initial = {
        settings: { blur: 40, opacity: 60 },
        posts: [],
        chat: []
      };
      await fs.writeFile(MEMORY_FILE, JSON.stringify(initial, null, 2), "utf8");
    }
  } catch (e) {
    console.error("ensureMemory error:", e);
  }
}

async function readMemory() {
  await ensureMemory();
  const raw = await fs.readFile(MEMORY_FILE, "utf8");
  return JSON.parse(raw || "{}");
}

async function writeMemory(obj) {
  await ensureMemory();
  await fs.writeFile(MEMORY_FILE, JSON.stringify(obj, null, 2), "utf8");
}

export async function GET() {
  try {
    const mem = await readMemory();
    return new Response(JSON.stringify(mem), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const mem = await readMemory();

    if (body.type === "post") {
      // body.post must contain title, content, tags
      const id = `post_${Date.now()}`;
      const post = { id, createdAt: new Date().toISOString(), ...body.post };
      mem.posts.unshift(post);
      await writeMemory(mem);
      return new Response(JSON.stringify({ ok: true, post }), { status: 201 });
    }

    if (body.type === "chat") {
      const id = `chat_${Date.now()}`;
      const item = { id, createdAt: new Date().toISOString(), ...body.chat };
      mem.chat = mem.chat || [];
      mem.chat.push(item);
      await writeMemory(mem);
      return new Response(JSON.stringify({ ok: true, item }), { status: 201 });
    }

    return new Response(JSON.stringify({ ok: false, message: "invalid POST type" }), { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const mem = await readMemory();

    if (body.type === "settings") {
      mem.settings = { ...mem.settings, ...(body.settings || {}) };
      await writeMemory(mem);
      return new Response(JSON.stringify({ ok: true, settings: mem.settings }), { status: 200 });
    }

    if (body.type === "editPost") {
      const { id, updates } = body;
      mem.posts = (mem.posts || []).map((p) => (p.id === id ? { ...p, ...updates } : p));
      await writeMemory(mem);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ ok: false, message: "invalid PATCH request" }), { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
