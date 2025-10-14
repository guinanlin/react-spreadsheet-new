# 🔧 MultiInstance 修复说明

## 问题描述

用户反馈 MultiInstance 示例只显示了一个表格，而不是预期的左右两个独立表格。

## 问题原因

1. **导入路径错误**：数据文件还在引用旧的 `../../packages/core/src/types`
2. **布局样式问题**：容器高度设置可能导致第二个表格不可见

## 修复内容

### 1. 修复导入路径

**修改的文件**：
- `stories/data/empty.ts`
- `stories/data/cell.ts` 
- `stories/data/formula.ts`

**修改内容**：
```typescript
// 之前
import { Sheet } from "../../packages/core/src/types";

// 现在
import { Sheet } from "../../types";
```

### 2. 优化 MultiInstance 布局

**修改的文件**：`stories/Features.stories.tsx`

**改进内容**：
```tsx
export const MultiInstance: StoryFn<typeof DtyLuckySheet> = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",           // 明确设置高度
        display: "flex",
        gap: "12px",
        padding: "12px",
        boxSizing: "border-box",   // 添加 box-sizing
      }}
    >
      <div style={{ 
        flex: 1, 
        height: "calc(100vh - 24px)",
        minHeight: "400px",        // 添加最小高度
        border: "1px solid #ddd",  // 添加边框便于识别
        borderRadius: "4px",
      }}>
        <DtyLuckySheet data={[empty]} />  {/* 左边：空表格 */}
      </div>
      <div style={{ 
        flex: 1, 
        height: "calc(100vh - 24px)",
        minHeight: "400px",        // 添加最小高度
        border: "1px solid #ddd",  // 添加边框便于识别
        borderRadius: "4px",
      }}>
        <DtyLuckySheet data={[cell]} />   {/* 右边：有数据的表格 */}
      </div>
    </div>
  );
};
```

## 预期效果

修复后，访问 MultiInstance 应该看到：

```
┌─────────────────┬─────────────────┐
│                 │                 │
│   空表格        │   有数据表格    │
│                 │                 │
│  (只有网格线)   │  Name Age City  │
│                 │  Alice 25 N.Y.  │
│                 │  Bob   30 Lond. │
│                 │  ...    ... ... │
│                 │                 │
└─────────────────┴─────────────────┘
```

**特点**：
- ✅ 左右两个独立表格
- ✅ 每个表格都有边框（便于识别）
- ✅ 左边显示空表格（只有网格）
- ✅ 右边显示有数据的表格
- ✅ 响应式布局（flex: 1）

## 测试步骤

1. **重启 Storybook**（如果需要）：
   ```bash
   pnpm run dev
   ```

2. **访问 MultiInstance**：
   ```
   http://localhost:6006/?path=/story/dtyluckysheet-features--multi-instance
   ```

3. **验证结果**：
   - [ ] 看到左右两个表格
   - [ ] 左边表格为空（只有网格线）
   - [ ] 右边表格有数据（Name, Age, City）
   - [ ] 两个表格都有边框
   - [ ] 布局响应式（调整窗口大小）

## 如果仍有问题

如果还是只看到一个表格，请检查：

1. **浏览器控制台**是否有错误
2. **Storybook 控制台**是否有错误
3. **尝试硬刷新**浏览器（Ctrl+F5）

## 其他 Stories 验证

顺便验证其他 Stories 是否正常：

- [ ] Basic - 显示完整表格
- [ ] Formula - 显示公式数据
- [ ] Empty - 显示空表格
- [ ] Tabs - 显示多工作表
- [ ] Freeze - 显示冻结数据
- [ ] DataVerification - 显示验证数据
- [ ] ProtectedSheet - 显示保护数据
- [ ] **MultiInstance - 显示两个独立表格** ⭐

---

**修复时间**：2024-10-14  
**状态**：✅ 已修复  
**测试**：等待用户验证
