# 智能填充快速参考

## 🎯 如何启用智能填充

### Windows
按住 **Ctrl** 键 + 拖动填充手柄

### Mac  
按住 **Cmd** 键 + 拖动填充手柄

---

## 📋 测试步骤（30秒测试）

### 测试数字序列：

1. 输入：
   - A1: `1`
   - A2: `2`

2. 选中 A1:A2

3. **按住 Ctrl（或 Cmd）键**

4. 拖动右下角蓝色小方块到 A5

5. 松开鼠标

**预期结果**：A3=3, A4=4, A5=5

---

## 🔍 查看调试信息

打开浏览器控制台（F12），应该看到：

```
FillHandle: End fill, useSmartFill: true ← 必须是 true
smartFill: START
smartFill: sourceSequence values [1, 2]
smartFill: detected pattern {pattern: "number", increment: 1}
smartFill: generated cell at ... value 3
smartFill: generated cell at ... value 4
smartFill: generated cell at ... value 5
smartFill: total changes 3
```

---

## ❌ 常见错误

### 错误 1：useSmartFill 显示 false

**原因**：没有按住 Ctrl/Cmd 键

**解决**：
- 先按下 Ctrl/Cmd
- 再开始拖动
- 一直按住直到松开鼠标

---

### 错误 2：只看到 simpleCopy 日志

**原因**：同上，Ctrl/Cmd 键没被检测到

**解决**：检查控制台中的这一行：
```
FillHandle: End fill, useSmartFill: false ctrlKey: false metaKey: false
```

如果 `ctrlKey` 和 `metaKey` 都是 false，说明键盘按键没有被检测到。

---

### 错误 3：只选中了一个单元格

**原因**：智能填充需要至少 2 个单元格来检测模式

**解决**：选中至少 2 个单元格

---

## 📝 支持的模式

| 模式 | 示例输入 | 输出 |
|------|---------|------|
| 数字 | 1, 2 | 3, 4, 5, 6... |
| 数字（步长2） | 2, 4 | 6, 8, 10, 12... |
| 文本+数字 | 项目1, 项目2 | 项目3, 项目4, 项目5... |
| 日期 | 2024-01-01, 2024-01-02 | 2024-01-03, 2024-01-04... |

---

## 💡 提示

- **智能填充 = Ctrl/Cmd + 拖动**
- **简单复制 = 直接拖动（不按键）**
- **需要至少 2 个单元格来检测模式**
- **查看控制台确认 useSmartFill: true**

---

详细文档请查看：`SMART_FILL_TEST_GUIDE.md`

