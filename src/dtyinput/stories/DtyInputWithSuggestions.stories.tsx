import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { DtyInput } from '../components/DtyInput';
import { SuggestionItem } from '../types';
import '../styles/globals.css';

const meta: Meta<typeof DtyInput> = {
  title: 'DtyInput/With Suggestions',
  component: DtyInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
DtyInput 组件的建议功能演示。

## 建议项类型

- **normal**: 普通文本
- **bold**: 加粗文本
- **multiline**: 多行文本（如地址）
- **action**: 操作按钮（带图标）

## 键盘导航

- **↑/↓**: 上下选择
- **Enter**: 确认选择
- **Esc**: 关闭下拉框
- **Backspace/Delete**: 清空时显示下拉框

## 示例

\`\`\`tsx
const suggestions = [
  { id: '1', type: 'normal', content: 'Apple', value: 'apple' },
  { id: '2', type: 'action', content: '添加新项', icon: 'plus' },
];

<DtyInput
  showSuggestions={true}
  suggestions={suggestions}
  onSuggestionSelect={(item) => console.log(item)}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DtyInput>;

// 基本建议
export const BasicSuggestions: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const suggestions: SuggestionItem[] = [
      { id: '1', type: 'normal', content: 'Apple', value: 'apple' },
      { id: '2', type: 'normal', content: 'Banana', value: 'banana' },
      { id: '3', type: 'normal', content: 'Cherry', value: 'cherry' },
      { id: '4', type: 'normal', content: 'Durian', value: 'durian' },
    ];

    return (
      <div>
        <DtyInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="双击或清空显示建议"
          showSuggestions={true}
          suggestions={suggestions}
          width={300}
          onSuggestionSelect={(item) => {
            console.log('选择了:', item);
          }}
        />
        <p style={{ marginTop: 10 }}>当前值: {value}</p>
      </div>
    );
  },
};

// 多种类型的建议
export const MixedTypeSuggestions: Story = {
  render: () => {
    const suggestions: SuggestionItem[] = [
      { id: '1', type: 'normal', content: '普通选项 1', value: 'option1' },
      { id: '2', type: 'bold', content: '加粗选项 2', value: 'option2' },
      {
        id: '3',
        type: 'multiline',
        content: ['多行选项 3', '这是第二行', '这是第三行'],
        value: 'option3',
      },
      { id: '4', type: 'action', content: '添加新项', icon: 'plus' },
      { id: '5', type: 'action', content: '搜索更多', icon: 'search' },
    ];

    return (
      <DtyInput
        placeholder="显示不同类型的建议"
        showSuggestions={true}
        suggestions={suggestions}
        width={350}
        onSuggestionSelect={(item) => {
          if (item.type === 'action') {
            alert(`执行操作: ${item.content}`);
          } else {
            console.log('选择了:', item);
          }
        }}
      />
    );
  },
};

// 限制建议数量
export const LimitedSuggestions: Story = {
  render: () => {
    const suggestions: SuggestionItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      type: 'normal' as const,
      content: `选项 ${i + 1}`,
      value: `option${i + 1}`,
    }));

    // 添加操作项
    suggestions.push({ id: 'action1', type: 'action', content: '添加新项', icon: 'plus' });

    return (
      <div>
        <p style={{ marginBottom: 10 }}>最多显示 5 个普通建议，操作项始终显示</p>
        <DtyInput
          placeholder="最多显示 5 个建议"
          showSuggestions={true}
          suggestions={suggestions}
          maxNormalSuggestions={5}
          width={300}
        />
      </div>
    );
  },
};

// 自定义下拉框宽度
export const CustomDropdownWidth: Story = {
  render: () => {
    const suggestions: SuggestionItem[] = [
      { id: '1', type: 'normal', content: '这是一个很长的建议项，需要更宽的下拉框', value: '1' },
      { id: '2', type: 'normal', content: '另一个很长的建议项', value: '2' },
    ];

    return (
      <DtyInput
        placeholder="下拉框宽度为 500px"
        showSuggestions={true}
        suggestions={suggestions}
        width={300}
        dropdownWidth={500}
      />
    );
  },
};

// 下拉框显示在上方
export const DropdownAbove: Story = {
  render: () => {
    const suggestions: SuggestionItem[] = [
      { id: '1', type: 'normal', content: 'Option 1', value: '1' },
      { id: '2', type: 'normal', content: 'Option 2', value: '2' },
      { id: '3', type: 'normal', content: 'Option 3', value: '3' },
    ];

    return (
      <div style={{ marginTop: 300 }}>
        <DtyInput
          placeholder="下拉框显示在上方"
          showSuggestions={true}
          suggestions={suggestions}
          width={300}
          positionAbove={true}
        />
      </div>
    );
  },
};

// 带库存单位的建议
export const WithStockUom: Story = {
  render: () => {
    const suggestions: SuggestionItem[] = [
      {
        id: '1',
        type: 'multiline',
        content: ['T恤 - 红色', 'SKU: TS001'],
        value: 'TS001',
        stockUom: 'M',
      },
      {
        id: '2',
        type: 'multiline',
        content: ['T恤 - 蓝色', 'SKU: TS002'],
        value: 'TS002',
        stockUom: 'L',
      },
      {
        id: '3',
        type: 'multiline',
        content: ['牛仔裤', 'SKU: JE001'],
        value: 'JE001',
        stockUom: '32',
      },
    ];

    return (
      <DtyInput
        placeholder="搜索产品"
        showSuggestions={true}
        suggestions={suggestions}
        width={350}
        onSuggestionSelect={(item) => {
          console.log('选择了:', item);
          console.log('尺码:', item.stockUom);
        }}
      />
    );
  },
};

