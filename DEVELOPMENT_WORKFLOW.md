# 开发工作流程 (Development Workflow)

本项目采用**混合模式**：既支持传统的 npm 包发布，也支持 shadcn/ui 风格的组件复制。

## 📂 目录结构说明

```
react-spreadsheet/
├── src/                        # 🔧 开发目录（主要工作在这里）
│   ├── Spreadsheet.tsx        # 在这里开发组件
│   ├── Cell.tsx
│   ├── stories/               # Storybook stories
│   │   └── Spreadsheet.stories.tsx
│   ├── pivot/                 # 透视表组件
│   └── engine/                # 公式引擎
│
├── packages/                   # 📦 发布目录（自动生成）
│   ├── cli/                   # CLI 工具源码
│   │   └── src/
│   │       └── commands/
│   └── templates/             # ⚠️ 自动生成，不要手动编辑！
│       ├── spreadsheet/       # 从 src/ 同步而来
│       ├── pivot-table/
│       └── registry.json
│
├── scripts/
│   └── sync-templates.js      # 同步脚本
│
└── dist/                      # 传统 npm 包构建输出
```

## 🔄 完整的开发流程

### 1️⃣ 日常开发（和以前一样！）

```bash
# 安装依赖
pnpm install

# 启动 Storybook 开发服务器
pnpm dev
# 访问 http://localhost:6006

# 编辑组件
vim src/Spreadsheet.tsx
vim src/Cell.tsx

# 实时预览
# Storybook 会自动热重载
```

**关键点：**
- ✅ 所有开发都在 `src/` 目录进行
- ✅ 使用 Storybook 进行组件预览和调试
- ✅ 完全不用管 `packages/templates/` 目录

### 2️⃣ 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率
pnpm test:coverage

# 运行特定测试
pnpm test Spreadsheet.test.tsx
```

### 3️⃣ 代码检查

```bash
# 类型检查
pnpm check-typing

# 代码规范检查
pnpm lint

# 代码格式化
pnpm format
```

### 4️⃣ 准备发布（关键步骤！）

当你完成开发，准备发布时：

```bash
# Step 1: 同步组件到 templates 目录
pnpm run sync-templates

# 这个命令会：
# ✓ 清空 packages/templates/
# ✓ 从 src/ 复制所有组件文件到 packages/templates/
# ✓ 生成 registry.json
# ✓ 生成 README.md

# Step 2: 检查同步结果
ls -la packages/templates/
cat packages/templates/registry.json

# Step 3: 提交更改
git add .
git commit -m "chore: sync component templates"
```

### 5️⃣ 发布（两种方式）

#### 方式 A: 发布传统 npm 包（兼容旧用户）

```bash
# 构建
pnpm build

# 发布到 npm
npm version patch  # 或 minor, major
npm publish
```

用户使用：
```bash
npm install react-spreadsheet
```

#### 方式 B: 发布 CLI 工具（新方式）

```bash
# 进入 CLI 目录
cd packages/cli

# 发布 CLI
npm version patch
npm publish --access public

# 返回根目录
cd ../..

# 确保 templates 已提交到 GitHub
git push origin main
```

用户使用：
```bash
npx @react-spreadsheet/cli add spreadsheet
```

## 🎯 具体开发场景

### 场景 1: 添加新功能到 Spreadsheet

```bash
# 1. 在 Storybook 中开发
pnpm dev

# 2. 编辑组件
vim src/Spreadsheet.tsx

# 3. 添加测试
vim src/Spreadsheet.test.tsx

# 4. 运行测试
pnpm test

# 5. 同步到 templates
pnpm run sync-templates

# 6. 提交
git add .
git commit -m "feat: add new feature to Spreadsheet"
```

### 场景 2: 修复 Bug

```bash
# 1. 在 src/ 修复 bug
vim src/Cell.tsx

# 2. 验证修复
pnpm dev
pnpm test

# 3. 同步到 templates
pnpm run sync-templates

# 4. 提交
git commit -am "fix: resolve cell rendering issue"
```

### 场景 3: 添加新的 Story

```bash
# 1. 创建新的 story
vim src/stories/Spreadsheet.stories.tsx

# 添加：
export const MyNewFeature: StoryObj = {
  args: {
    // ...
  },
};

# 2. 在 Storybook 查看
pnpm dev
# 访问 http://localhost:6006/?path=/story/spreadsheet--my-new-feature

# 3. Stories 不需要同步到 templates
# 直接提交即可
git commit -am "docs: add new feature story"
```

### 场景 4: 修改样式

```bash
# 1. 编辑 CSS
vim src/Spreadsheet.css

# 2. 在 Storybook 实时预览
# (已经在运行 pnpm dev)

# 3. 同步到 templates
pnpm run sync-templates

# 4. 提交
git commit -am "style: update cell borders"
```

## 🔍 调试技巧

### 在 Storybook 中调试

```tsx
// src/stories/Spreadsheet.stories.tsx
export const Debug: StoryObj = {
  args: {
    data: [
      [{ value: 'Test' }],
    ],
  },
  play: async ({ canvasElement }) => {
    // 使用 Storybook 的 play 函数进行交互测试
    const canvas = within(canvasElement);
    const cell = canvas.getByText('Test');
    await userEvent.click(cell);
  },
};
```

### 使用 React DevTools

```bash
pnpm dev
# 在浏览器中打开 React DevTools
# 可以查看组件树、props、state 等
```

### 添加调试日志

```tsx
// src/Spreadsheet.tsx
console.log('[Spreadsheet] Rendering with data:', data);
console.log('[Spreadsheet] Selected:', selected);
```

## 📦 发布检查清单

发布前确保：

- [ ] 所有测试通过: `pnpm test`
- [ ] 类型检查通过: `pnpm check-typing`
- [ ] 代码规范检查通过: `pnpm lint`
- [ ] 代码格式正确: `pnpm check-format`
- [ ] **已运行同步脚本**: `pnpm run sync-templates`
- [ ] 已更新 CHANGELOG
- [ ] 已更新版本号
- [ ] 已测试构建: `pnpm build`
- [ ] 已提交所有更改

## 🤝 团队协作

### 分支策略

```bash
# 主分支
main          # 稳定版本

# 功能分支
feature/xxx   # 新功能开发
fix/xxx       # Bug 修复
docs/xxx      # 文档更新
```

### PR 流程

1. 创建功能分支
```bash
git checkout -b feature/my-feature
```

2. 开发和测试
```bash
# 在 src/ 开发
# 运行测试
pnpm test
```

3. 同步模板（重要！）
```bash
pnpm run sync-templates
git add packages/templates/
```

4. 提交和推送
```bash
git commit -m "feat: my new feature"
git push origin feature/my-feature
```

5. 创建 PR
- 确保 CI 通过
- 等待代码审查

## ⚠️ 常见错误

### ❌ 错误 1: 直接修改 packages/templates/

```bash
# ❌ 错误做法
vim packages/templates/spreadsheet/Spreadsheet.tsx

# ✅ 正确做法
vim src/Spreadsheet.tsx
pnpm run sync-templates
```

**原因：** `packages/templates/` 是自动生成的，会被 `sync-templates` 覆盖。

### ❌ 错误 2: 忘记运行 sync-templates

```bash
# 修改了 src/，但忘记同步
vim src/Spreadsheet.tsx
git commit -am "feat: update"
git push

# ❌ 结果：用户通过 CLI 安装时得到的是旧版本！
```

**解决：** 发布前总是运行 `pnpm run sync-templates`

### ❌ 错误 3: 同时修改 src/ 和 packages/templates/

```bash
# ❌ 错误
vim src/Spreadsheet.tsx
vim packages/templates/spreadsheet/Spreadsheet.tsx  # 会被覆盖！
```

**解决：** 只修改 `src/`，templates 由脚本管理。

## 🎓 最佳实践

1. **开发时只关注 `src/`**
   - 不要担心 templates 目录
   - 专注于功能开发和测试

2. **使用 Storybook 验证**
   - 每个功能都写 story
   - 利用 Storybook 的交互测试

3. **自动化同步**
   - 可以在 pre-commit hook 中运行 `sync-templates`
   - 或者在 CI 中自动运行

4. **保持两种发布方式**
   - npm 包：给不想修改源码的用户
   - CLI：给需要深度定制的用户

## 🔗 相关资源

- [Storybook 文档](https://storybook.js.org/)
- [shadcn/ui 源码](https://github.com/shadcn/ui)
- [CLI 工具开发指南](./packages/cli/README.md)

## 💡 总结

记住这个流程：

```
开发 (src/) → 测试 → 同步 (sync-templates) → 发布
     ↑                                          │
     └──────────── 循环迭代 ──────────────────┘
```

**关键点：**
- ✅ 开发调试完全不变，继续用 Storybook
- ✅ 只需在发布前多一个 `sync-templates` 步骤
- ✅ 用户可以选择 npm 包或 CLI 两种方式使用

