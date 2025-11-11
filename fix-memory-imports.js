// fix-memory-imports.cjs
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "app");
const MEMORY_IMPORT = 'import { readMemory, writeMemory } from "@/lib/memory.js";';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      content = content.replace(/import\s+{[^}]+}\s+from\s+['"].*memory\.js['"];?/g, MEMORY_IMPORT);
      fs.writeFileSync(fullPath, content, "utf-8");
    }
  }
}

fixImports(ROOT);
console.log("✅ All memory imports fixed!");
