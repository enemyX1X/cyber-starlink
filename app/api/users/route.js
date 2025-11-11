import { NextResponse } from "next/server";
import prisma from "@/lib/prisma.js";

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST new user
export async function POST(request) {
  try {
    const { name, email } = await request.json();
    const newUser = await prisma.user.create({
      data: { name, email },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
