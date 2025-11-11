// fix-memory-imports.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root folder to scan
const apiDir = path.join(__dirname, "app/api");

// Recursive function to process all .js files
function updateImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      updateImports(fullPath);
    } else if (fullPath.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      const regex = /import\s+\{\s*readMemory,\s*writeMemory\s*\}\s+from\s+["'].*memory\.js["'];/g;

      if (regex.test(content)) {
        content = content.replace(
          regex,
          `import { readMemory, writeMemory } from "@/lib/memory.js";`
        );
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log(`Updated import in: ${fullPath}`);
      }
    }
  }
}

updateImports(apiDir);
console.log("✅ All memory.js imports updated.");
