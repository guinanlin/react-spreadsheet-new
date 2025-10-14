# DtyInput 组件

一个基于 **shadcn/ui Input 组件**构建的增强型输入框组件，提供下拉建议、服务器端数据获取、防抖搜索等功能。

DtyInput 继承了 shadcn Input 组件的所有样式和功能，并在其基础上添加了智能建议、服务器端数据获取等高级特性。

## 特性

- ✅ 支持受控和非受控模式
- ✅ 可自定义宽度
- ✅ 内置清除按钮
- ✅ 下拉建议功能
- ✅ 服务器端数据获取
- ✅ 防抖搜索
- ✅ 键盘导航（↑↓ Enter Esc）
- ✅ 多种建议项类型（normal、bold、multiline、action）
- ✅ 可自定义下拉框宽度和位置
- ✅ 调试模式
- ✅ TypeScript 支持

## 安装

确保项目已安装以下依赖：

```bash
npm install lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
```

## 架构说明

### 组件层次结构

```
DtyInput (增强型输入框)
  └── shadcn Input (基础输入框)
        └── <input> (原生 HTML)
```

DtyInput 组件基于 shadcn 的 Input 组件构建，保留了其所有样式和行为，同时添加了：
- 智能下拉建议
- 服务器端数据获取
- 防抖搜索
- 键盘导航
- 清除按钮

## 配置

### 1. Tailwind CSS 配置

在 `tailwind.config.js` 中配置内容路径和主题：

```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

### 2. 导入全局样式

在你的应用入口文件中导入全局样式：

```tsx
import '@/dtyinput/styles/globals.css';
```

## 基本用法

### 简单输入框

```tsx
import { DtyInput } from '@/dtyinput';

function MyComponent() {
  return <DtyInput placeholder="请输入内容" />;
}
```

### 受控模式

```tsx
import { DtyInput } from '@/dtyinput';
import { useState } from 'react';

function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <DtyInput
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="请输入内容"
    />
  );
}
```

### 带建议功能

```tsx
import { DtyInput, SuggestionItem } from '@/dtyinput';

function MyComponent() {
  const suggestions: SuggestionItem[] = [
    { id: '1', type: 'normal', content: 'Apple', value: 'apple' },
    { id: '2', type: 'normal', content: 'Banana', value: 'banana' },
    { id: '3', type: 'bold', content: 'Cherry', value: 'cherry' },
    {
      id: '4',
      type: 'multiline',
      content: ['Durian', '榴莲 - 水果之王'],
      value: 'durian',
    },
    { id: '5', type: 'action', content: '添加新项', icon: 'plus' },
  ];

  return (
    <DtyInput
      placeholder="选择水果"
      showSuggestions={true}
      suggestions={suggestions}
      onSuggestionSelect={(item) => {
        console.log('选择了:', item);
      }}
    />
  );
}
```

### 服务器端数据获取

```tsx
import { DtyInput, SuggestionItem } from '@/dtyinput';

function MyComponent() {
  const fetchSuggestions = async (query: string): Promise<SuggestionItem[]> => {
    const response = await fetch(`/api/suggestions?q=${query}`);
    const data = await response.json();
    return data;
  };

  return (
    <DtyInput
      placeholder="搜索..."
      showSuggestions={true}
      fetchFromServer={true}
      fetchSuggestions={fetchSuggestions}
      debounceTime={300}
    />
  );
}
```

## API

### DtyInputProps

| 属性                  | 类型                                              | 默认值  | 描述                                       |
| --------------------- | ------------------------------------------------- | ------- | ------------------------------------------ |
| width                 | `string \| number`                                | `250`   | 输入框宽度                                 |
| showSuggestions       | `boolean`                                         | `false` | 是否显示建议下拉框                         |
| suggestions           | `SuggestionItem[]`                                | `[]`    | 建议列表（客户端模式）                     |
| onSuggestionSelect    | `(item: SuggestionItem) => void`                  | -       | 选择建议项的回调                           |
| maxNormalSuggestions  | `number`                                          | `8`     | 最多显示的普通建议数量                     |
| debug                 | `boolean`                                         | `false` | 是否开启调试模式                           |
| fetchFromServer       | `boolean`                                         | `false` | 是否从服务器获取建议                       |
| fetchSuggestions      | `(query: string) => Promise<SuggestionItem[]>`   | -       | 从服务器获取建议的函数                     |
| debounceTime          | `number`                                          | `300`   | 防抖时间（毫秒）                           |
| dropdownWidth         | `string \| number`                                | -       | 下拉框宽度（默认与输入框相同）             |
| positionAbove         | `boolean`                                         | `false` | 下拉框是否显示在输入框上方                 |

### SuggestionItem

| 属性     | 类型                                           | 描述                     |
| -------- | ---------------------------------------------- | ------------------------ |
| id       | `string`                                       | 唯一标识                 |
| type     | `'normal' \| 'bold' \| 'multiline' \| 'action'` | 建议项类型               |
| content  | `string \| string[]`                           | 显示内容                 |
| value    | `string`                                       | 实际值（可选）           |
| icon     | `'plus' \| 'search'`                           | 图标（仅 action 类型）   |
| stockUom | `string`                                       | 库存单位（可选）         |
| extra    | `any`                                          | 额外数据（可选）         |

## 建议项类型

### normal - 普通文本

```tsx
{ id: '1', type: 'normal', content: 'Apple', value: 'apple' }
```

### bold - 加粗文本

```tsx
{ id: '2', type: 'bold', content: 'Important Item', value: 'important' }
```

### multiline - 多行文本

```tsx
{
  id: '3',
  type: 'multiline',
  content: ['第一行', '第二行', '第三行'],
  value: 'multiline-item'
}
```

### action - 操作按钮

```tsx
{ id: '4', type: 'action', content: '添加新项', icon: 'plus' }
{ id: '5', type: 'action', content: '搜索更多', icon: 'search' }
```

## 键盘导航

- **↑/↓**: 上下选择建议项
- **Enter**: 确认选择当前高亮项
- **Esc**: 关闭下拉框
- **Backspace/Delete**: 当输入为空时，显示下拉框
- **双击**: 当输入为空时，显示下拉框

## onChange 事件增强

当选择建议项时，`onChange` 事件会传递一个增强的事件对象：

```tsx
<DtyInput
  onChange={(e) => {
    console.log(e.target.value);        // 实际值
    console.log(e.target.displayValue); // 显示值
    console.log(e.target._originalItem); // 完整的建议项对象
  }}
/>
```

## 调试模式

开启调试模式可以在控制台查看详细的日志信息：

```tsx
<DtyInput debug={true} />
```

## 样式定制

组件使用 Tailwind CSS 和 CSS 变量，可以通过修改 CSS 变量来定制样式：

```css
:root {
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --radius: 0.5rem;
}
```

## Storybook 示例

查看 Storybook 以了解更多使用示例：

```bash
npm run storybook
```

## License

MIT

