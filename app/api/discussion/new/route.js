import prisma from "@/lib/prisma.js";

import { NextResponse } from "next/server";

export async function POST(req) {
  const { title, content, authorId } = await req.json();
  const post = await prisma.post.create({
    data: { title, content, authorId },
  });
  return NextResponse.json(post);
}
