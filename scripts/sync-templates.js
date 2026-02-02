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

// 辅助函数：递归删除目录（带重试机制）
async function removeDir(dir) {
  if (!(await pathExists(dir))) {
    return;
  }

  let retries = 3;
  while (retries > 0) {
    try {
      await fs.rm(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
      return;
    } catch (err) {
      retries--;
      if (retries === 0) {
        throw err;
      }
      // 等待一下再重试（Windows 文件锁定问题）
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

// 辅助函数：清空目录
async function emptyDir(dir) {
  // 完全删除目录后重新创建，这样更可靠
  await removeDir(dir);
  await ensureDir(dir);
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
      'components/Workbook.tsx',
      'components/Workbook.css',
      'components/index.ts',
    ],
    subdirs: {
      'components/cells': ['ActiveCell.tsx', 'Cell.tsx', 'DataEditor.tsx', 'DataViewer.tsx', 'index.ts'],
      'components/layout': ['HeaderRow.tsx', 'Row.tsx', 'Table.tsx', 'index.ts'],
      'components/overlays': ['Copied.tsx', 'FloatingRect.tsx', 'Selected.tsx', 'FillHandle.tsx', 'FillPreview.tsx', 'index.ts'],
      'components/indicators': ['ColumnIndicator.tsx', 'RowIndicator.tsx', 'CornerIndicator.tsx', 'index.ts'],
      'components/tabs': ['SheetTabs.tsx', 'SheetTabs.css'],
      'core': ['actions.ts', 'areModelsEqual.ts', 'context.ts', 'reducer.ts', 'util.ts', 'fill-handler.ts', 'export.ts', 'export-capability.ts'],
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
  'dty-lucky-sheet': {
    name: 'dty-lucky-sheet',
    description: 'Full-featured spreadsheet component based on FortuneSheet with rich editing capabilities',
    basePath: 'dty-lucky-sheet',
    files: [
      'index.ts',
    ],
    subdirs: {
      'components': [
        'DtyLuckySheet.tsx',
        'SVGDefines.tsx',
        'SVGIcon.tsx',
      ],
      'components/Workbook': [
        'index.tsx',
        'index.css',
        'api.ts',
      ],
      'components/Sheet': [
        'index.tsx',
        'index.css',
      ],
      'components/Toolbar': [
        'index.tsx',
        'index.css',
        'Button.tsx',
        'ColorPicker.tsx',
        'Combo.tsx',
        'CustomBorder.tsx',
        'CustomButton.tsx',
        'CustomColor.tsx',
        'CustomIcon.tsx',
        'Divider.tsx',
        'MoreItemsContainer.tsx',
        'Select.tsx',
      ],
      'components/FxEditor': [
        'index.tsx',
        'index.css',
        'NameBox.tsx',
      ],
      'components/SheetTab': [
        'index.tsx',
        'index.css',
        'SheetItem.tsx',
      ],
      'components/SheetList': [
        'index.tsx',
        'index.css',
        'SheetHiddenButton.tsx',
        'SheetListItem.tsx',
      ],
      'components/ContextMenu': [
        'index.tsx',
        'index.css',
        'Menu.tsx',
        'Divider.tsx',
        'FilterMenu.tsx',
        'SheetTab.tsx',
      ],
      'components/SheetOverlay': [
        'index.tsx',
        'index.css',
        'ColumnHeader.tsx',
        'RowHeader.tsx',
        'InputBox.tsx',
        'ContentEditable.tsx',
      ],
      'components/SheetOverlay/ScrollBar': [
        'index.tsx',
        'index.css',
      ],
      'components/SheetOverlay/FormulaHint': [
        'index.tsx',
        'index.css',
      ],
      'components/SheetOverlay/FormulaSearch': [
        'index.tsx',
        'index.css',
      ],
      'components/Dialog': [
        'index.tsx',
        'index.css',
      ],
      'components/MessageBox': [
        'index.tsx',
      ],
      'components/ChangeColor': [
        'index.tsx',
        'index.css',
      ],
      'components/ConditionFormat': [
        'index.tsx',
        'index.css',
        'ConditionRules.tsx',
      ],
      'components/CustomSort': [
        'index.tsx',
        'index.css',
      ],
      'components/DataVerification': [
        'index.tsx',
        'index.css',
        'DropdownList.tsx',
        'RangeDialog.tsx',
      ],
      'components/FilterOption': [
        'index.tsx',
      ],
      'components/FormatSearch': [
        'index.tsx',
        'index.css',
      ],
      'components/FormulaSearch': [
        'index.tsx',
        'index.css',
      ],
      'components/ImgBoxs': [
        'index.tsx',
      ],
      'components/LinkEidtCard': [
        'index.tsx',
        'index.css',
      ],
      'components/LocationCondition': [
        'index.tsx',
        'index.css',
      ],
      'components/NotationBoxes': [
        'index.tsx',
      ],
      'components/SearchReplace': [
        'index.tsx',
        'index.css',
      ],
      'components/SplitColumn': [
        'index.tsx',
        'index.css',
      ],
      'components/ZoomControl': [
        'index.tsx',
        'index.css',
      ],
      'core': [
        'index.ts',
        'types.ts',
        'context.ts',
        'settings.ts',
        'canvas.ts',
      ],
      'core/api': [
        'index.ts',
        'cell.ts',
        'common.ts',
        'errors.ts',
        'merge.ts',
        'range.ts',
        'rowcol.ts',
        'sheet.ts',
        'workbook.ts',
      ],
      'core/events': [
        'index.ts',
        'copy.ts',
        'keyboard.ts',
        'mouse.ts',
        'paste.ts',
      ],
      'core/locale': [
        'index.ts',
        'en.ts',
        'es.ts',
        'hi.ts',
        'zh.ts',
        'zh_tw.ts',
      ],
      'core/modules': [
        'index.ts',
        'border.ts',
        'cell.ts',
        'clipboard.ts',
        'color.ts',
        'comment.ts',
        'conditionalFormat.ts',
        'ConditionFormat.ts',
        'cursor.ts',
        'dataVerification.ts',
        'dropCell.ts',
        'filter.ts',
        'format.ts',
        'formula.ts',
        'formulaHelper.ts',
        'freeze.ts',
        'hyperlink.ts',
        'image.ts',
        'inline-string.ts',
        'location.ts',
        'locationCondition.ts',
        'merge.ts',
        'mobile.ts',
        'moveCells.ts',
        'protection.ts',
        'refresh.ts',
        'rowcol.ts',
        'screenshot.ts',
        'searchReplace.ts',
        'selection.ts',
        'sheet.ts',
        'sort.ts',
        'splitColumn.ts',
        'ssf.js',
        'text.ts',
        'toolbar.ts',
        'validation.ts',
        'zoom.ts',
      ],
      'core/plugin': [
        'index.ts',
        'types.ts',
        'FormulaPluginRegistry.ts',
        'definePlugin.ts',
      ],
      'typings': [
        'ssf.d.ts',
        'fast-formula-parser.d.ts',
        'regenerator-runtime.d.ts',
      ],
      'core/utils': [
        'index.ts',
        'patch.ts',
      ],
      'context': [
        'index.ts',
        'modal.tsx',
      ],
      'hooks': [
        'useAlert.tsx',
        'useDialog.tsx',
        'useOutsideClick.ts',
        'usePrevious.tsx',
      ],
      'formula-parser': [
        'index.js',
        'index.ts',
        'parser.js',
        'error.js',
        'supported-formulas.js',
      ],
      'formula-parser/grammar-parser': [
        'grammar-parser.js',
        'grammar-parser.jison',
      ],
      'formula-parser/helper': [
        'cell.js',
        'number.js',
        'string.js',
      ],
      'formula-parser/evaluate-by-operator': [
        'evaluate-by-operator.js',
      ],
      'formula-parser/evaluate-by-operator/operator': [
        'add.js',
        'ampersand.js',
        'divide.js',
        'equal.js',
        'formula-function.js',
        'greater-than-or-equal.js',
        'greater-than.js',
        'less-than-or-equal.js',
        'less-than.js',
        'minus.js',
        'multiply.js',
        'not-equal.js',
        'power.js',
      ],
    },
    dependencies: [
      'immer',
      'lodash',
      'classnames',
    ],
  },
  'dty-mindmap': {
    name: 'dty-mindmap',
    description: '思维导图组件，支持节点编辑、拖拽、缩放与主题切换',
    basePath: 'dty-mindmap',
    files: [
      'index.ts',
      'constants.ts',
      'data-helpers.ts',
      'DtyMindMap.tsx',
      'mind-map-store.ts',
      'types.ts',
      'use-mind-map.ts',
    ],
    subdirs: {
      'components': [
        'canvas-controls.tsx',
        'instructions.tsx',
        'mind-map-edge.tsx',
        'mind-map-node.tsx',
        'toolbar.tsx',
      ],
      'hooks': ['use-behavior-subject-value.ts'],
      'utils': ['layout.ts'],
    },
    dependencies: ['lucide-react', 'rxjs'],
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

