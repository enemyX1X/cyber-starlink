import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { postId, content, author } = await req.json();
  const comment = await prisma.comment.create({
    data: {
      content,
      author,
      post: { connect: { id: parseInt(postId) } },
    },
  });
  return new Response(JSON.stringify(comment), { status: 201 });
}
