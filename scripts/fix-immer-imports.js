/**
 * 修复 immer 的导入方式
 * 从: import produce from "immer"
 * 到: import { produce } from "immer"
 */

const fs = require('fs');
const path = require('path');

const files = [
  'src/dty-lucky-sheet/components/LocationCondition/index.tsx',
  'src/dty-lucky-sheet/components/ConditionFormat/ConditionRules.tsx',
  'src/dty-lucky-sheet/components/SearchReplace/index.tsx',
  'src/dty-lucky-sheet/components/ContextMenu/FilterMenu.tsx',
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  跳过 ${file} (文件不存在)`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 替换 import produce from "immer"
  const oldPattern = /import produce from "immer";/g;
  const newPattern = 'import { produce } from "immer";';
  
  if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newPattern);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ 修复 ${file}`);
  } else {
    console.log(`○ ${file} (无需修改)`);
  }
});

console.log('\n✅ 完成 immer 导入修复！');

