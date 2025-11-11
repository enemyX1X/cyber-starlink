import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(req) {
  const { postId, userId, content } = await req.json();

  const comment = await prisma.comment.create({
    data: { postId, userId, content },
  });

  return NextResponse.json(comment);
}
