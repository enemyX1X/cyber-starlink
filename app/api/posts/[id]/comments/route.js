import { readMemory, writeMemory } from "@/lib/memory.js";

export async function POST(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { author, text } = body;
    if (!author || !text) return new Response(JSON.stringify({ error: "author/text required" }), { status: 400 });

    const mem = await readMemory();
    mem.posts = mem.posts || [];
    const post = mem.posts.find(p => p.id === id);
    if (!post) return new Response(JSON.stringify({ error: "post not found" }), { status: 404 });

    const comment = { id: `c_${Date.now()}`, author, text, createdAt: new Date().toISOString(), likes: [] };
    post.comments = post.comments || [];
    post.comments.push(comment);
    await writeMemory(mem);
    return new Response(JSON.stringify({ ok: true, comment }), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
