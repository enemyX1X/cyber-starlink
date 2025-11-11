import { readMemory, writeMemory } from "@/lib/memory.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const username = (body.username || "").trim();
    if (!username) return new Response(JSON.stringify({ error: "username required" }), { status: 400 });

    const mem = await readMemory();
    mem.users = mem.users || [];
    if (!mem.users.includes(username)) mem.users.push(username);
    await writeMemory(mem);

    // set cookie (simple, local dev). Expires in 30 days
    const cookie = `cs_user=${encodeURIComponent(username)}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;

    return new Response(JSON.stringify({ ok: true, username }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
