# 🚀 下一步操作指南

## ⚠️ 重要：必须重启 Storybook

由于修改了 Storybook 配置文件（`.storybook/main.ts`），**必须完全重启** Storybook 才能生效。

### 步骤 1：停止当前 Storybook

在运行 `pnpm run dev` 的终端中：

**按 `Ctrl+C`** 停止服务器

### 步骤 2：重新启动

```bash
pnpm run dev
```

### 步骤 3：等待启动完成

你会看到类似信息：

```
╭──────────────────────────────────────────────────╮
│                                                  │
│   Storybook 8.6.11 for react-vite started       │
│   Local:            http://localhost:6006/       │
│                                                  │
╰──────────────────────────────────────────────────╯
```

**这次应该不会有错误了！** ✅

## 🎯 测试 DtyLuckySheet

### 1. 打开浏览器

访问：`http://localhost:6006`

### 2. 查找 DtyLuckySheet 示例

在左侧导航栏中找到：

```
📁 DtyLuckySheet
  📁 Features
    📄 Basic          ← 点击这个
    📄 Formula
    📄 Empty
    📄 Tabs
    📄 Multi Instance
  📁 API
    📄 Get Cell Value
    📄 Set Cell Value
```

### 3. 测试 Basic 示例

点击 **DtyLuckySheet → Features → Basic**

你应该看到：
- ✅ 一个带网格线的表格
- ✅ 显示数据：Name, Age, City
- ✅ Alice, 25, New York
- ✅ Bob, 30, London
- ✅ Charlie, 35, Tokyo

### 4. 测试 API 示例

点击 **DtyLuckySheet → API → Get Cell Value**

你应该看到：
- ✅ 顶部有一个蓝色 "Run" 按钮
- ✅ 下方显示表格
- ✅ 点击 Run 按钮后，显示 "result: fortune"

点击 **DtyLuckySheet → API → Set Cell Value**

- ✅ 点击 Run 按钮
- ✅ 表格中应该填充数据（0, 1, 2, 3, 4 等）

## ✨ 预期效果

### Basic 示例应该显示：

```
┌─────────┬──────┬──────────┐
│ Name    │ Age  │ City     │
├─────────┼──────┼──────────┤
│ Alice   │  25  │ New York │
│ Bob     │  30  │ London   │
│ Charlie │  35  │ Tokyo    │
└─────────┴──────┴──────────┘
```

### Formula 示例应该显示：

```
┌────┬────┬────────────┐
│ A  │ B  │ SUM(A+B)   │
├────┼────┼────────────┤
│ 10 │ 20 │ 30         │
│ 15 │ 25 │ 40         │
├────┴────┼────────────┤
│ Total   │ 70         │
└─────────┴────────────┘
```

### Multi Instance 应该显示：

左右并排显示两个独立的表格实例。

## 🐛 如果还有问题

### 清除缓存重试

```bash
# 停止 Storybook (Ctrl+C)

# 清除 Vite 缓存
rm -rf node_modules/.vite

# Windows 用户使用：
# rmdir /s /q node_modules\.vite

# 重新启动
pnpm run dev
```

### 检查浏览器控制台

按 `F12` 打开开发者工具，查看：
- Console 标签：是否有 JavaScript 错误
- Network 标签：是否有加载失败的资源

### 常见错误和解决

#### 错误 1：空白页面
- **检查**：容器是否有高度
- **解决**：确保 div 有 `height: 100vh`

#### 错误 2：数据不显示
- **检查**：数据格式是否正确
- **解决**：确保使用 celldata 格式，参考 `stories/data/cell.ts`

#### 错误 3：Canvas 不渲染
- **检查**：浏览器控制台是否有错误
- **解决**：检查 Canvas ref 是否正确传递

## 📚 深入学习

### 1. 查看代码实现

**推荐阅读顺序**：

```
1. packages/core/src/types.ts        # 了解数据结构
2. packages/core/src/context.ts      # 了解状态管理
3. packages/react/src/components/Workbook/index.tsx  # 了解组件实现
4. stories/Features.stories.tsx      # 了解使用方式
```

### 2. 对比 FortuneSheet

打开两个窗口对比学习：

**窗口 1**：你的项目
```
src/dty-lucky-sheet/packages/core/src/types.ts
```

**窗口 2**：FortuneSheet
```
fortune-sheet/packages/core/src/types.ts
```

看看有什么相似和不同。

### 3. 实验和修改

尝试修改示例数据：

```typescript
// 编辑 stories/data/cell.ts
export const cell: Sheet = {
  name: "My Custom Sheet",
  celldata: [
    { r: 0, c: 0, v: { v: "我的数据", m: "我的数据" } },
    // 添加更多数据
  ],
};
```

保存后，Storybook 应该自动更新。

## 🎯 今天的目标

1. ✅ 成功启动 Storybook（无错误）
2. ✅ 查看所有 7 个示例
3. ✅ 测试 API 功能（点击 Run 按钮）
4. ✅ 理解项目架构
5. ✅ 阅读文档

## 📝 反馈检查

启动后请检查：

- [ ] Storybook 是否正常启动（无红色错误）？
- [ ] 左侧导航栏是否显示 "DtyLuckySheet" 分类？
- [ ] 点击 Basic 示例是否显示表格？
- [ ] 表格是否显示数据（Name, Age, City）？
- [ ] API 示例的 Run 按钮是否可以点击？
- [ ] 点击 Run 后是否显示结果？

如果以上都是 ✅，说明一切正常！

## 🎊 完成标志

当你看到以下内容时，说明项目成功运行：

1. **Storybook 界面**：左侧有 DtyLuckySheet 分类
2. **表格显示**：能看到网格和数据
3. **API 交互**：Run 按钮可以执行并显示结果
4. **无错误**：浏览器控制台没有红色错误

---

**准备好了吗？重启 Storybook，开始体验吧！** 🚀

```bash
# 停止当前服务器
Ctrl+C

# 重新启动
pnpm run dev
```

祝你好运！如果有任何问题，查看 **TROUBLESHOOTING.md** 📖

