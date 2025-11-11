import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  const postId = parseInt(params.id);
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });
  return new Response(JSON.stringify(updatedPost), { status: 200 });
}
