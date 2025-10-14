# Excel 自动填充功能（Fill Handle）

## 概述

Spreadsheet 组件现在支持类似 Excel 的自动填充功能。用户可以通过拖动选中区域右下角的填充手柄来快速复制或智能填充数据。

## 功能特性

### 1. 填充手柄显示

- 当选中一个或多个单元格时，在选中区域的**右下角**会显示一个小方块
- 鼠标悬停到这个区域时，会出现**十字光标**，表示可以开始拖动
- 填充手柄是一个 6x6 像素的蓝色小方块

### 2. 填充模式

#### 简单复制模式（默认）

直接拖动填充手柄，会将源单元格的内容复制到目标区域。

**示例：**
```
源数据: Apple
拖动后: Apple, Apple, Apple, ...
```

#### 智能填充模式（按住 Ctrl/Cmd）

按住 Ctrl（Windows）或 Cmd（Mac）键拖动，会自动识别数据模式并智能填充。

**支持的模式：**

1. **纯数字序列**
   ```
   源数据: 1, 2
   智能填充: 1, 2, 3, 4, 5, ...
   ```

2. **文本+数字组合**
   ```
   源数据: 项目1, 项目2
   智能填充: 项目1, 项目2, 项目3, 项目4, ...
   ```

3. **日期序列**
   ```
   源数据: 2024-01-01, 2024-01-02
   智能填充: 2024-01-01, 2024-01-02, 2024-01-03, ...
   ```

4. **纯文本**
   ```
   源数据: Apple
   智能填充: Apple, Apple, Apple, ...（简单复制）
   ```

### 3. 填充方向

支持**四个方向**的填充：
- ⬆️ 向上
- ⬇️ 向下
- ⬅️ 向左
- ➡️ 向右

### 4. 视觉反馈

- **填充预览**：拖动时会显示一个虚线边框，表示将要填充的区域
- **实时更新**：拖动过程中可以看到预览区域随鼠标移动而变化

## 使用方法

### 基本用法

1. 选中一个或多个单元格
2. 将鼠标移动到选中区域的右下角
3. 看到十字光标时，按住鼠标左键
4. 拖动到目标位置
5. 释放鼠标完成填充

### 智能填充

- 在拖动时按住 `Ctrl`（Windows）或 `Cmd`（Mac）键
- 系统会自动检测数据模式并智能填充

## 技术实现

### 核心文件

1. **状态管理**
   - `src/spreadsheet/types.ts` - 添加 `filling` 和 `fillRange` 状态
   - `src/spreadsheet/core/actions.ts` - 添加 `START_FILL`, `FILL_DRAG`, `END_FILL` actions

2. **填充逻辑**
   - `src/spreadsheet/core/fill-handler.ts` - 实现填充算法
     - `detectPattern()` - 检测数据模式
     - `simpleCopy()` - 简单复制
     - `smartFill()` - 智能填充
     - `generateFillData()` - 生成填充数据

3. **UI 组件**
   - `src/spreadsheet/components/overlays/FillHandle.tsx` - 填充手柄组件
   - `src/spreadsheet/components/overlays/FillPreview.tsx` - 填充预览组件
   - `src/spreadsheet/components/overlays/Selected.tsx` - 集成填充手柄

4. **样式**
   - `src/spreadsheet/components/Spreadsheet.css` - 填充手柄和预览样式

### 架构设计

```
用户交互
  ↓
FillHandle 组件 (鼠标事件)
  ↓
Actions (START_FILL, FILL_DRAG, END_FILL)
  ↓
Reducer (状态更新)
  ↓
Fill Handler (填充算法)
  ↓
Matrix 更新
  ↓
UI 重新渲染
```

## 示例代码

查看 `src/spreadsheet/stories/Spreadsheet.stories.tsx` 中的 `FillHandleExample` story。

在 Storybook 中运行：
```bash
npm run storybook
```

然后导航到 "Spreadsheet" → "Fill Handle Example"。

## 注意事项

1. **性能**：大范围填充可能需要一些时间，特别是使用智能填充时
2. **只读单元格**：不会填充到标记为 `readOnly` 的单元格
3. **边界检查**：自动限制在数据矩阵的有效范围内
4. **数据验证**：建议在 `onChange` 回调中添加数据验证逻辑

## 未来改进

- [ ] 支持更多数据模式（如星期、月份）
- [ ] 添加用户自定义填充规则
- [ ] 支持公式的智能填充（相对引用和绝对引用）
- [ ] 填充时显示提示工具栏（类似 Excel 的填充选项）
- [ ] 支持撤销/重做操作

## 相关资源

- [Excel 填充功能文档](https://support.microsoft.com/zh-cn/office/fill-data-automatically-in-worksheet-cells-74e31bdd-d993-45da-aa82-35a236c5b5db)
- [Google Sheets 自动填充](https://support.google.com/docs/answer/46973)

