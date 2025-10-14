# 填充手柄功能 Bug 修复

## 修复的问题

### 问题 1：选中单个或多个单元格时填充手柄不显示

**现象：**
- 选中 1 个单元格时看不到填充手柄
- 选中 3 个或更多单元格时也可能看不到

**原因：**
`Selected.tsx` 组件中的显示逻辑设置为只有当选中 2 个或更多单元格时才显示填充手柄：
```typescript
const hidden = selectedSize < 2;
const showFillHandle = !hidden && !dragging;
```

**解决方案：**
修改显示逻辑，只要选中了单元格（即使只有 1 个）就显示填充手柄，这与 Excel 的行为一致：
```typescript
const showFillHandle = selectedSize > 0 && !dragging;
```

**修改的文件：**
- `src/spreadsheet/components/overlays/Selected.tsx`

---

### 问题 2：拖动填充时出现 "require is not defined" 错误

**错误信息：**
```
ReferenceError: require is not defined
    at FillPreview (http://localhost:6006/src/spreadsheet/components/overlays/FillPreview.tsx:31:30)
```

**原因：**
在两个地方使用了 CommonJS 的 `require()` 语法而不是 ES6 的 `import`：

1. `FillPreview.tsx` 中：
```typescript
const { RangeSelection } = require("../../data-structures/selection");
```

2. `reducer.ts` 中：
```typescript
const fillHandler = require("./fill-handler");
```

现代的前端构建工具（如 Vite、Webpack）在浏览器环境中不支持 `require()`。

**解决方案：**

1. 在 `FillPreview.tsx` 顶部添加正确的 import：
```typescript
import { RangeSelection } from "../../data-structures/selection";
```

2. 在 `reducer.ts` 顶部添加正确的 import：
```typescript
import * as FillHandler from "./fill-handler";
```

然后在代码中直接使用导入的模块：
```typescript
const changes = useSmartFill
  ? FillHandler.smartFill(state.model.data, selectedRange, state.fillRange)
  : FillHandler.simpleCopy(state.model.data, selectedRange, state.fillRange);
```

**修改的文件：**
- `src/spreadsheet/components/overlays/FillPreview.tsx`
- `src/spreadsheet/core/reducer.ts`

---

## 测试验证

修复后应该验证以下场景：

### 场景 1：填充手柄显示
- ✅ 选中 1 个单元格时，应在右下角显示填充手柄
- ✅ 选中 2 个单元格时，应在右下角显示填充手柄
- ✅ 选中 3 个或更多单元格时，应在右下角显示填充手柄
- ✅ 鼠标悬停在填充手柄上时，光标变为十字形

### 场景 2：简单复制填充
1. 选中一个包含数据的单元格（如 "Apple"）
2. 将鼠标移到右下角的填充手柄
3. 点击并向下拖动 3 个单元格
4. 释放鼠标
5. ✅ 应该看到 "Apple" 被复制到下面 3 个单元格

### 场景 3：智能填充（数字）
1. 选中两个包含数字的单元格（如 "1", "2"）
2. 按住 Ctrl（Windows）或 Cmd（Mac）键
3. 拖动填充手柄向下 3 个单元格
4. 释放鼠标
5. ✅ 应该看到数字序列：1, 2, 3, 4, 5

### 场景 4：智能填充（文本+数字）
1. 选中两个包含文本+数字的单元格（如 "项目1", "项目2"）
2. 按住 Ctrl/Cmd 键
3. 拖动填充手柄向下 3 个单元格
4. 释放鼠标
5. ✅ 应该看到：项目1, 项目2, 项目3, 项目4, 项目5

### 场景 5：多方向填充
- ✅ 向上拖动应该正常工作
- ✅ 向下拖动应该正常工作
- ✅ 向左拖动应该正常工作
- ✅ 向右拖动应该正常工作

---

## 已知限制

目前没有已知的主要限制。功能应该正常工作。

---

## 后续改进建议

虽然当前的实现已经可以工作，但仍有改进空间：

1. **性能优化**：对于大范围的填充（如 1000+ 单元格），可能需要优化算法
2. **更多模式**：支持更多智能填充模式（如星期、月份等）
3. **视觉反馈**：在拖动时显示更明显的预览效果
4. **撤销/重做**：集成到撤销系统中
5. **公式填充**：智能处理公式中的相对引用和绝对引用

---

## 版本历史

- **v1.0.0** (2024-12-13)：初始实现
- **v1.0.1** (2024-12-13)：修复 `require is not defined` 错误
- **v1.0.2** (2024-12-13)：修复单个单元格不显示填充手柄的问题

