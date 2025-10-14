import type { Meta, StoryObj } from '@storybook/react';
import { CourseEditor } from '../components/CourseEditor';
import type { Course } from '../types';

const mockCourse: Course = {
  id: '1',
  title: 'React 进阶教程',
  description: '深入学习 React 18 的新特性，包括并发渲染、Suspense、Server Components 等高级主题。',
  cover: 'https://picsum.photos/400/200',
  category: '前端开发',
  status: 'draft',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-10-12'),
  author: {
    id: 'author-1',
    name: '张三',
    avatar: 'https://i.pravatar.cc/150?u=author-1',
  },
};

const meta: Meta<typeof CourseEditor> = {
  title: 'SubjectDevelopment/CourseEditor',
  component: CourseEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    readonly: { control: 'boolean' },
    debug: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CourseEditor>;

/**
 * 默认状态 - 可编辑课程
 */
export const Default: Story = {
  args: {
    course: mockCourse,
    onChange: (course) => {
      console.log('课程更新:', course);
    },
  },
};

/**
 * 新建课程 - 空状态
 */
export const NewCourse: Story = {
  args: {
    course: {
      id: 'new',
      title: '',
      description: '',
      category: '',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: 'current-user',
        name: '当前用户',
      },
    },
    onChange: (course) => {
      console.log('新课程:', course);
    },
  },
};

/**
 * 只读模式 - 查看课程
 */
export const ReadOnly: Story = {
  args: {
    course: mockCourse,
    readonly: true,
  },
};

/**
 * 带保存功能
 */
export const WithSave: Story = {
  args: {
    course: mockCourse,
    onChange: (course) => {
      console.log('课程更新:', course);
    },
    onSave: async (course) => {
      console.log('保存课程:', course);
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('课程保存成功！');
    },
  },
};

/**
 * 调试模式
 */
export const DebugMode: Story = {
  args: {
    course: mockCourse,
    debug: true,
    onChange: (course) => {
      console.log('课程更新:', course);
    },
  },
};

/**
 * 已发布的课程
 */
export const PublishedCourse: Story = {
  args: {
    course: {
      ...mockCourse,
      status: 'published',
      title: 'TypeScript 完全指南',
      description: '从入门到精通，掌握 TypeScript 的核心概念和高级用法。',
      category: '编程语言',
    },
  },
};

/**
 * 无数据状态
 */
export const NoCourse: Story = {
  args: {
    course: undefined,
  },
};

