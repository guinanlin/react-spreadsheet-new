#!/usr/bin/env node

/**
 * dty-lucky-sheet 错误监控脚本
 * 持续监控组件错误并提供实时修复建议
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('👁️ 启动 dty-lucky-sheet 错误监控...\n');

// 错误模式匹配
const errorPatterns = {
  useOutsideClick: {
    pattern: /Argument of type 'RefObject<HTMLDivElement \| null>' is not assignable to parameter of type 'RefObject<HTMLElement>'/,
    fix: 'useOutsideClick 类型错误',
    solution: '使用类型断言: containerRef as React.RefObject<HTMLElement>'
  },
  useRef: {
    pattern: /Expected 1 arguments, but got 0/,
    fix: 'useRef 初始化错误',
    solution: '使用: useRef<T | undefined>(undefined)'
  },
  ssf: {
    pattern: /Property 'format' does not exist on type '\{\}'/,
    fix: 'SSF 模块类型错误',
    solution: '创建类型声明文件 src/typings/ssf.d.ts'
  },
  regeneratorRuntime: {
    pattern: /Could not find a declaration file for module 'regenerator-runtime'/,
    fix: 'regenerator-runtime 类型错误',
    solution: '创建类型声明文件 src/typings/regenerator-runtime.d.ts'
  },
  formulaParser: {
    pattern: /Type '.*' is not assignable to type 'any\[\]\[\]'/,
    fix: '公式解析器类型错误',
    solution: '修复 onRange 返回值类型'
  }
};

function checkErrors() {
  try {
    console.log('🔍 检查 TypeScript 错误...');
    const result = execSync('npx tsc --noEmit --project tsconfig.json 2>&1', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    console.log('✅ 没有发现错误');
    return [];
  } catch (error) {
    const output = error.stdout || error.stderr || error.message;
    return analyzeErrors(output);
  }
}

function analyzeErrors(output) {
  const errors = [];
  const lines = output.split('\n');
  
  lines.forEach(line => {
    if (line.includes('error TS') && line.includes('src/dty-lucky-sheet')) {
      Object.entries(errorPatterns).forEach(([type, config]) => {
        if (config.pattern.test(line)) {
          errors.push({
            type,
            line,
            fix: config.fix,
            solution: config.solution
          });
        }
      });
    }
  });
  
  return errors;
}

function generateFixCommand(errors) {
  if (errors.length === 0) return null;
  
  const uniqueTypes = [...new Set(errors.map(e => e.type))];
  
  console.log('\n📋 发现错误类型:');
  uniqueTypes.forEach(type => {
    const count = errors.filter(e => e.type === type).length;
    console.log(`  - ${type}: ${count} 个错误`);
  });
  
  console.log('\n🔧 建议的修复命令:');
  console.log('  node scripts/fix-all-dty-lucky-sheet-errors.js');
  
  return uniqueTypes;
}

function main() {
  const errors = checkErrors();
  
  if (errors.length > 0) {
    console.log(`\n❌ 发现 ${errors.length} 个错误:`);
    errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error.fix}`);
      console.log(`     解决方案: ${error.solution}`);
    });
    
    generateFixCommand(errors);
  } else {
    console.log('\n🎉 恭喜！dty-lucky-sheet 组件没有 TypeScript 错误！');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { checkErrors, analyzeErrors, generateFixCommand };
