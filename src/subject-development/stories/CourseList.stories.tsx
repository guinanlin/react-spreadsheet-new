import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CourseList } from '../components/CourseList';
import type { Course } from '../types';

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React 18 进阶教程',
    description: '深入学习 React 18 的新特性，包括并发渲染、Suspense、Server Components 等。掌握现代 React 开发的最佳实践。',
    cover: 'https://picsum.photos/400/200?1',
    category: '前端开发',
    status: 'published',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-01'),
    author: {
      id: 'author-1',
      name: '张三',
      avatar: 'https://i.pravatar.cc/150?u=author-1',
    },
  },
  {
    id: '2',
    title: 'TypeScript 完全指南',
    description: '从零开始学习 TypeScript，涵盖基础类型、泛型、装饰器等核心概念。',
    category: '编程语言',
    status: 'draft',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-09-15'),
    author: {
      id: 'author-2',
      name: '李四',
      avatar: 'https://i.pravatar.cc/150?u=author-2',
    },
  },
  {
    id: '3',
    title: 'Node.js 后端开发实战',
    description: '使用 Node.js 和 Express 构建 RESTful API，学习数据库设计、身份验证等后端开发技能。',
    category: '后端开发',
    status: 'published',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-10-05'),
    author: {
      id: 'author-1',
      name: '张三',
      avatar: 'https://i.pravatar.cc/150?u=author-1',
    },
  },
  {
    id: '4',
    title: 'Vue 3 组合式 API',
    description: 'Vue 3 Composition API 详解，对比 Options API，学习新的开发范式。',
    category: '前端开发',
    status: 'archived',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-05-20'),
    author: {
      id: 'author-3',
      name: '王五',
      avatar: 'https://i.pravatar.cc/150?u=author-3',
    },
  },
  {
    id: '5',
    title: 'Python 数据分析',
    description: '使用 Pandas、NumPy 和 Matplotlib 进行数据分析和可视化。',
    category: '数据科学',
    status: 'published',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-10-10'),
    author: {
      id: 'author-2',
      name: '李四',
      avatar: 'https://i.pravatar.cc/150?u=author-2',
    },
  },
];

const meta: Meta<typeof CourseList> = {
  title: 'SubjectDevelopment/CourseList',
  component: CourseList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CourseList>;

/**
 * 默认状态 - 展示课程列表
 */
export const Default: Story = {
  args: {
    courses: mockCourses,
    onSelect: (course) => {
      console.log('选中课程:', course);
    },
  },
};

/**
 * 带选中状态
 */
export const WithSelection: Story = {
  args: {
    courses: mockCourses,
    selectedId: '2',
    onSelect: (course) => {
      console.log('选中课程:', course);
    },
  },
};

/**
 * 可删除课程
 */
export const WithDelete: Story = {
  args: {
    courses: mockCourses,
    onSelect: (course) => {
      console.log('选中课程:', course);
    },
    onDelete: (courseId) => {
      console.log('删除课程:', courseId);
    },
  },
};

/**
 * 交互式示例 - 完整功能
 */
export const Interactive: Story = {
  render: () => {
    const [courses, setCourses] = useState(mockCourses);
    const [selectedId, setSelectedId] = useState<string | undefined>();

    return (
      <CourseList
        courses={courses}
        selectedId={selectedId}
        onSelect={(course) => setSelectedId(course.id)}
        onDelete={(courseId) => {
          setCourses(courses.filter(c => c.id !== courseId));
          if (selectedId === courseId) {
            setSelectedId(undefined);
          }
        }}
      />
    );
  },
};

/**
 * 加载中状态
 */
export const Loading: Story = {
  args: {
    courses: [],
    loading: true,
  },
};

/**
 * 空状态 - 无课程
 */
export const Empty: Story = {
  args: {
    courses: [],
    emptyText: '还没有创建任何课程，点击右上角"新建课程"开始吧',
  },
};

/**
 * 单个课程
 */
export const SingleCourse: Story = {
  args: {
    courses: [mockCourses[0]],
    selectedId: '1',
    onSelect: (course) => {
      console.log('选中课程:', course);
    },
  },
};

/**
 * 只有草稿课程
 */
export const DraftOnly: Story = {
  args: {
    courses: mockCourses.filter(c => c.status === 'draft'),
    onSelect: (course) => {
      console.log('选中课程:', course);
    },
  },
};

