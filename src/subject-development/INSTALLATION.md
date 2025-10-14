# 课程开发组件 - 安装指南

## 📦 基础安装

### NPM

```bash
npm install @your-org/subject-development
```

### Yarn

```bash
yarn add @your-org/subject-development
```

### PNPM

```bash
pnpm add @your-org/subject-development
```

---

## 🔌 可选依赖

### React Flow（CourseFlow 组件需要）

如果您需要使用 **CourseFlow** 课程开发流程图组件，需要额外安装 React Flow：

```bash
npm install @xyflow/react
```

**注意**：
- React Flow v12+ 使用新的包名 `@xyflow/react`（旧版本是 `reactflow`）
- React Flow 版本要求：`^12.0.0` 或更高
- 其他组件（CourseEditor、CourseList、CourseOutline）无需此依赖

---

## ⚙️ 配置要求

### React 版本

- React >= 18.0.0
- React DOM >= 18.0.0

### TypeScript（推荐）

- TypeScript >= 4.5.0

### Tailwind CSS

本组件库使用 Tailwind CSS 进行样式管理。请确保您的项目已配置 Tailwind CSS。

#### 1. 安装 Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 2. 配置 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@your-org/subject-development/**/*.{js,ts,jsx,tsx}', // 添加这一行
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 3. 导入 Tailwind CSS

在您的主 CSS 文件中：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🚀 验证安装

创建一个测试文件验证安装：

```tsx
import React from 'react';
import { CourseEditor } from '@your-org/subject-development';

function App() {
  return (
    <CourseEditor
      course={{
        id: '1',
        title: '测试课程',
        description: '这是一个测试',
        category: '编程',
        status: 'draft',
        author: { id: '1', name: '测试用户' },
        createdAt: new Date(),
        updatedAt: new Date(),
      }}
      onChange={(course) => console.log(course)}
    />
  );
}

export default App;
```

如果组件正常渲染，说明安装成功！

---

## 🔍 完整依赖清单

### 必需依赖

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `clsx` - className 合并工具
- `tailwind-merge` - Tailwind 类名合并

### 可选依赖

- `reactflow` >= 11.0.0 - 用于 CourseFlow 组件

### 开发依赖

- `typescript` >= 4.5.0
- `tailwindcss` >= 3.0.0

---

## 🐛 常见问题

### Q1: Tailwind 样式不生效？

**解决方案**：
1. 确保 `tailwind.config.js` 的 `content` 包含了组件库的路径
2. 检查是否正确导入了 Tailwind CSS 文件
3. 重启开发服务器

### Q2: CourseFlow 组件报错 "Cannot find module 'reactflow'" 或 "@xyflow/react"

**解决方案**：
```bash
npm install @xyflow/react
```

### Q3: TypeScript 类型错误？

**解决方案**：
确保您的 TypeScript 版本 >= 4.5.0，并在 `tsconfig.json` 中启用：

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "esModuleInterop": true
  }
}
```

### Q4: 组件样式异常？

**解决方案**：
1. 检查是否有全局样式冲突
2. 确保使用了正确的 Tailwind CSS 配置
3. 尝试添加自定义 className 覆盖样式

---

## 📚 下一步

安装完成后，查看以下文档：

- [快速上手](./QUICK_START.md) - 5 分钟快速了解组件用法
- [完整文档](./README.md) - 详细的 API 文档
- [使用示例](./USAGE_EXAMPLE.tsx) - 完整的项目示例

---

## 💬 获取帮助

如果遇到问题：

1. 查看 [FAQ](./README.md#常见问题)
2. 搜索 [Issues](https://github.com/your-org/subject-development/issues)
3. 提交新的 Issue

---

**更新时间**：2024-10-12  
**版本**：v0.1.0

