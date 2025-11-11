// fix-imports.cjs
const fs = require("fs");
const path = require("path");

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else if (file.endsWith(".js")) {
      results.push(file);
    }
  });
  return results;
}

const apiDir = path.join(__dirname, "app/api");
const files = walkDir(apiDir);

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");

  // Fix memory.js imports
  content = content.replace(
    /import\s+.*memory.*from\s+["'].*["'];?/g,
    `import { readMemory, writeMemory } from "@/lib/memory.js";`
  );

  // Fix prisma imports
  content = content.replace(
    /import\s+.*prisma.*from\s+["'].*["'];?/g,
    `import prisma from "@/lib/prisma.js";`
  );
  content = content.replace(
    /import\s+{ prisma }.*from\s+["'].*["'];?/g,
    `import prisma from "@/lib/prisma.js";`
  );

  fs.writeFileSync(file, content, "utf8");
  console.log("Updated:", file);
});

console.log("✅ All imports fixed!");
