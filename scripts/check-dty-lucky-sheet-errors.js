#!/usr/bin/env node

/**
 * dty-lucky-sheet 错误检测和修复脚本
 * 自动发现所有 TypeScript 错误并提供修复建议
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 开始检测 dty-lucky-sheet 组件错误...\n');

// 1. 运行 TypeScript 检查
console.log('📋 步骤1: 运行 TypeScript 类型检查...');
try {
  const result = execSync('npx tsc --noEmit --project tsconfig.json 2>&1', { 
    encoding: 'utf8',
    cwd: process.cwd()
  });
  console.log('✅ TypeScript 检查完成');
} catch (error) {
  const output = error.stdout || error.stderr || error.message;
  console.log('❌ 发现 TypeScript 错误:\n');
  
  // 2. 解析错误并分类
  const errors = parseTypeScriptErrors(output);
  console.log(`📊 错误统计: 共发现 ${errors.length} 个错误\n`);
  
  // 3. 按类型分组错误
  const groupedErrors = groupErrorsByType(errors);
  
  // 4. 生成修复报告
  generateFixReport(groupedErrors);
  
  // 5. 生成修复脚本
  generateFixScript(groupedErrors);
}

function parseTypeScriptErrors(output) {
  const errorLines = output.split('\n').filter(line => 
    line.includes('error TS') && line.includes('src/dty-lucky-sheet')
  );
  
  return errorLines.map(line => {
    const match = line.match(/src\/dty-lucky-sheet\/([^:]+):(\d+):(\d+):\s+error\s+(TS\d+):\s+(.+)/);
    if (match) {
      return {
        file: match[1],
        line: parseInt(match[2]),
        column: parseInt(match[3]),
        code: match[4],
        message: match[5],
        fullLine: line
      };
    }
    return null;
  }).filter(Boolean);
}

function groupErrorsByType(errors) {
  const groups = {
    useOutsideClick: [],
    useRef: [],
    ssf: [],
    regeneratorRuntime: [],
    formulaParser: [],
    importIssues: [],
    other: []
  };
  
  errors.forEach(error => {
    if (error.message.includes('useOutsideClick')) {
      groups.useOutsideClick.push(error);
    } else if (error.message.includes('useRef') || error.message.includes('Expected 1 arguments')) {
      groups.useRef.push(error);
    } else if (error.message.includes('SSF') || error.message.includes('format')) {
      groups.ssf.push(error);
    } else if (error.message.includes('regenerator-runtime')) {
      groups.regeneratorRuntime.push(error);
    } else if (error.message.includes('formula-parser') || error.message.includes('onRange')) {
      groups.formulaParser.push(error);
    } else if (error.message.includes('import') || error.message.includes('Module')) {
      groups.importIssues.push(error);
    } else {
      groups.other.push(error);
    }
  });
  
  return groups;
}

function generateFixReport(groups) {
  console.log('📋 错误分类报告:\n');
  
  Object.entries(groups).forEach(([type, errors]) => {
    if (errors.length > 0) {
      console.log(`🔸 ${type.toUpperCase()} 错误 (${errors.length} 个):`);
      errors.forEach(error => {
        console.log(`   - ${error.file}:${error.line} - ${error.message}`);
      });
      console.log('');
    }
  });
}

function generateFixScript(groups) {
  const fixScript = `#!/usr/bin/env node

/**
 * 自动修复 dty-lucky-sheet 错误的脚本
 * 由 check-dty-lucky-sheet-errors.js 自动生成
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 开始自动修复 dty-lucky-sheet 错误...\n');

${generateUseOutsideClickFixes(groups.useOutsideClick)}
${generateUseRefFixes(groups.useRef)}
${generateSSFFixes(groups.ssf)}
${generateRegeneratorRuntimeFixes(groups.regeneratorRuntime)}
${generateFormulaParserFixes(groups.formulaParser)}

console.log('✅ 所有修复完成！');
`;

  fs.writeFileSync('scripts/fix-dty-lucky-sheet-auto.js', fixScript);
  console.log('📝 已生成自动修复脚本: scripts/fix-dty-lucky-sheet-auto.js');
  console.log('🚀 运行命令: node scripts/fix-dty-lucky-sheet-auto.js\n');
}

function generateUseOutsideClickFixes(errors) {
  if (errors.length === 0) return '';
  
  const files = [...new Set(errors.map(e => e.file))];
  
  return `
// 修复 useOutsideClick 类型错误
${files.map(file => `
// 修复 ${file}
const ${file.replace(/[\/\-\.]/g, '_')} = 'src/dty-lucky-sheet/${file}';
if (fs.existsSync(${file.replace(/[\/\-\.]/g, '_')})) {
  let content = fs.readFileSync(${file.replace(/[\/\-\.]/g, '_')}, 'utf8');
  content = content.replace(
    /useOutsideClick\\(([^,]+),/g,
    'useOutsideClick($1 as React.RefObject<HTMLElement>,'
  );
  fs.writeFileSync(${file.replace(/[\/\-\.]/g, '_')}, content);
  console.log('✅ 修复了 ${file} 的 useOutsideClick 错误');
}
`).join('')}
`;
}

function generateUseRefFixes(errors) {
  if (errors.length === 0) return '';
  
  return `
// 修复 useRef 类型错误
const useRefFiles = [
${[...new Set(errors.map(e => e.file))].map(file => `  'src/dty-lucky-sheet/${file}'`).join(',\n')}
];

useRefFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // 修复 useRef<T>() 为 useRef<T | undefined>(undefined)
    content = content.replace(
      /useRef<([^>]+)>\\(\\)/g,
      'useRef<$1 | undefined>(undefined)'
    );
    fs.writeFileSync(file, content);
    console.log('✅ 修复了 ' + file + ' 的 useRef 错误');
  }
});
`;
}

function generateSSFFixes(errors) {
  if (errors.length === 0) return '';
  
  return `
// 创建 SSF 类型声明文件
const ssfDeclaration = \`declare module '../core/modules/ssf' {
  const SSF: {
    format: (fmt: string, value: any) => string;
    is_date: (fmt: string, value?: any) => boolean;
  };
  export default SSF;
}

declare const SSF: {
  format: (fmt: string, value: any) => string;
  is_date: (fmt: string, value?: any) => boolean;
};
\`;

fs.writeFileSync('src/typings/ssf.d.ts', ssfDeclaration);
console.log('✅ 创建了 SSF 类型声明文件');
`;
}

function generateRegeneratorRuntimeFixes(errors) {
  if (errors.length === 0) return '';
  
  return `
// 创建 regenerator-runtime 类型声明文件
const regeneratorDeclaration = \`declare module 'regenerator-runtime' {
  const regeneratorRuntime: any;
  export default regeneratorRuntime;
}
\`;

fs.writeFileSync('src/typings/regenerator-runtime.d.ts', regeneratorDeclaration);
console.log('✅ 创建了 regenerator-runtime 类型声明文件');
`;
}

function generateFormulaParserFixes(errors) {
  if (errors.length === 0) return '';
  
  return `
// 修复公式解析器类型错误
const formulaParserFile = 'src/dty-lucky-sheet/formula-parser/index.ts';
if (fs.existsSync(formulaParserFile)) {
  let content = fs.readFileSync(formulaParserFile, 'utf8');
  content = content.replace(
    /return \\{ value: \\[\\[0\\]\\], ref \\};/g,
    'return [[0]];'
  );
  fs.writeFileSync(formulaParserFile, content);
  console.log('✅ 修复了公式解析器类型错误');
}
`;
}

console.log('🎯 建议的解决方案:\n');
console.log('1. 运行生成的自动修复脚本');
console.log('2. 检查修复结果');
console.log('3. 如果还有问题，可以重新运行此脚本\n');
