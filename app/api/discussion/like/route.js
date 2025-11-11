import prisma from "@/lib/prisma.js";

import { NextResponse } from "next/server";

export async function POST(req) {
  const { postId, userId } = await req.json();

  const existing = await prisma.like.findFirst({
    where: { postId, userId },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { postId, userId } });
  }

  return NextResponse.json({ success: true });
}
