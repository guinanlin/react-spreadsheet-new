#!/usr/bin/env node

/**
 * dty-lucky-sheet 一键修复脚本
 * 自动修复所有已知的 TypeScript 错误
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 开始一键修复 dty-lucky-sheet 所有错误...\n');

// 确保 typings 目录存在
const typingsDir = 'src/typings';
if (!fs.existsSync(typingsDir)) {
  fs.mkdirSync(typingsDir, { recursive: true });
  console.log('📁 创建了 typings 目录');
}

// 1. 创建类型声明文件
createTypeDeclarations();

// 2. 修复 useOutsideClick 错误
fixUseOutsideClickErrors();

// 3. 修复 useRef 错误
fixUseRefErrors();

// 4. 修复公式解析器错误
fixFormulaParserErrors();

// 5. 修复 regenerator-runtime 错误
fixRegeneratorRuntimeErrors();

// 6. 更新 TypeScript 配置
updateTypeScriptConfig();

console.log('\n✅ 所有修复完成！');
console.log('🔍 现在可以运行: npx tsc --noEmit 来验证修复结果');

function createTypeDeclarations() {
  console.log('📝 创建类型声明文件...');
  
  // SSF 类型声明
  const ssfDeclaration = `declare module '../core/modules/ssf' {
  const SSF: {
    format: (fmt: string, value: any) => string;
    is_date: (fmt: string, value?: any) => boolean;
  };
  export default SSF;
}

// 全局声明，用于直接导入 SSF
declare const SSF: {
  format: (fmt: string, value: any) => string;
  is_date: (fmt: string, value?: any) => boolean;
};
`;

  fs.writeFileSync('src/typings/ssf.d.ts', ssfDeclaration);
  console.log('  ✅ 创建了 src/typings/ssf.d.ts');

  // regenerator-runtime 类型声明
  const regeneratorDeclaration = `declare module 'regenerator-runtime' {
  const regeneratorRuntime: any;
  export default regeneratorRuntime;
}
`;

  fs.writeFileSync('src/typings/regenerator-runtime.d.ts', regeneratorDeclaration);
  console.log('  ✅ 创建了 src/typings/regenerator-runtime.d.ts');
}

function fixUseOutsideClickErrors() {
  console.log('🔧 修复 useOutsideClick 类型错误...');
  
  const files = [
    'src/dty-lucky-sheet/components/ContextMenu/FilterMenu.tsx',
    'src/dty-lucky-sheet/components/DataVerification/DropdownList.tsx',
    'src/dty-lucky-sheet/components/Toolbar/Combo.tsx',
    'src/dty-lucky-sheet/components/ContextMenu/SheetTab.tsx',
    'src/dty-lucky-sheet/components/SheetList/index.tsx',
    'src/dty-lucky-sheet/components/Toolbar/MoreItemsContainer.tsx',
    'src/dty-lucky-sheet/components/ZoomControl/index.tsx'
  ];

  files.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // 修复 useOutsideClick 调用
      const originalContent = content;
      content = content.replace(
        /useOutsideClick\(\s*([^,]+),\s*/g,
        'useOutsideClick($1 as React.RefObject<HTMLElement>, '
      );
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log(`  ✅ 修复了 ${file}`);
      }
    }
  });
}

function fixUseRefErrors() {
  console.log('🔧 修复 useRef 类型错误...');
  
  const files = [
    'src/dty-lucky-sheet/components/FxEditor/index.tsx',
    'src/dty-lucky-sheet/components/SheetOverlay/InputBox.tsx',
    'src/dty-lucky-sheet/hooks/usePrevious.tsx'
  ];

  files.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // 修复 useRef<T>() 为 useRef<T | undefined>(undefined)
      const originalContent = content;
      content = content.replace(
        /useRef<([^>]+)>\(\)/g,
        'useRef<$1 | undefined>(undefined)'
      );
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log(`  ✅ 修复了 ${file}`);
      }
    }
  });
}

function fixFormulaParserErrors() {
  console.log('🔧 修复公式解析器类型错误...');
  
  const file = 'src/dty-lucky-sheet/formula-parser/index.ts';
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 修复 onRange 返回值
    const originalContent = content;
    content = content.replace(
      /return \{ value: \[\[0\]\], ref \};/g,
      'return [[0]];'
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`  ✅ 修复了 ${file}`);
    }
  }
}

function fixRegeneratorRuntimeErrors() {
  console.log('🔧 修复 regenerator-runtime 错误...');
  
  const file = 'src/dty-lucky-sheet/components/ContextMenu/index.tsx';
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 移除 regeneratorRuntime 导入
    const originalContent = content;
    content = content.replace(/import regeneratorRuntime from "regenerator-runtime";\n?/g, '');
    content = content.replace(/if \(name === "paste" && regeneratorRuntime\)/g, 'if (name === "paste")');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`  ✅ 修复了 ${file}`);
    }
  }
}

function updateTypeScriptConfig() {
  console.log('🔧 更新 TypeScript 配置...');
  
  const configFile = 'tsconfig.json';
  if (fs.existsSync(configFile)) {
    let content = fs.readFileSync(configFile, 'utf8');
    const config = JSON.parse(content);
    
    // 确保配置正确
    if (config.compilerOptions.jsx !== 'react-jsx') {
      config.compilerOptions.jsx = 'react-jsx';
    }
    
    if (!config.compilerOptions.allowSyntheticDefaultImports) {
      config.compilerOptions.allowSyntheticDefaultImports = true;
    }
    
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    console.log('  ✅ 更新了 tsconfig.json');
  }
}
