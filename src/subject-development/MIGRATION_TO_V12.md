# React Flow v12 迁移指南

## 📋 更新概述

CourseFlow 组件已从 React Flow v11 升级到 v12。主要变更包括包名和类型系统的更新。

**更新时间**：2024-10-12

---

## 🔄 主要变更

### 1. 包名变更

React Flow 从 v12 开始更改了包名：

| 版本 | 包名 |
|------|------|
| v11 及之前 | `reactflow` |
| v12 及之后 | `@xyflow/react` |

### 2. 导入语句更新

#### 更新前（v11）：
```typescript
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  // ...
} from 'reactflow'
import 'reactflow/dist/style.css'
```

#### 更新后（v12）：
```typescript
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  // ...
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
```

**关键变化**：
- ✅ `ReactFlow` 现在是**命名导出**，不再是默认导出
- ✅ CSS 文件路径从 `reactflow/dist/style.css` 改为 `@xyflow/react/dist/style.css`

### 3. 类型系统更新

#### 节点数据类型

为了兼容 v12 的类型要求，`FlowNodeData` 接口现在继承 `Record<string, unknown>`：

```typescript
// 更新后
export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  type: FlowNodeType;
  status?: FlowNodeStatus;
  description?: string;
  editable?: boolean;
  metadata?: Record<string, any>;
}
```

#### 节点数组类型

节点数组现在使用泛型类型：

```typescript
// 更新前
const defaultNodes: Node[] = [...]

// 更新后
const defaultNodes: Node<FlowNodeData>[] = [...]
```

#### 类型断言移除

所有 `as FlowNodeData` 类型断言已被移除，直接使用对象字面量：

```typescript
// 更新前
data: { 
  label: '学习目标设定',
  type: 'main',
  status: 'pending'
} as FlowNodeData

// 更新后
data: { 
  label: '学习目标设定',
  type: 'main',
  status: 'pending'
}
```

---

## 📦 安装依赖

### 卸载旧版本（如果有）

```bash
npm uninstall reactflow
```

### 安装新版本

```bash
npm install @xyflow/react
```

或使用 yarn：

```bash
yarn add @xyflow/react
```

---

## 🔧 已更新的文件

### 代码文件

1. **src/subject-development/components/CourseFlow.tsx**
   - 更新导入语句
   - 更新 CSS 导入
   - 修复节点类型定义
   - 修复 MiniMap 类型转换

2. **src/subject-development/types.ts**
   - `FlowNodeData` 接口添加索引签名

3. **src/subject-development/stories/CourseFlow.stories.tsx**
   - 添加 Node 类型导入
   - 移除所有类型断言
   - 添加正确的类型注解

### 文档文件

1. **src/subject-development/INSTALLATION.md**
   - 更新安装命令
   - 更新版本要求说明

2. **src/subject-development/README.md**
   - 更新依赖要求说明

3. **src/subject-development/QUICK_START.md**
   - 更新安装命令

4. **src/subject-development/COURSEFLOW_GUIDE.md**
   - 更新安装命令
   - 添加版本说明

5. **src/subject-development/CHANGELOG.md**
   - 更新依赖版本信息

---

## ✅ 验证步骤

### 1. 清除缓存

```bash
# 删除 node_modules 缓存
rm -rf node_modules/.cache

# 或删除整个 node_modules（可选）
rm -rf node_modules
npm install
```

### 2. 启动 Storybook

```bash
npm run storybook
```

### 3. 检查 CourseFlow 组件

访问 http://localhost:6006 并导航到 `SubjectDevelopment/CourseFlow`

测试以下示例：
- ✅ Default - 默认流程图
- ✅ Editable - 可编辑模式
- ✅ WithProgress - 进度展示
- ✅ Interactive - 交互示例

### 4. 类型检查

```bash
npm run check-typing
```

应该看到 0 个类型错误。

---

## 🐛 常见问题

### Q1: Storybook 无法加载组件

**错误信息**：
```
Failed to fetch dynamically imported module
```

**解决方案**：
1. 确保已安装 `@xyflow/react`：
   ```bash
   npm install @xyflow/react
   ```

2. 清除缓存并重启：
   ```bash
   rm -rf node_modules/.cache
   npm run storybook
   ```

### Q2: 类型错误

**错误信息**：
```
Type 'FlowNodeData' is not assignable to type 'Record<string, unknown>'
```

**解决方案**：
已修复！确保您的 `types.ts` 中 `FlowNodeData` 继承了 `Record<string, unknown>`

### Q3: 导入错误

**错误信息**：
```
Cannot find module 'reactflow'
```

**解决方案**：
更新导入语句从 `'reactflow'` 改为 `'@xyflow/react'`

---

## 📚 参考资源

- [React Flow v12 发布说明](https://reactflow.dev/blog/react-flow-12)
- [React Flow 官方文档](https://reactflow.dev/)
- [迁移指南](https://reactflow.dev/learn/troubleshooting/migrate-to-v12)

---

## ✨ 升级优势

React Flow v12 带来的改进：

1. **更好的性能** - 优化了渲染性能
2. **改进的类型系统** - 更严格的 TypeScript 支持
3. **新功能** - 添加了更多内置功能
4. **更好的文档** - 官方文档更加完善
5. **活跃维护** - 持续更新和 bug 修复

---

## 💬 需要帮助？

如果遇到问题：

1. 检查本迁移指南的常见问题部分
2. 查看 [React Flow 官方文档](https://reactflow.dev/)
3. 搜索 [GitHub Issues](https://github.com/xyflow/xyflow/issues)

---

**文档版本**：1.0.0  
**最后更新**：2024-10-12

