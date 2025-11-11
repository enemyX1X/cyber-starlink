// server-only utility for reading/writing memory.json
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
        posts: [], // each post: { id, author, title, body, createdAt, likes:[], comments:[] }
        chat: [],  // chat messages: { id, author, text, createdAt }
        users: []  // optional: list of usernames seen
      };
      await fs.writeFile(MEMORY_FILE, JSON.stringify(initial, null, 2), "utf8");
    }
  } catch (e) {
    console.error("ensureMemory error:", e);
  }
}

export async function readMemory() {
  await ensureMemory();
  const raw = await fs.readFile(MEMORY_FILE, "utf8");
  return JSON.parse(raw || "{}");
}

export async function writeMemory(obj) {
  await ensureMemory();
  await fs.writeFile(MEMORY_FILE, JSON.stringify(obj, null, 2), "utf8");
}
