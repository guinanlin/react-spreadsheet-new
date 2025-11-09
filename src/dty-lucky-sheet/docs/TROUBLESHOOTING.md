# DtyLuckySheet 故障排除指南

## 🐛 常见问题和解决方案

### 问题 1：Storybook 无法解析 immer 依赖

**症状**：
```
Failed to resolve import "immer" from "src\dty-lucky-sheet\packages\react\src\components\Workbook\index.tsx"
```

**原因**：Vite 无法解析内部包引用。

**解决方案**：
1. 使用相对路径导入而不是包名导入
2. 配置 Vite 别名（已在 `.storybook/main.ts` 中完成）
3. 重启 Storybook

### 问题 2：动态导入模块失败

**症状**：
```
Failed to fetch dynamically imported module: http://localhost:6006/src/dty-lucky-sheet/stories/Features.stories.tsx
TypeError: Failed to fetch dynamically imported module
```

**原因**：
- Vite 没有正确优化依赖
- 缺少路径别名配置
- 需要重启开发服务器

**解决方案**：

#### 步骤 1：确认配置文件

确保 `.storybook/main.ts` 包含以下配置：

```typescript
async viteFinal(config) {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src'),
        '@dty-lucky-sheet/core': path.resolve(__dirname, '../src/dty-lucky-sheet/packages/core/src'),
        '@dty-lucky-sheet/react': path.resolve(__dirname, '../src/dty-lucky-sheet/packages/react/src'),
        '@dty-lucky-sheet/formula': path.resolve(__dirname, '../src/dty-lucky-sheet/packages/formula/src'),
      },
    },
    optimizeDeps: {
      include: ['immer', 'lodash'],
    },
  });
},
```

#### 步骤 2：清除缓存并重启

```bash
# 1. 停止当前运行的 Storybook (Ctrl+C)

# 2. 清除 node_modules 缓存
rm -rf node_modules/.vite

# 3. 重新启动 Storybook
pnpm run dev
```

#### 步骤 3：验证依赖

确保 `immer` 和 `lodash` 已安装：

```bash
npm list immer lodash
```

如果未安装，运行：

```bash
npm install immer lodash
```

### 问题 3：TypeScript 类型错误

**症状**：
```
Cannot find module '@dty-lucky-sheet/core' or its corresponding type declarations
```

**解决方案**：
使用相对路径导入：

```typescript
// ❌ 错误
import { Context } from "@dty-lucky-sheet/core";

// ✅ 正确
import { Context } from "../../../core/src";
```

### 问题 4：Canvas 不显示

**症状**：打开 Storybook 后看不到表格，只有空白。

**原因**：
- 容器没有明确高度
- Canvas 初始化失败
- devicePixelRatio 问题

**解决方案**：

#### 检查容器高度

```tsx
// ✅ 正确：明确高度
<div style={{ width: "100%", height: "100vh" }}>
  <Workbook data={data} />
</div>

// ❌ 错误：没有高度
<div style={{ width: "100%" }}>
  <Workbook data={data} />
</div>
```

#### 检查 Canvas ref

确保 Canvas ref 正确传递：

```typescript
const canvas = useRef<HTMLCanvasElement>(null);
// ...
<canvas ref={refs.canvas} />
```

### 问题 5：数据不显示

**症状**：表格渲染了但看不到数据。

**原因**：
- 数据格式不正确
- celldata 未转换为 data 矩阵
- 渲染逻辑问题

**解决方案**：

#### 检查数据格式

```typescript
// ✅ 正确格式
const data = [
  {
    name: "Sheet1",
    id: "1",
    celldata: [
      { r: 0, c: 0, v: { v: "Hello", m: "Hello" } },
      { r: 0, c: 1, v: { v: "World", m: "World" } },
    ],
  },
];

// ❌ 错误：缺少必要字段
const data = [
  {
    cells: [["Hello", "World"]], // 错误的结构
  },
];
```

#### 检查 Sheet 组件

在 Sheet 组件中添加调试日志：

```typescript
useEffect(() => {
  console.log('Sheet data:', sheet.data);
  console.log('Canvas ref:', refs.canvas.current);
}, [sheet, refs.canvas]);
```

### 问题 6：Storybook 版本不兼容警告

**症状**：
```
WARN The following packages are incompatible with Storybook 8.6.11
WARN - @storybook/react@8.6.14
```

**解决方案**：
这是一个次要版本不匹配警告，可以忽略。如果要消除警告：

```bash
npm install @storybook/react@8.6.11 @storybook/react-vite@8.6.11
```

### 问题 7：HMR（热更新）不工作

**症状**：修改代码后 Storybook 不自动更新。

**解决方案**：

1. **检查文件路径**：确保文件在 `src/` 目录下
2. **重启 Storybook**：有时需要完全重启
3. **清除缓存**：
   ```bash
   rm -rf node_modules/.vite
   pnpm run dev
   ```

### 问题 8：性能问题（渲染慢）

**症状**：表格渲染很慢或卡顿。

**原因**（当前阶段）：
- 简单的 Canvas 渲染实现
- 未优化的绘制循环
- 大量数据导致重渲染

**临时解决方案**：
- 减少数据量（当前只是演示）
- 等待阶段 2 的完整渲染引擎实现

**未来优化**（阶段 2+）：
- 虚拟滚动
- 按需渲染
- Canvas 层级优化

## 🔍 调试技巧

### 1. 启用调试日志

在 Workbook 中启用 patch 日志：

```typescript
setContextWithProduce(
  (ctx) => {
    // 修改状态
  },
  { logPatch: true }
);
```

### 2. 检查 Context 状态

在浏览器控制台中：

```javascript
// 在 Workbook 组件中暴露 context
window.__DTY_CONTEXT__ = context;

// 然后在控制台查看
console.log(window.__DTY_CONTEXT__);
```

### 3. 使用 React DevTools

安装 React DevTools 扩展，查看：
- 组件树
- Props 传递
- State 变化

### 4. 检查 Canvas 绘制

在 Sheet 组件的 useEffect 中添加：

```typescript
useEffect(() => {
  const ctx = canvas.getContext("2d");
  console.log('Canvas context:', ctx);
  console.log('Canvas size:', canvas.width, canvas.height);
}, []);
```

## 📋 检查清单

遇到问题时，按顺序检查：

- [ ] Storybook 是否正常启动？
- [ ] 是否有 TypeScript 错误？
- [ ] 是否有 linting 错误？（运行 `npm run lint`）
- [ ] 依赖是否已安装？（`npm install`）
- [ ] 是否重启了 Storybook？
- [ ] 浏览器控制台是否有错误？
- [ ] 数据格式是否正确？
- [ ] 容器是否有明确高度？

## 🆘 获取帮助

如果以上方法都无法解决问题：

1. **查看文档**
   - [README.md](./README.md)
   - [QUICK_START.md](./QUICK_START.md)
   - [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

2. **查看示例**
   - 打开 `stories/` 目录查看工作示例
   - 对比你的代码和示例代码

3. **查看 FortuneSheet**
   - 参考原项目：https://github.com/ruilisi/fortune-sheet
   - 查看他们的实现方式

4. **检查日志**
   - 浏览器控制台
   - Storybook 终端输出
   - Network 标签（查看加载失败的资源）

## 🔧 完全重置

如果一切都不工作，尝试完全重置：

```bash
# 1. 停止 Storybook
# Ctrl+C

# 2. 删除缓存和依赖
rm -rf node_modules
rm -rf node_modules/.vite
rm -rf .storybook/.cache

# 3. 重新安装
npm install

# 4. 重新启动
pnpm run dev
```

## 📝 报告问题

如果发现 bug，记录以下信息：

- **环境**：操作系统、Node 版本、npm/pnpm 版本
- **错误信息**：完整的错误堆栈
- **重现步骤**：如何触发问题
- **预期行为**：应该发生什么
- **实际行为**：实际发生了什么
- **截图**：如果可能的话

---

**最后更新**：2024-10-14  
**维护者**：DtyLuckySheet Team

