/**
 * 课程开发组件库 - 统一导出入口
 */

// ============================================
// 导出组件
// ============================================
export { CourseEditor } from './components/CourseEditor';
export { CourseList } from './components/CourseList';
export { CourseOutline } from './components/CourseOutline';
export { CourseFlow } from './components/CourseFlow';
export { PlaceholderNode } from './components/PlaceholderNode';

// ============================================
// 导出 Hooks
// ============================================
export { useCourseForm } from './hooks/use-course-form';

// ============================================
// 导出工具函数
// ============================================
export {
  cn,
  generateId,
  formatDuration,
  calculateCourseDuration,
  validateCourseTitle,
  formatFileSize,
  getCourseStatusText,
  getCourseLevelText,
  deepClone,
  sortChapters,
} from './lib/utils';

// ============================================
// 导出类型
// ============================================
export type {
  // 基础数据类型
  Course,
  CourseStatus,
  CourseChapter,
  CourseLesson,
  LessonType,
  LessonResource,
  
  // 组件 Props
  CourseEditorProps,
  CourseListProps,
  CourseOutlineProps,
  LessonEditorProps,
  CourseSettingsProps,
  CourseFlowProps,
  
  // 配置类型
  ToolbarConfig,
  CourseSettings,
  
  // 流程相关类型
  FlowNodeType,
  FlowNodeStatus,
  FlowNodeData,
} from './types';

