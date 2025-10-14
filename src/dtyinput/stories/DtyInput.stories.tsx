import type { Meta, StoryObj } from '@storybook/react';
import { DtyInput } from '../components/DtyInput';
import { SuggestionItem } from '../types';
import '../styles/globals.css';

const meta: Meta<typeof DtyInput> = {
  title: 'DtyInput/Basic',
  component: DtyInput,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#333333' },
      ],
    },
    docs: {
      description: {
        component: `
DtyInput 是一个增强的输入框组件，基于 shadcn/ui 构建，提供以下特性：

- 支持受控和非受控模式
- 可自定义宽度
- 内置清除按钮
- 支持下拉建议功能
- 支持服务器端数据获取
- 防抖搜索
- 键盘导航支持
- 调试模式

## 基本用法

\`\`\`tsx
import { DtyInput } from '@/dtyinput';

function MyComponent() {
  return <DtyInput placeholder="请输入内容" />;
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'number',
      description: '输入框宽度（像素或字符串）',
    },
    placeholder: {
      control: 'text',
      description: '占位符文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    showSuggestions: {
      control: 'boolean',
      description: '是否显示建议下拉框',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DtyInput>;

// 基本用法
export const Default: Story = {
  args: {
    placeholder: '请输入内容',
    width: 300,
  },
};

// 受控模式
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    
    return (
      <div>
        <DtyInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="受控输入框"
          width={300}
        />
        <p style={{ marginTop: 10 }}>当前值: {value}</p>
      </div>
    );
  },
};

// 带建议的输入框
export const WithSuggestions: Story = {
  render: () => {
    const suggestions: SuggestionItem[] = [
      { id: '1', type: 'normal', content: 'Apple', value: 'apple' },
      { id: '2', type: 'normal', content: 'Banana', value: 'banana' },
      { id: '3', type: 'normal', content: 'Cherry', value: 'cherry' },
      { id: '4', type: 'bold', content: 'Durian', value: 'durian' },
      { id: '5', type: 'multiline', content: ['Elderberry', 'Fresh from farm'], value: 'elderberry' },
    ];

    return (
      <DtyInput
        placeholder="选择水果"
        showSuggestions={true}
        suggestions={suggestions}
        width={300}
        onSuggestionSelect={(item) => console.log('选择了:', item)}
      />
    );
  },
};

// 不同宽度
export const DifferentWidths: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <DtyInput placeholder="200px 宽度" width={200} />
      <DtyInput placeholder="300px 宽度" width={300} />
      <DtyInput placeholder="400px 宽度" width={400} />
      <DtyInput placeholder="100% 宽度" width="100%" />
    </div>
  ),
};

// 禁用状态
export const Disabled: Story = {
  args: {
    placeholder: '禁用的输入框',
    disabled: true,
    width: 300,
  },
};

// 带默认值
export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'Hello World',
    placeholder: '请输入内容',
    width: 300,
  },
};

// 调试模式
export const DebugMode: Story = {
  args: {
    placeholder: '打开控制台查看日志',
    debug: true,
    showSuggestions: true,
    suggestions: [
      { id: '1', type: 'normal', content: 'Option 1', value: '1' },
      { id: '2', type: 'normal', content: 'Option 2', value: '2' },
    ],
    width: 300,
  },
};

// 需要添加 React import
import React from 'react';

