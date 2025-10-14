# 填充功能调试指南

## 当前状态

已添加详细的控制台日志来帮助诊断填充功能问题。

## 如何调试

### 1. 打开浏览器控制台

在 Chrome/Edge 中按 `F12` 或右键选择"检查" → "Console"

### 2. 执行填充操作

1. 选中一个或多个单元格
2. 将鼠标移到右下角的填充手柄（蓝色小方块）
3. 点击并拖动到其他单元格
4. 释放鼠标

### 3. 查看控制台日志

日志会按以下顺序出现：

#### 开始拖动时：
```
START_FILL
```

#### 拖动过程中（每次鼠标移动到新单元格）：
```
Fill drag to: <row> <column>
FILL_DRAG: selectedRange {...} point {...} fillRange {...}
```

**检查点：**
- `selectedRange` 应该是您最初选中的区域
- `point` 应该是您当前鼠标所在的单元格
- `fillRange` 应该从 selectedRange.start 到 point

#### 释放鼠标时：
```
End fill, useSmartFill: <boolean> lastPoint: {...}
END_FILL: useSmartFill <boolean> state.filling <boolean> state.fillRange {...}
END_FILL: selectedRange {...} fillRange {...}
simpleCopy: sourceRange {...} targetRange {...}
simpleCopy: sourceRows <number> sourceCols <number>
simpleCopy: point {...} sourcePoint {...} sourceCell {...}  (重复多次)
simpleCopy: total changes <number>
END_FILL: changes <number> entries
END_FILL: applying <number> changes
```

**检查点：**
- `simpleCopy` 应该被调用
- `sourceRange` 应该等于 `selectedRange`
- `targetRange` 应该等于 `fillRange`
- 应该有多个 `simpleCopy: point {...}` 日志，每个对应一个要填充的单元格
- `sourceCell` 应该不为空（包含要复制的数据）
- `total changes` 应该 > 0
- `applying <number> changes` 应该与 total changes 相同

## 常见问题诊断

### 问题 1：没有看到 "Fill drag to:" 日志

**可能原因：**
- 单元格没有 `data-row` 和 `data-column` 属性
- 鼠标没有正确拖动到单元格上

**解决方法：**
在控制台运行：
```javascript
document.querySelectorAll('td[data-row]').length
```
应该返回一个大于 0 的数字。如果返回 0，说明单元格缺少必要的属性。

### 问题 2：看到 "Fill drag to:" 但没有填充

**可能原因：**
- `fillRange` 计算不正确
- `simpleCopy` 没有找到源单元格数据

**检查：**
查看 `simpleCopy: sourceCell` 日志，如果显示 `undefined` 或 `null`，说明源单元格没有数据。

### 问题 3："total changes" 是 0

**可能原因：**
- `sourceRange` 和 `targetRange` 重叠，所有点都被跳过
- 源单元格没有数据

**检查：**
- 确保 `targetRange` 包含超出 `sourceRange` 的单元格
- 确保源单元格有 `value` 属性

### 问题 4：看到 "END_FILL: not filling or no fillRange"

**可能原因：**
- 在 `START_FILL` 和 `END_FILL` 之间状态丢失
- 没有成功调用 `FILL_DRAG`

**检查：**
- 确保在整个拖动过程中看到了 `FILL_DRAG` 日志
- 检查是否有 React 重新渲染导致状态重置

## 预期的完整日志流程示例

选中单元格 (0,0)，向下拖动到 (2,0)：

```
START_FILL
Fill drag to: 1 0
FILL_DRAG: selectedRange {start: {row: 0, column: 0}, end: {row: 0, column: 0}} point {row: 1, column: 0} fillRange {start: {row: 0, column: 0}, end: {row: 1, column: 0}}
Fill drag to: 2 0
FILL_DRAG: selectedRange {start: {row: 0, column: 0}, end: {row: 0, column: 0}} point {row: 2, column: 0} fillRange {start: {row: 0, column: 0}, end: {row: 2, column: 0}}
End fill, useSmartFill: false lastPoint: {row: 2, column: 0}
END_FILL: useSmartFill false state.filling true state.fillRange {start: {row: 0, column: 0}, end: {row: 2, column: 0}}
END_FILL: selectedRange {start: {row: 0, column: 0}, end: {row: 0, column: 0}} fillRange {start: {row: 0, column: 0}, end: {row: 2, column: 0}}
simpleCopy: sourceRange {start: {row: 0, column: 0}, end: {row: 0, column: 0}} targetRange {start: {row: 0, column: 0}, end: {row: 2, column: 0}}
simpleCopy: sourceRows 1 sourceCols 1
simpleCopy: point {row: 1, column: 0} sourcePoint {row: 0, column: 0} sourceCell {value: "Apple"}
simpleCopy: point {row: 2, column: 0} sourcePoint {row: 0, column: 0} sourceCell {value: "Apple"}
simpleCopy: total changes 2
END_FILL: changes 2 entries
END_FILL: applying 2 changes
```

## 下一步

如果您看到了不同的日志输出，请将完整的控制台日志分享，这样我可以准确诊断问题所在。

