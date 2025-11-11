import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: `${name.toLowerCase()}@local` },
    });

    // Create new user if not found
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase()}@local`,
          password: "none",
        },
      });
    }

    // ✅ Always return valid JSON
    return NextResponse.json({ id: user.id, name: user.name });
  } catch (err) {
    console.error("❌ Login API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
