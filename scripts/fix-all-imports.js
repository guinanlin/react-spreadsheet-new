/**
 * 修复所有 DtyLuckySheet 的导入路径
 */

const fs = require('fs');
const path = require('path');

const dtyLuckySheetDir = path.join(__dirname, '../src/dty-lucky-sheet');
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      getAllFiles(filePath, fileList);
    } else if (extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const originalContent = content;
  
  // 计算相对路径深度
  const relativePath = path.relative(dtyLuckySheetDir, path.dirname(filePath));
  const parts = relativePath ? relativePath.split(path.sep) : [];
  
  // 替换 @fortune-sheet/core
  content = content.replace(
    /from\s+["']@fortune-sheet\/core["']/g,
    (match) => {
      const prefix = parts.length === 0 ? './core' : '../'.repeat(parts.length) + 'core';
      return `from "${prefix}"`;
    }
  );
  
  // 替换 @fortune-sheet/formula-parser
  content = content.replace(
    /from\s+["']@fortune-sheet\/formula-parser["']/g,
    (match) => {
      const prefix = parts.length === 0 ? './formula-parser' : '../'.repeat(parts.length) + 'formula-parser';
      return `from "${prefix}"`;
    }
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  
  return false;
}

function main() {
  console.log('🔧 开始修复导入路径...\n');
  
  const files = getAllFiles(dtyLuckySheetDir);
  console.log(`📁 找到 ${files.length} 个文件\n`);
  
  let fixedCount = 0;
  files.forEach(file => {
    if (fixImports(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✅ 修复了 ${fixedCount} 个文件`);
}

main();

