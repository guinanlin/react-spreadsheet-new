# React Spreadsheet Components

这个目录包含了所有可通过 CLI 安装的组件模板。

## 可用组件


### spreadsheet

Basic spreadsheet component with cell editing

```bash
npx @react-spreadsheet/cli add spreadsheet
```

**文件数量:** 27  
**依赖:** classnames, fast-formula-parser, use-context-selector, react-dnd, react-dnd-html5-backend


### pivot-table

Advanced pivot table with server-side aggregation

```bash
npx @react-spreadsheet/cli add pivot-table
```

**文件数量:** 23  
**依赖:** @tanstack/react-query, classnames, jspdf, xlsx, file-saver


### formula-engine

Formula parser and calculation engine

```bash
npx @react-spreadsheet/cli add formula-engine
```

**文件数量:** 6  
**依赖:** fast-formula-parser


## 开发说明

⚠️ **不要直接修改这个目录的文件！**

这些文件是从 `src/` 目录自动同步的。要修改组件：

1. 编辑 `src/` 中的源文件
2. 运行 `npm run sync-templates` 同步到这里
3. 提交更改

## 同步流程

```bash
# 修改 src/ 中的组件
vim src/Spreadsheet.tsx

# 同步到 components
npm run sync-templates

# 提交
git add .
git commit -m "Update component templates"
```
