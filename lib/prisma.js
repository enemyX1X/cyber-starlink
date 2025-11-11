// lib/prisma.js
import { PrismaClient } from "@prisma/client";

// Create a single Prisma client instance
const prisma = new PrismaClient();

// Export as default so your API routes can do:
// import prisma from "@/lib/prisma";
export default prisma;
