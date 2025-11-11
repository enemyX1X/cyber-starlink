// fix-imports.cjs
// Run: node fix-imports.cjs

const fs = require("fs");
const path = require("path");

// Folder containing API routes
const apiFolder = path.join(__dirname, "app", "api");

// Function to recursively get all .js files in a folder
function getAllJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsFiles(fullPath));
    } else if (file.endsWith(".js")) {
      results.push(fullPath);
    }
  });
  return results;
}

// Replace imports for memory.js and prisma.js
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Fix memory.js imports
  content = content.replace(
    /import\s+\{[^}]*\}\s+from\s+["'].*memory\.js["'];?/g,
    'import { readMemory, writeMemory } from "@/lib/memory.js";'
  );

  // Fix prisma.js imports
  content = content.replace(
    /import\s+prisma\s+from\s+["'].*prisma["'];?/g,
    'import prisma from "@/lib/prisma.js";'
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Updated imports in: ${filePath}`);
}

// Run script
const jsFiles = getAllJsFiles(apiFolder);
jsFiles.forEach(fixImports);

console.log("✅ All imports fixed successfully!");
