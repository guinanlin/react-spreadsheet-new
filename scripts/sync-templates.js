#!/usr/bin/env node

/**
 * 同步脚本：从 src/ 复制组件到 packages/components/
 * 用于准备 CLI 工具要分发的模板文件
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// 辅助函数：递归创建目录
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// 辅助函数：检查路径是否存在
async function pathExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

// 辅助函数：清空目录
async function emptyDir(dir) {
  if (await pathExists(dir)) {
    const files = await fs.readdir(dir);
    await Promise.all(
      files.map(file => 
        fs.rm(path.join(dir, file), { recursive: true, force: true })
      )
    );
  } else {
    await ensureDir(dir);
  }
}

// 辅助函数：复制文件
async function copy(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

// 辅助函数：写入 JSON
async function writeJson(filePath, data, options = {}) {
  const spaces = options.spaces || 2;
  const content = JSON.stringify(data, null, spaces);
  await fs.writeFile(filePath, content, 'utf-8');
}

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const TEMPLATES_DIR = path.join(ROOT, 'packages', 'components');

// 定义要同步的组件及其文件
const COMPONENTS = {
  spreadsheet: {
    name: 'spreadsheet',
    description: 'Basic spreadsheet component with cell editing',
    basePath: 'spreadsheet',
    files: [
      'index.ts',
      'types.ts',
      'components/Spreadsheet.tsx',
      'components/Spreadsheet.css',
      'components/index.ts',
    ],
    subdirs: {
      'components/cells': ['ActiveCell.tsx', 'Cell.tsx', 'DataEditor.tsx', 'DataViewer.tsx', 'index.ts'],
      'components/layout': ['HeaderRow.tsx', 'Row.tsx', 'Table.tsx', 'index.ts'],
      'components/overlays': ['Copied.tsx', 'FloatingRect.tsx', 'Selected.tsx', 'index.ts'],
      'components/indicators': ['ColumnIndicator.tsx', 'RowIndicator.tsx', 'CornerIndicator.tsx', 'index.ts'],
      'core': ['actions.ts', 'areModelsEqual.ts', 'context.ts', 'reducer.ts', 'util.ts'],
      'data-structures': ['matrix.ts', 'point.ts', 'point-range.ts', 'selection.ts', 'index.ts'],
      'engine': ['engine.ts', 'formula.ts', 'point-graph.ts', 'point-hash.ts', 'point-set.ts', 'index.ts'],
      'hooks': ['use-dispatch.ts', 'use-selector.ts', 'index.ts'],
    },
    dependencies: [
      'classnames',
      'fast-formula-parser',
      'use-context-selector',
      'react-dnd',
      'react-dnd-html5-backend',
    ],
  },
  'pivot-table': {
    name: 'pivot-table',
    description: 'Advanced pivot table with server-side aggregation',
    basePath: 'pivot',
    files: [
      'PivotTable.tsx',
      'PivotTable.css',
      'PivotCell.tsx',
      'PivotCell.css',
      'PivotHeaders.tsx',
      'PivotHeaders.css',
      'PivotFieldSelector.tsx',
      'PivotFieldSelector.css',
      'OptimizedPivotEngine.tsx',
      'PerformanceMonitor.tsx',
      'PerformanceMonitor.css',
      'ExportManager.tsx',
      'ExportUI.tsx',
      'ExportUI.css',
      'DrillDownManager.tsx',
      'DrillDownManager.css',
      'types.ts',
      'aggregations.ts',
      'engine.ts',
      'hooks.ts',
    ],
    subdirs: {
      'api': ['ApiClient.ts', 'api-client.ts'],
      'data': ['DataBinding.ts', 'ServerDataService.ts'],
    },
    dependencies: [
      '@tanstack/react-query',
      'classnames',
      'jspdf',
      'xlsx',
      'file-saver',
    ],
  },
  'formula-engine': {
    name: 'formula-engine',
    description: 'Formula parser and calculation engine',
    basePath: 'spreadsheet/engine',
    files: [
      'engine.ts',
      'formula.ts',
      'point-graph.ts',
      'point-set.ts',
      'point-hash.ts',
      'index.ts',
    ],
    dependencies: [
      'fast-formula-parser',
    ],
  },
};

async function syncTemplates() {
  console.log('🔄 开始同步组件模板...\n');

  // 清空并重建 components 目录
  await emptyDir(TEMPLATES_DIR);

  const registry = {
    $schema: 'https://react-spreadsheet.dev/registry.json',
    components: {},
  };

  // 处理每个组件
  for (const [key, config] of Object.entries(COMPONENTS)) {
    console.log(`📦 处理组件: ${config.name}`);
    
    const componentDir = path.join(TEMPLATES_DIR, config.name);
    await ensureDir(componentDir);

    const basePath = config.basePath || '';
    const sourceBase = path.join(SRC_DIR, basePath);

    let copiedFiles = [];

    // 复制主文件
    for (const file of config.files) {
      const sourcePath = path.join(sourceBase, file);
      const targetPath = path.join(componentDir, file);

      if (await pathExists(sourcePath)) {
        await copy(sourcePath, targetPath);
        copiedFiles.push(file);
        console.log(`  ✓ ${file}`);
      } else {
        console.log(`  ⚠️  找不到: ${file}`);
      }
    }

    // 复制子目录
    if (config.subdirs) {
      for (const [subdir, files] of Object.entries(config.subdirs)) {
        const subdirPath = path.join(componentDir, subdir);
        await ensureDir(subdirPath);

        for (const file of files) {
          const sourcePath = path.join(sourceBase, subdir, file);
          const targetPath = path.join(subdirPath, file);

          if (await pathExists(sourcePath)) {
            await copy(sourcePath, targetPath);
            copiedFiles.push(`${subdir}/${file}`);
            console.log(`  ✓ ${subdir}/${file}`);
          }
        }
      }
    }

    // 添加到注册表
    registry.components[config.name] = {
      name: config.name,
      description: config.description,
      type: 'components:ui',
      files: copiedFiles,
      dependencies: config.dependencies || [],
    };

    console.log(`  📝 已复制 ${copiedFiles.length} 个文件\n`);
  }

  // 写入 registry.json
  const registryPath = path.join(TEMPLATES_DIR, 'registry.json');
  await writeJson(registryPath, registry, { spaces: 2 });
  console.log('✅ registry.json 已生成\n');

  // 生成 README
  const readmePath = path.join(TEMPLATES_DIR, 'README.md');
  const readme = `# React Spreadsheet Components

这个目录包含了所有可通过 CLI 安装的组件模板。

## 可用组件

${Object.values(registry.components)
  .map(
    (c) => `
### ${c.name}

${c.description}

\`\`\`bash
npx @react-spreadsheet/cli add ${c.name}
\`\`\`

**文件数量:** ${c.files.length}  
**依赖:** ${c.dependencies.join(', ') || '无'}
`
  )
  .join('\n')}

## 开发说明

⚠️ **不要直接修改这个目录的文件！**

这些文件是从 \`src/\` 目录自动同步的。要修改组件：

1. 编辑 \`src/\` 中的源文件
2. 运行 \`npm run sync-templates\` 同步到这里
3. 提交更改

## 同步流程

\`\`\`bash
# 修改 src/ 中的组件
vim src/Spreadsheet.tsx

# 同步到 components
npm run sync-templates

# 提交
git add .
git commit -m "Update component templates"
\`\`\`
`;

  await fs.writeFile(readmePath, readme, 'utf-8');
  console.log('✅ README.md 已生成\n');

  console.log('🎉 同步完成！');
  console.log(`\n📊 统计：`);
  console.log(`  - 组件数量: ${Object.keys(registry.components).length}`);
  console.log(`  - 总文件数: ${Object.values(registry.components).reduce((sum, c) => sum + c.files.length, 0)}`);
}

// 运行
syncTemplates().catch((error) => {
  console.error('❌ 同步失败:', error);
  process.exit(1);
});

