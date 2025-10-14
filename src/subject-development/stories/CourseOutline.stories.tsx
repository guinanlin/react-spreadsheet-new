import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CourseOutline } from '../components/CourseOutline';
import type { CourseChapter } from '../types';

const mockChapters: CourseChapter[] = [
  {
    id: 'chapter-1',
    title: 'React 基础入门',
    description: '了解 React 的核心概念和基础用法',
    order: 1,
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'React 简介与环境搭建',
        content: 'React 是一个用于构建用户界面的 JavaScript 库...',
        type: 'video',
        duration: 25,
        order: 1,
        resources: [
          {
            id: 'res-1',
            name: '课程笔记.pdf',
            type: 'pdf',
            url: '/files/notes.pdf',
            size: 1024 * 500,
          },
        ],
      },
      {
        id: 'lesson-1-2',
        title: 'JSX 语法详解',
        content: 'JSX 是 JavaScript 的语法扩展...',
        type: 'text',
        duration: 20,
        order: 2,
      },
      {
        id: 'lesson-1-3',
        title: '组件与 Props',
        content: '组件是 React 的核心概念...',
        type: 'video',
        duration: 30,
        order: 3,
        resources: [
          {
            id: 'res-2',
            name: '示例代码.zip',
            type: 'other',
            url: '/files/code.zip',
            size: 1024 * 1024 * 2,
          },
          {
            id: 'res-3',
            name: '参考文档',
            type: 'link',
            url: 'https://react.dev',
          },
        ],
      },
    ],
  },
  {
    id: 'chapter-2',
    title: 'State 与生命周期',
    description: '深入理解组件状态管理和生命周期',
    order: 2,
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'useState Hook',
        content: 'useState 是最常用的 Hook...',
        type: 'video',
        duration: 35,
        order: 1,
      },
      {
        id: 'lesson-2-2',
        title: 'useEffect Hook',
        content: 'useEffect 用于处理副作用...',
        type: 'video',
        duration: 40,
        order: 2,
      },
      {
        id: 'lesson-2-3',
        title: '实战练习：Todo List',
        content: '使用 State 构建一个 Todo 应用...',
        type: 'practice',
        duration: 60,
        order: 3,
      },
    ],
  },
  {
    id: 'chapter-3',
    title: '事件处理与表单',
    order: 3,
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'React 事件系统',
        content: 'React 使用合成事件...',
        type: 'text',
        duration: 15,
        order: 1,
      },
      {
        id: 'lesson-3-2',
        title: '表单处理',
        content: '受控组件与非受控组件...',
        type: 'video',
        duration: 30,
        order: 2,
      },
      {
        id: 'lesson-3-3',
        title: '表单验证',
        content: '实现表单验证逻辑...',
        type: 'video',
        duration: 25,
        order: 3,
      },
      {
        id: 'lesson-3-4',
        title: '章节测验',
        content: '测试你对事件和表单的理解...',
        type: 'quiz',
        duration: 20,
        order: 4,
      },
    ],
  },
  {
    id: 'chapter-4',
    title: '高级主题',
    description: 'Context API、性能优化、自定义 Hooks',
    order: 4,
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'Context API',
        content: 'Context 提供了一种跨组件传递数据的方式...',
        type: 'video',
        duration: 35,
        order: 1,
      },
      {
        id: 'lesson-4-2',
        title: 'React.memo 与 useMemo',
        content: '性能优化的常用手段...',
        type: 'video',
        duration: 30,
        order: 2,
      },
      {
        id: 'lesson-4-3',
        title: '自定义 Hooks',
        content: '封装和复用逻辑...',
        type: 'video',
        duration: 40,
        order: 3,
      },
      {
        id: 'lesson-4-4',
        title: '期末项目',
        content: '综合运用所学知识完成项目...',
        type: 'assignment',
        duration: 120,
        order: 4,
      },
    ],
  },
];

const meta: Meta<typeof CourseOutline> = {
  title: 'SubjectDevelopment/CourseOutline',
  component: CourseOutline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    draggable: { control: 'boolean' },
    editable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CourseOutline>;

/**
 * 默认状态 - 只读展示
 */
export const Default: Story = {
  args: {
    chapters: mockChapters,
  },
};

/**
 * 可编辑模式
 */
export const Editable: Story = {
  args: {
    chapters: mockChapters,
    editable: true,
    onChange: (chapters) => {
      console.log('大纲更新:', chapters);
    },
  },
};

/**
 * 可拖拽排序
 */
export const Draggable: Story = {
  args: {
    chapters: mockChapters,
    draggable: true,
    editable: true,
    onChange: (chapters) => {
      console.log('大纲更新:', chapters);
    },
  },
};

/**
 * 交互式示例 - 完整功能
 */
export const Interactive: Story = {
  render: () => {
    const [chapters, setChapters] = useState(mockChapters);
    const [expandedIds, setExpandedIds] = useState<string[]>(['chapter-1', 'chapter-2']);

    return (
      <div>
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            💡 提示：点击章节标题展开/收起，点击编辑按钮可编辑内容
          </p>
        </div>
        <CourseOutline
          chapters={chapters}
          expandedIds={expandedIds}
          editable
          draggable
          onChange={(newChapters) => {
            console.log('大纲更新:', newChapters);
            setChapters(newChapters);
          }}
          onToggleExpand={(chapterId) => {
            setExpandedIds(prev =>
              prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
            );
          }}
        />
      </div>
    );
  },
};

/**
 * 空状态 - 无章节
 */
export const Empty: Story = {
  args: {
    chapters: [],
    editable: true,
  },
};

/**
 * 单章节
 */
export const SingleChapter: Story = {
  args: {
    chapters: [mockChapters[0]],
    editable: true,
  },
};

/**
 * 部分展开
 */
export const PartiallyExpanded: Story = {
  args: {
    chapters: mockChapters,
    expandedIds: ['chapter-1', 'chapter-3'],
  },
};

/**
 * 全部收起
 */
export const AllCollapsed: Story = {
  args: {
    chapters: mockChapters,
    expandedIds: [],
  },
};

/**
 * 简单章节（少量小节）
 */
export const SimpleChapters: Story = {
  args: {
    chapters: [
      {
        id: 'chapter-1',
        title: '快速入门',
        order: 1,
        lessons: [
          {
            id: 'lesson-1',
            title: '第一课',
            content: '...',
            type: 'video',
            duration: 10,
            order: 1,
          },
        ],
      },
      {
        id: 'chapter-2',
        title: '进阶学习',
        order: 2,
        lessons: [
          {
            id: 'lesson-2',
            title: '第二课',
            content: '...',
            type: 'text',
            order: 1,
          },
        ],
      },
    ],
    editable: true,
  },
};

