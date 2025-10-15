# 智能填充功能测试指南

## 如何使用智能填充

智能填充需要**按住 Ctrl 键（Windows）或 Cmd 键（Mac）**，然后拖动填充手柄。

### ⚠️ 重要提示

**简单复制 vs 智能填充的区别：**

- **简单复制**（不按 Ctrl）：直接复制单元格内容
  - 选中 "1", "2" → 拖动 → 填充为 "1", "2", "1", "2", "1", "2"...（循环复制）
  
- **智能填充**（按住 Ctrl/Cmd）：自动识别模式并递增
  - 选中 "1", "2" → **按住 Ctrl** 拖动 → 填充为 "1", "2", "3", "4", "5"...（递增）

## 测试场景

### ✅ 场景 1：纯数字序列

**步骤：**
1. 在单元格 A1 输入 `1`
2. 在单元格 A2 输入 `2`
3. 选中 A1 和 A2（两个单元格）
4. **按住 Ctrl 键（Windows）或 Cmd 键（Mac）**
5. 将鼠标移到选区右下角的蓝色小方块（填充手柄）
6. 按住鼠标左键，向下拖动到 A5
7. 释放鼠标，**然后释放 Ctrl/Cmd 键**

**预期结果：**
```
A1: 1
A2: 2
A3: 3  ← 自动生成
A4: 4  ← 自动生成
A5: 5  ← 自动生成
```

**检查控制台：**
应该看到如下日志：
```
smartFill: START
smartFill: direction vertical
smartFill: sourceSequence values [1, 2]
smartFill: detected pattern {pattern: "number", increment: 1}
smartFill: generated cell at {row: 2, column: 0} value 3
smartFill: generated cell at {row: 3, column: 0} value 4
smartFill: generated cell at {row: 4, column: 0} value 5
smartFill: total changes 3
```

---

### ✅ 场景 2：文本+数字组合

**步骤：**
1. 在单元格 B1 输入 `项目1`
2. 在单元格 B2 输入 `项目2`
3. 选中 B1 和 B2
4. **按住 Ctrl/Cmd 键**
5. 拖动填充手柄向下到 B5
6. 释放鼠标和键盘

**预期结果：**
```
B1: 项目1
B2: 项目2
B3: 项目3  ← 自动生成
B4: 项目4  ← 自动生成
B5: 项目5  ← 自动生成
```

**检查控制台：**
```
smartFill: START
smartFill: detected pattern {pattern: "text-number", increment: 1}
smartFill: generated cell at {row: 2, column: 1} value 项目3
...
```

---

### ✅ 场景 3：递增步长为 2

**步骤：**
1. 在单元格 C1 输入 `2`
2. 在单元格 C2 输入 `4`
3. 选中 C1 和 C2
4. **按住 Ctrl/Cmd 键**
5. 拖动填充手柄向下到 C5

**预期结果：**
```
C1: 2
C2: 4
C3: 6   ← 自动生成（步长为2）
C4: 8   ← 自动生成
C5: 10  ← 自动生成
```

**检查控制台：**
```
smartFill: detected pattern {pattern: "number", increment: 2}
```

---

## 常见问题排查

### ❌ 问题 1：没有智能填充，只是简单复制

**原因**：没有按住 Ctrl/Cmd 键

**解决方法**：
- 确保在拖动填充手柄时**一直按住** Ctrl（Windows）或 Cmd（Mac）键
- 先按下 Ctrl/Cmd，再开始拖动
- 在释放鼠标后再释放 Ctrl/Cmd 键

---

### ❌ 问题 2：控制台显示 "simpleCopy" 而不是 "smartFill"

**原因**：Ctrl/Cmd 键没有被正确检测

**检查方法**：
1. 打开浏览器控制台（F12）
2. 查看 `END_FILL` 日志
3. 检查 `useSmartFill` 的值

**正确的日志应该是：**
```
END_FILL: useSmartFill true  ← 应该是 true
```

**如果显示 false，说明：**
- Ctrl/Cmd 键没有被检测到
- 可能是操作系统或浏览器的问题
- 尝试使用不同的键盘或浏览器

---

### ❌ 问题 3：只选中一个单元格

**原因**：智能填充需要**至少两个单元格**来检测模式

**解决方法**：
- 选中至少 2 个单元格（例如 A1:A2）
- 如果只选中 1 个单元格，系统会退回到简单复制模式

---

### ❌ 问题 4：模式检测失败

**可能的原因：**

1. **数据不是数字**
   - 检查单元格内容是否为纯数字
   - 例如："1" 和 "2" 应该被识别为数字
   
2. **文本前缀不一致**
   - 对于 "项目1" 和 "项目2"，前缀必须完全相同
   - "项目1" 和 "任务2" 不会被识别为同一模式

3. **查看控制台日志**
   ```
   smartFill: detected pattern {pattern: "text", increment: 1}
   ```
   如果 pattern 是 "text" 而不是 "number" 或 "text-number"，说明模式检测失败

---

## 调试步骤

### 步骤 1：确认智能填充被调用

在控制台查找：
```
smartFill: START  ← 应该出现这行
```

如果没有看到，说明没有使用智能填充模式（Ctrl/Cmd 键没按住）。

### 步骤 2：检查源数据

查看：
```
smartFill: sourceSequence values [1, 2]
```

确认源数据正确。

### 步骤 3：检查模式检测

查看：
```
smartFill: detected pattern {pattern: "number", increment: 1}
```

- `pattern` 应该是 "number" 或 "text-number"
- `increment` 应该是递增值（如 1, 2, 3...）

### 步骤 4：检查生成的数据

查看：
```
smartFill: generated cell at {row: 2, column: 0} value 3
```

确认生成的值正确。

---

## 键盘快捷键提示

### Windows:
- **Ctrl + 拖动填充手柄** = 智能填充

### Mac:
- **Cmd + 拖动填充手柄** = 智能填充

---

## 如果仍然不工作

如果按照上述步骤操作后仍然不工作，请：

1. **复制完整的控制台日志**，包括：
   - `END_FILL` 日志
   - `smartFill` 日志（如果有）
   - `simpleCopy` 日志

2. **描述你的操作步骤**：
   - 输入的数据是什么
   - 是否按住了 Ctrl/Cmd
   - 实际填充的结果是什么

3. **提供这些信息**以便进一步诊断问题

