// lib/prisma.js
import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in dev (Next.js hot reload)
let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;

export default prisma; // ✅ use default export
