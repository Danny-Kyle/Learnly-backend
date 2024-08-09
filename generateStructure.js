import fs from 'fs';
import path from 'path';

const walkDir = (dir, depth = 0, maxDepth = 2) => {
    if (depth > maxDepth) return;

    const files = fs.readdirSync(dir);
    files.forEach(file => {
        // Skip node_modules directory
        if (file === 'node_modules') return;

        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        console.log('  '.repeat(depth) + (stat.isDirectory() ? '📂 ' : '📄 ') + file);

        if (stat.isDirectory()) {
            walkDir(filePath, depth + 1, maxDepth);
        }
    });
};

walkDir('.', 0, 2);
