/**
 * 课程开发组件 - TypeScript 类型定义
 */

import React from 'react';

// ============================================
// 基础数据类型
// ============================================

/**
 * 课程基础信息
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  cover?: string;
  category: string;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

/**
 * 课程状态
 */
export type CourseStatus = 'draft' | 'published' | 'archived';

/**
 * 课程章节
 */
export interface CourseChapter {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
}

/**
 * 课程小节
 */
export interface CourseLesson {
  id: string;
  title: string;
  content: string;
  type: LessonType;
  duration?: number; // 分钟
  order: number;
  resources?: LessonResource[];
}

/**
 * 课程小节类型
 */
export type LessonType = 'video' | 'text' | 'quiz' | 'assignment' | 'practice';

/**
 * 课程资源
 */
export interface LessonResource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'link' | 'other';
  url: string;
  size?: number; // bytes
}

// ============================================
// 组件 Props 接口
// ============================================

/**
 * 课程编辑器组件 Props
 */
export interface CourseEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 课程数据 */
  course?: Course;
  /** 课程变化回调 */
  onChange?: (course: Course) => void;
  /** 保存回调 */
  onSave?: (course: Course) => Promise<void>;
  /** 是否只读 */
  readonly?: boolean;
  /** 是否显示调试信息 */
  debug?: boolean;
}

/**
 * 课程列表组件 Props
 */
export interface CourseListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 课程列表数据 */
  courses: Course[];
  /** 选中的课程 ID */
  selectedId?: string;
  /** 选中回调 */
  onSelect?: (course: Course) => void;
  /** 删除回调 */
  onDelete?: (courseId: string) => void;
  /** 是否加载中 */
  loading?: boolean;
  /** 空状态文案 */
  emptyText?: string;
}

/**
 * 课程大纲组件 Props
 */
export interface CourseOutlineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 章节数据 */
  chapters: CourseChapter[];
  /** 章节变化回调 */
  onChange?: (chapters: CourseChapter[]) => void;
  /** 是否可拖拽排序 */
  draggable?: boolean;
  /** 是否可编辑 */
  editable?: boolean;
  /** 展开的章节 ID 列表 */
  expandedIds?: string[];
  /** 展开/收起回调 */
  onToggleExpand?: (chapterId: string) => void;
}

/**
 * 课程内容编辑器 Props
 */
export interface LessonEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 小节数据 */
  lesson?: CourseLesson;
  /** 小节变化回调 */
  onChange?: (lesson: CourseLesson) => void;
  /** 支持的编辑器类型 */
  editorType?: 'rich-text' | 'markdown' | 'code';
  /** 工具栏配置 */
  toolbar?: ToolbarConfig;
  /** 是否全屏 */
  fullscreen?: boolean;
}

/**
 * 工具栏配置
 */
export interface ToolbarConfig {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  heading?: boolean;
  list?: boolean;
  link?: boolean;
  image?: boolean;
  code?: boolean;
  video?: boolean;
}

/**
 * 课程设置组件 Props
 */
export interface CourseSettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 课程 ID */
  courseId: string;
  /** 设置数据 */
  settings: CourseSettings;
  /** 设置变化回调 */
  onChange?: (settings: CourseSettings) => void;
  /** 保存回调 */
  onSave?: (settings: CourseSettings) => Promise<void>;
}

/**
 * 课程设置数据
 */
export interface CourseSettings {
  /** 是否公开 */
  isPublic: boolean;
  /** 价格（0 表示免费） */
  price: number;
  /** 标签 */
  tags: string[];
  /** 难度等级 */
  level: 'beginner' | 'intermediate' | 'advanced';
  /** 语言 */
  language: string;
  /** 证书设置 */
  certificate?: {
    enabled: boolean;
    template?: string;
  };
}

// ============================================
// 课程开发流程相关类型
// ============================================

/**
 * 流程节点类型
 */
export type FlowNodeType = 'main' | 'sub';

/**
 * 流程节点状态
 */
export type FlowNodeStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';

/**
 * 流程节点数据
 */
export interface FlowNodeData extends Record<string, unknown> {
  /** 节点标签 */
  label: string;
  /** 节点类型 */
  type: FlowNodeType;
  /** 节点状态 */
  status?: FlowNodeStatus;
  /** 节点描述 */
  description?: string;
  /** 是否可编辑 */
  editable?: boolean;
  /** 自定义数据 */
  metadata?: Record<string, any>;
}

/**
 * 课程开发流程组件 Props
 */
export interface CourseFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 初始节点数据 */
  initialNodes?: any[];
  /** 初始边数据 */
  initialEdges?: any[];
  /** 是否可编辑 */
  editable?: boolean;
  /** 节点变化回调 */
  onNodesChange?: (nodes: any[]) => void;
  /** 边变化回调 */
  onEdgesChange?: (edges: any[]) => void;
  /** 节点点击回调 */
  onNodeClick?: (node: any) => void;
  /** 节点双击回调 */
  onNodeDoubleClick?: (node: any) => void;
  /** 高度 */
  height?: string | number;
  /** 是否显示控制按钮 */
  showControls?: boolean;
  /** 是否显示小地图 */
  showMinimap?: boolean;
  /** 调试模式 */
  debug?: boolean;
}

