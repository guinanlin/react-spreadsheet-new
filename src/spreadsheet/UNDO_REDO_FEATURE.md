# 撤销/重做功能 (Undo/Redo Feature)

## 功能概述

Spreadsheet 组件现已支持完整的撤销/重做功能，可以撤销以下操作：

- ✅ 粘贴操作（从 Excel 或其他来源复制粘贴）
- ✅ 单元格编辑（修改单元格的值）
- ✅ 清除单元格（删除或清空单元格内容）
- ✅ 填充操作（使用填充柄拖动填充）

## 快捷键

### Windows/Linux
- **撤销**: `Ctrl + Z`
- **重做**: `Ctrl + Y` 或 `Ctrl + Shift + Z`

### macOS
- **撤销**: `Cmd + Z`
- **重做**: `Cmd + Y` 或 `Cmd + Shift + Z`

## 技术实现

### 核心功能

1. **历史记录栈**
   - 维护 `past` 和 `future` 两个历史栈
   - 每次数据变更前自动保存当前状态
   - 最多保存 50 条历史记录（可配置）

2. **状态保存**
   每条历史记录包含：
   - 表格数据 (`data`)
   - 选中区域 (`selected`)
   - 活动单元格 (`active`)

3. **自动清理**
   - 执行新操作时自动清空重做栈
   - 超过历史记录限制时自动删除最旧的记录

### 修改的文件

1. **src/spreadsheet/core/actions.ts**
   - 新增 `UNDO` 和 `REDO` actions
   - 导出 `undo()` 和 `redo()` action creators

2. **src/spreadsheet/types.ts**
   - 新增 `HistoryEntry` 类型定义
   - 在 `StoreState` 中添加 `past` 和 `future` 字段

3. **src/spreadsheet/core/reducer.ts**
   - 实现 `saveHistory()` 辅助函数
   - 在 PASTE、SET_CELL_DATA、CLEAR、END_FILL 操作中添加历史记录
   - 实现 UNDO 和 REDO 的 reducer 逻辑
   - 在键盘事件处理器中添加快捷键支持

## 使用示例

```tsx
import { Spreadsheet } from "./spreadsheet";

function App() {
  const [data, setData] = React.useState(initialData);

  return (
    <Spreadsheet
      data={data}
      onChange={setData}
    />
  );
}
```

使用时无需任何额外配置，撤销/重做功能会自动启用。用户只需：

1. 进行任何支持撤销的操作（编辑、粘贴、清除等）
2. 按 `Ctrl + Z` 撤销
3. 按 `Ctrl + Y` 重做

## 注意事项

1. **性能考虑**
   - 历史记录会占用内存，默认限制为 50 条
   - 对于大型表格，建议根据实际情况调整历史记录限制

2. **不支持撤销的操作**
   - 选择单元格（不改变数据）
   - 改变列宽/行高
   - 复制操作（只有粘贴会被记录）

3. **状态恢复**
   - 撤销/重做会恢复数据、选中区域和活动单元格
   - 会自动退出编辑模式

## 未来改进

可能的改进方向：

- [ ] 支持配置历史记录限制
- [ ] 支持撤销列宽/行高调整
- [ ] 提供 API 手动保存历史检查点
- [ ] 添加历史记录可视化界面
- [ ] 支持撤销/重做的回调事件

## 测试

可以通过以下步骤测试功能：

1. 在单元格中输入 "1"
2. 按 Enter 确认
3. 再次编辑为 "2"
4. 按 Ctrl+Z → 应该恢复为 "1"
5. 按 Ctrl+Y → 应该重新变为 "2"

或者：

1. 从 Excel 复制一些数据
2. 粘贴到表格中
3. 按 Ctrl+Z → 数据应该被撤销
4. 按 Ctrl+Y → 数据应该重新出现

---

**实现日期**: 2025-10-14
**版本**: 1.0.0

