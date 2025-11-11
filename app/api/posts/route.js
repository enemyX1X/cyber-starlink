import prisma from "@/lib/prisma.js";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { comments: true },
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(posts), { status: 200 });
}
