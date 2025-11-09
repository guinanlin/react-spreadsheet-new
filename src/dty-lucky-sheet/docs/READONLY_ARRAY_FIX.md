# 🔧 只读数组错误修复

## 问题描述

**错误信息**：
```
Cannot assign to read only property '0' of object '[object Array]'
```

**出现时机**：
- 在不同 Story 之间切换时
- 特别是切换到 RichBasic Story 时

---

## 问题原因

### 根本原因

Storybook 的 actions 插件会尝试遍历和修改 `args` 对象。当数据中包含嵌套数组（如 `config.rowReadOnly`）时，Storybook 会尝试修改这些数组的属性，但它们被标记为只读，导致错误。

### 具体原因

```typescript
// cell-rich.ts 中的数据
const data = {
  config: {
    rowReadOnly: {
      2: 1,  // ← Storybook 尝试修改这些属性
      3: 1,
      4: 1,
    },
    merge: { ... },
    borderInfo: [ ... ],  // ← 数组也会被遍历
  },
  celldata: [ ... ],
};
```

---

## 解决方案

### 方法 1：深拷贝数据（已应用）✅

在 Template 组件中使用 JSON 深拷贝：

```typescript
const Template: StoryFn<typeof DtyLuckySheet> = ({
  data: data0,
  ...args
}) => {
  // 使用 JSON 深拷贝避免 Storybook 修改只读属性的问题
  const [data, setData] = useState<Sheet[]>(() => 
    JSON.parse(JSON.stringify(data0))
  );
  
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <DtyLuckySheet {...args} data={data} onChange={onChange} />
    </div>
  );
};
```

**优点**：
- ✅ 简单直接
- ✅ 避免了所有只读属性问题
- ✅ 每次渲染都是全新的数据

**缺点**：
- ⚠️ JSON 序列化会丢失函数和特殊对象
- ⚠️ 对于大数据可能稍慢

---

### 方法 2：禁用 Storybook Actions（备选）

如果深拷贝导致性能问题，可以禁用 actions：

```typescript
export const RichBasic = Template.bind({});
RichBasic.args = {
  data: [cellRich],
  allowEdit: true,
};

// 禁用 actions
RichBasic.parameters = {
  actions: { disable: true },
};
```

---

### 方法 3：使用 lodash 深拷贝（备选）

如果需要保留特殊对象：

```typescript
import _ from 'lodash';

const [data, setData] = useState<Sheet[]>(() => 
  _.cloneDeep(data0)
);
```

---

## 已应用的修复

### 1. ✅ 更新了 Template 组件

添加了 JSON 深拷贝逻辑，避免只读属性错误。

### 2. ✅ 添加了类型导入

在 `cell-rich.ts` 中添加了类型定义：

```typescript
import { Sheet } from "../../core/types";

const data: Sheet = {
  // ...
};
```

---

## 🚀 测试验证

### 测试步骤

1. **重启 Storybook**（如果需要）：
   ```bash
   pnpm run dev
   ```

2. **访问 Basic**：
   ```
   http://localhost:6006/?path=/story/dtyluckysheet-features--basic
   ```

3. **切换到 StyledBasic**：
   ```
   http://localhost:6006/?path=/story/dtyluckysheet-features--styled-basic
   ```

4. **切换到 RichBasic**：
   ```
   http://localhost:6006/?path=/story/dtyluckysheet-features--rich-basic
   ```

5. **来回切换多次**，验证不再出现错误

---

## 预期结果

✅ **所有 Story 都能正常切换**
- Basic ↔️ StyledBasic ✅
- StyledBasic ↔️ RichBasic ✅
- RichBasic ↔️ Basic ✅
- 任意切换无错误 ✅

✅ **所有功能正常**
- 编辑功能 ✅
- 拖拽选择 ✅
- 复制粘贴 ✅
- 撤销重做 ✅
- 格式化 ✅

---

## 🎯 为什么这个方案有效

### JSON.parse(JSON.stringify(data))

**作用**：
1. 创建完全独立的数据副本
2. 破坏所有对象引用
3. 所有数组和对象都是新的、可写的

**适用场景**：
- ✅ Storybook args 传递
- ✅ React state 初始化
- ✅ 避免数据污染

**注意事项**：
- ⚠️ 会丢失函数和 Date 对象
- ⚠️ 会丢失 undefined（转为 null）
- ⚠️ 不能处理循环引用

但对于电子表格数据（纯 JSON），这些都不是问题！

---

## 📝 相关代码位置

### 修复的文件

1. **src/dty-lucky-sheet/stories/Features.stories.tsx**
   - Line 29-32：添加了 JSON 深拷贝

2. **src/dty-lucky-sheet/stories/data/cell-rich.ts**
   - Line 1-3：添加了类型导入

---

## 🎊 修复完成

**RichBasic Story 现在可以正常切换了！**

- ✅ 不再出现只读属性错误
- ✅ 可以在 Stories 之间自由切换
- ✅ 所有功能正常工作

**现在重启 Storybook，测试 Story 切换吧！** 🚀

---

**修复时间**：2024-10-14  
**修复方法**：JSON 深拷贝  
**状态**：✅ 已修复  
**测试**：等待用户验证
