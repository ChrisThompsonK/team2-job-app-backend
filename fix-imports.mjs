import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, 'dist');

async function getAllJsFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllJsFiles(fullPath));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function fixImportsInFile(filePath) {
  let content = await readFile(filePath, 'utf-8');
  const fileDir = dirname(filePath);
  
  // Find all relative imports
  const importRegex = /from\s+["'](\.[^"']*)["']/g;
  const matches = [...content.matchAll(importRegex)];
  
  for (const match of matches) {
    const importPath = match[1];
    
    // Skip if already has .js extension
    if (importPath.endsWith('.js')) continue;
    
    // Resolve the full path
    let fullPath;
    try {
      fullPath = resolve(fileDir, importPath);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        // It's a directory, add /index.js
        content = content.replace(
          `from "${importPath}"`,
          `from "${importPath}/index.js"`
        );
      } else {
        // It's a file, add .js
        content = content.replace(
          `from "${importPath}"`,
          `from "${importPath}.js"`
        );
      }
    } catch (err) {
      // If stat fails, assume it's a file and add .js
      content = content.replace(
        `from "${importPath}"`,
        `from "${importPath}.js"`
      );
    }
  }
  
  await writeFile(filePath, content, 'utf-8');
}

async function main() {
  try {
    console.log('Fixing imports in dist folder...');
    const jsFiles = await getAllJsFiles(distDir);
    console.log(`Found ${jsFiles.length} JavaScript files`);
    
    for (const file of jsFiles) {
      await fixImportsInFile(file);
    }
    
    console.log('✅ Fixed imports in dist folder');
  } catch (error) {
    console.error('❌ Error fixing imports:', error);
    process.exit(1);
  }
}

main();
