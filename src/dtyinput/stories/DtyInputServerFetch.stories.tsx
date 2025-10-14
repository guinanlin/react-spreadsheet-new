import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { DtyInput } from '../components/DtyInput';
import { SuggestionItem } from '../types';
import '../styles/globals.css';

const meta: Meta<typeof DtyInput> = {
  title: 'DtyInput/Server Fetch',
  component: DtyInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
演示 DtyInput 从服务器获取建议数据的功能。

## 特性

- 支持异步数据获取
- 内置防抖功能（默认 300ms）
- 显示加载状态
- 错误处理

## 使用方法

\`\`\`tsx
const fetchSuggestions = async (query: string) => {
  const response = await fetch(\`/api/suggestions?q=\${query}\`);
  const data = await response.json();
  return data;
};

<DtyInput
  fetchFromServer={true}
  fetchSuggestions={fetchSuggestions}
  debounceTime={300}
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

// 模拟 API 延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 模拟服务器数据
const mockData: { [key: string]: SuggestionItem[] } = {
  a: [
    { id: '1', type: 'normal', content: 'Apple', value: 'apple' },
    { id: '2', type: 'normal', content: 'Apricot', value: 'apricot' },
    { id: '3', type: 'normal', content: 'Avocado', value: 'avocado' },
  ],
  b: [
    { id: '4', type: 'normal', content: 'Banana', value: 'banana' },
    { id: '5', type: 'normal', content: 'Blueberry', value: 'blueberry' },
    { id: '6', type: 'normal', content: 'Blackberry', value: 'blackberry' },
  ],
  c: [
    { id: '7', type: 'normal', content: 'Cherry', value: 'cherry' },
    { id: '8', type: 'normal', content: 'Coconut', value: 'coconut' },
    { id: '9', type: 'normal', content: 'Cranberry', value: 'cranberry' },
  ],
};

// 模拟服务器请求函数
const mockFetchSuggestions = async (query: string): Promise<SuggestionItem[]> => {
  // 模拟网络延迟
  await delay(500);

  // 如果查询为空，返回所有数据
  if (!query) {
    return Object.values(mockData).flat().slice(0, 5);
  }

  // 根据首字母过滤
  const firstLetter = query.toLowerCase()[0];
  const results = mockData[firstLetter] || [];

  // 添加操作项
  const withAction = [
    ...results,
    { id: 'action', type: 'action' as const, content: '搜索更多结果', icon: 'search' as const },
  ];

  return withAction;
};

// 基本服务器获取
export const BasicServerFetch: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div>
        <p style={{ marginBottom: 10 }}>输入 a, b 或 c 开头的字母查看结果</p>
        <DtyInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="从服务器获取建议"
          showSuggestions={true}
          fetchFromServer={true}
          fetchSuggestions={mockFetchSuggestions}
          width={300}
          onSuggestionSelect={(item) => {
            if (item.type === 'action') {
              alert('执行搜索更多操作');
            }
          }}
        />
        <p style={{ marginTop: 10 }}>当前值: {value}</p>
      </div>
    );
  },
};

// 自定义防抖时间
export const CustomDebounceTime: Story = {
  render: () => {
    return (
      <div>
        <p style={{ marginBottom: 10 }}>防抖时间：800ms</p>
        <DtyInput
          placeholder="输入后 800ms 才会请求"
          showSuggestions={true}
          fetchFromServer={true}
          fetchSuggestions={mockFetchSuggestions}
          debounceTime={800}
          width={300}
        />
      </div>
    );
  },
};

// 带调试模式的服务器获取
export const ServerFetchWithDebug: Story = {
  render: () => {
    return (
      <div>
        <p style={{ marginBottom: 10 }}>打开控制台查看请求日志</p>
        <DtyInput
          placeholder="输入查看调试信息"
          showSuggestions={true}
          fetchFromServer={true}
          fetchSuggestions={mockFetchSuggestions}
          debug={true}
          width={300}
        />
      </div>
    );
  },
};

// 模拟搜索用户
const mockUserData: SuggestionItem[] = [
  {
    id: '1',
    type: 'multiline',
    content: ['张三', 'zhangsan@example.com'],
    value: 'user1',
    extra: { department: '研发部' },
  },
  {
    id: '2',
    type: 'multiline',
    content: ['李四', 'lisi@example.com'],
    value: 'user2',
    extra: { department: '市场部' },
  },
  {
    id: '3',
    type: 'multiline',
    content: ['王五', 'wangwu@example.com'],
    value: 'user3',
    extra: { department: '销售部' },
  },
];

const mockFetchUsers = async (query: string): Promise<SuggestionItem[]> => {
  await delay(300);

  if (!query) {
    return mockUserData;
  }

  // 简单的模糊搜索
  return mockUserData.filter((user) =>
    Array.isArray(user.content)
      ? user.content.some((line) => line.toLowerCase().includes(query.toLowerCase()))
      : user.content.toLowerCase().includes(query.toLowerCase())
  );
};

// 搜索用户示例
export const SearchUsers: Story = {
  render: () => {
    const [selectedUser, setSelectedUser] = useState<SuggestionItem | null>(null);

    return (
      <div>
        <p style={{ marginBottom: 10 }}>搜索用户</p>
        <DtyInput
          placeholder="输入用户名或邮箱"
          showSuggestions={true}
          fetchFromServer={true}
          fetchSuggestions={mockFetchUsers}
          width={350}
          onSuggestionSelect={(item) => {
            setSelectedUser(item);
          }}
        />
        {selectedUser && (
          <div style={{ marginTop: 10, padding: 10, background: '#f5f5f5', borderRadius: 4 }}>
            <p>
              <strong>已选择：</strong>
            </p>
            <p>ID: {selectedUser.id}</p>
            <p>值: {selectedUser.value}</p>
            {selectedUser.extra && <p>部门: {selectedUser.extra.department}</p>}
          </div>
        )}
      </div>
    );
  },
};

// 错误处理示例
export const ErrorHandling: Story = {
  render: () => {
    const fetchWithError = async (query: string): Promise<SuggestionItem[]> => {
      await delay(300);
      // 模拟随机错误
      if (Math.random() > 0.5) {
        throw new Error('模拟网络错误');
      }
      return mockFetchSuggestions(query);
    };

    return (
      <div>
        <p style={{ marginBottom: 10 }}>50% 概率触发错误，错误时返回空列表</p>
        <DtyInput
          placeholder="测试错误处理"
          showSuggestions={true}
          fetchFromServer={true}
          fetchSuggestions={fetchWithError}
          debug={true}
          width={300}
        />
      </div>
    );
  },
};

