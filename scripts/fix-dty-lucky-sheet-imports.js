/**
 * 自动修复 DtyLuckySheet 的导入路径
 * 将 @fortune-sheet/core 和 @fortune-sheet/react 的导入改为相对路径
 */

const fs = require('fs');
const path = require('path');

const dtyLuckySheetDir = path.join(__dirname, '../src/dty-lucky-sheet');

// 需要处理的文件扩展名
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

// 获取所有需要处理的文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 跳过 node_modules
      if (file !== 'node_modules') {
        getAllFiles(filePath, fileList);
      }
    } else if (extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// 修复导入路径
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 获取文件相对于 dty-lucky-sheet 的路径
  const relativePath = path.relative(dtyLuckySheetDir, path.dirname(filePath));
  const depth = relativePath ? relativePath.split(path.sep).length : 0;
  
  // 计算到 core 的相对路径
  const toCorePrefix = depth === 0 ? './core' : '../'.repeat(depth) + 'core';
  const toContextPrefix = depth === 0 ? './context' : '../'.repeat(depth) + 'context';
  
  // 替换 @fortune-sheet/core 导入
  const coreImportRegex = /from\s+["']@fortune-sheet\/core["']/g;
  if (coreImportRegex.test(content)) {
    content = content.replace(coreImportRegex, `from "${toCorePrefix}"`);
    modified = true;
    console.log(`✓ Fixed @fortune-sheet/core imports in: ${path.relative(process.cwd(), filePath)}`);
  }
  
  // 替换特定的 core 子模块导入
  const coreSubmodules = [
    'types', 'context', 'canvas', 'settings', 'utils',
    'events/mouse', 'events/keyboard', 'events/copy', 'events/paste', 'events/index',
    'modules/cell', 'modules/selection', 'modules/formula', 'modules/format',
    'modules/merge', 'modules/freeze', 'modules/border', 'modules/color',
    'locale/index', 'locale/zh', 'locale/en'
  ];
  
  coreSubmodules.forEach(submodule => {
    const regex = new RegExp(`from\\s+["']@fortune-sheet\\/core\\/${submodule}["']`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `from "${toCorePrefix}/${submodule}"`);
      modified = true;
    }
  });
  
  // 替换 @fortune-sheet/react 导入（通常是组件之间的引用）
  const reactImportRegex = /from\s+["']@fortune-sheet\/react["']/g;
  if (reactImportRegex.test(content)) {
    // 如果在 components 目录内，引用其他组件
    if (filePath.includes('components')) {
      content = content.replace(reactImportRegex, 'from ".."');
    } else {
      content = content.replace(reactImportRegex, 'from "./components"');
    }
    modified = true;
    console.log(`✓ Fixed @fortune-sheet/react imports in: ${path.relative(process.cwd(), filePath)}`);
  }
  
  // 替换 @fortune-sheet/react 子模块导入
  const reactComponentsRegex = /from\s+["']@fortune-sheet\/react\/(.+?)["']/g;
  content = content.replace(reactComponentsRegex, (match, subpath) => {
    modified = true;
    // 根据当前文件位置计算相对路径
    if (filePath.includes('components')) {
      return `from "../${subpath}"`;
    } else {
      return `from "./components/${subpath}"`;
    }
  });
  
  // 如果内容被修改，写回文件
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// 主函数
function main() {
  console.log('🔧 开始修复 DtyLuckySheet 的导入路径...\n');
  
  const files = getAllFiles(dtyLuckySheetDir);
  console.log(`📁 找到 ${files.length} 个文件需要检查\n`);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (fixImports(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✅ 完成！修复了 ${fixedCount} 个文件的导入路径`);
  
  if (fixedCount === 0) {
    console.log('💡 所有文件的导入路径都已经正确');
  }
}

// 运行脚本
main();

