# 🚀 快速上手指南

## 对于用户：如何使用组件

### 第一步：初始化

在你的 React 项目中运行：

```bash
npx @goodhawk/react-spreadsheet-cli init
```

会询问你：
- 组件安装路径（默认：`src/components/ui`）
- 导入别名（默认：`@/components`）

### 第二步：添加组件

#### 添加基础表格组件

```bash
npx @goodhawk/react-spreadsheet-cli add spreadsheet
```

生成的文件：
```
your-project/
└── src/
    └── components/
        └── ui/
            └── spreadsheet/
                ├── Spreadsheet.tsx      ← 主组件
                ├── Spreadsheet.css
                ├── Cell.tsx
                ├── Table.tsx
                └── ... (共27个文件)
```

#### 添加透视表组件

```bash
npx @goodhawk/react-spreadsheet-cli add pivot-table
```

#### 添加公式引擎

```bash
npx @goodhawk/react-spreadsheet-cli add formula-engine
```

### 第三步：使用组件

在你的代码中：

```tsx
import { Spreadsheet } from '@/components/ui/spreadsheet';

function MyApp() {
  const [data, setData] = useState([
    [{ value: 'A1' }, { value: 'B1' }],
    [{ value: 'A2' }, { value: 'B2' }],
  ]);

  return (
    <div>
      <h1>My Spreadsheet</h1>
      <Spreadsheet 
        data={data} 
        onChange={setData} 
      />
    </div>
  );
}
```

### 第四步：自由定制！

现在组件代码在你的项目中，你可以：

✅ 直接修改源码
✅ 调整样式
✅ 添加新功能
✅ 优化性能

**示例：修改单元格样式**

打开 `src/components/ui/spreadsheet/Cell.tsx`：

```tsx
// 你可以直接修改这个文件！
export function Cell({ cell, ...props }) {
  return (
    <td 
      className="my-custom-cell"  // ← 改成你的样式
      style={{ 
        backgroundColor: '#f0f0f0',  // ← 添加背景色
        // ... 任何你想要的样式
      }}
    >
      {/* ... */}
    </td>
  );
}
```

---

## 对于开发者：如何维护组件

### 日常开发（和以前一样）

```bash
# 1. 安装依赖
pnpm install

# 2. 启动 Storybook
pnpm dev

# 3. 在 src/ 开发
vim src/Spreadsheet.tsx

# 4. 实时预览（Storybook 自动刷新）

# 5. 运行测试
pnpm test
```

### 准备发布

```bash
# 1. 同步组件到 packages/components/
npm run sync-templates

# 输出：
# 🔄 开始同步组件模板...
# 📦 处理组件: spreadsheet
#   ✓ Spreadsheet.tsx
#   ✓ Cell.tsx
#   ...
# ✅ 同步完成！

# 2. 提交
git add packages/
git commit -m "chore: sync component templates"

# 3. 发布 CLI（可选）
cd packages/cli
npm run build
npm publish --access public
```

### 完整流程示例

假设你要添加一个新功能：

```bash
# 1. 在 Storybook 中开发
pnpm dev
# 浏览器访问 http://localhost:6006

# 2. 编辑组件
vim src/Spreadsheet.tsx
# 添加新功能...

# 3. 添加 Story（可选）
vim src/stories/Spreadsheet.stories.tsx
export const MyNewFeature: StoryObj = {
  args: { /* ... */ }
};

# 4. 测试
pnpm test

# 5. 同步到 packages
npm run sync-templates

# 6. 提交
git add .
git commit -m "feat: add awesome feature"
git push

# 7. 发布（可选）
cd packages/cli
npm version minor
npm publish
```

---

## 🎯 常见问题

### Q: 为什么不直接用 npm install？

A: 你可以！这个项目支持两种方式：

**方式 1：传统 npm（简单，但不能修改）**
```bash
npm install react-spreadsheet
import { Spreadsheet } from 'react-spreadsheet';
```

**方式 2：CLI（可以修改源码）**
```bash
npx @goodhawk/react-spreadsheet-cli add spreadsheet
import { Spreadsheet } from '@/components/ui/spreadsheet';
```

### Q: CLI 方式的优势是什么？

A: 
- ✅ 代码在你的项目中，完全可控
- ✅ 可以随意修改源码
- ✅ 不用等待作者发布更新
- ✅ TypeScript 类型完整
- ✅ 更容易调试

### Q: 如何更新组件？

```bash
npx @goodhawk/react-spreadsheet-cli add spreadsheet --overwrite
```

### Q: 可以修改组件代码吗？

**可以！这正是这种方式的核心理念。**

组件代码在你的 `src/components/ui/` 目录，你拥有完全的控制权。

### Q: packages/components/ 是什么？

这是组件的"模板仓库"，CLI 从这里复制文件到用户项目。

**不要直接修改这个目录！** 它是从 `src/` 自动生成的。

### Q: 如何添加新组件？

编辑 `scripts/sync-templates.js`，添加新组件配置：

```javascript
const COMPONENTS = {
  // ... 现有组件
  'my-component': {
    name: 'my-component',
    description: '我的新组件',
    files: ['MyComponent.tsx', 'types.ts'],
    dependencies: ['some-package'],
  },
};
```

然后运行：
```bash
npm run sync-templates
```

---

## 📚 更多资源

- [完整开发文档](../DEVELOPMENT_WORKFLOW.md)
- [CLI 工具文档](./cli/README.md)
- [组件 API 文档](https://iddan.github.io/react-spreadsheet/docs)
- [在线演示](https://iddan.github.io/react-spreadsheet)

---

## 💡 提示

- 第一次使用？推荐先阅读 [packages/README.md](./README.md)
- 想深入了解？查看 [DEVELOPMENT_WORKFLOW.md](../DEVELOPMENT_WORKFLOW.md)
- 遇到问题？提交 [Issue](https://github.com/iddan/react-spreadsheet/issues)

祝你使用愉快！🎉

