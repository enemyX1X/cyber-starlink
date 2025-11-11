import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { title, content } = await req.json();
  const post = await prisma.post.create({ data: { title, content } });
  return new Response(JSON.stringify(post), { status: 201 });
}
