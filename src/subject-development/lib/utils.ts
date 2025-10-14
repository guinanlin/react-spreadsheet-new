/**
 * 课程开发组件 - 工具函数
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Course, CourseChapter, CourseLesson } from "../types"

/**
 * 合并 className（用于 Tailwind CSS）
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 格式化时长（分钟转为小时分钟）
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

/**
 * 计算课程总时长
 */
export function calculateCourseDuration(chapters: CourseChapter[]): number {
  return chapters.reduce((total, chapter) => {
    const chapterDuration = chapter.lessons.reduce((sum, lesson) => {
      return sum + (lesson.duration || 0)
    }, 0)
    return total + chapterDuration
  }, 0)
}

/**
 * 验证课程标题
 */
export function validateCourseTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: '课程标题不能为空' }
  }
  if (title.length < 3) {
    return { valid: false, error: '课程标题至少需要3个字符' }
  }
  if (title.length > 100) {
    return { valid: false, error: '课程标题不能超过100个字符' }
  }
  return { valid: true }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * 课程状态中文映射
 */
export function getCourseStatusText(status: Course['status']): string {
  const statusMap = {
    draft: '草稿',
    published: '已发布',
    archived: '已归档',
  }
  return statusMap[status] || status
}

/**
 * 课程难度中文映射
 */
export function getCourseLevelText(level: 'beginner' | 'intermediate' | 'advanced'): string {
  const levelMap = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  }
  return levelMap[level] || level
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 课程数据排序（按章节和小节的 order 字段）
 */
export function sortChapters(chapters: CourseChapter[]): CourseChapter[] {
  return chapters
    .sort((a, b) => a.order - b.order)
    .map(chapter => ({
      ...chapter,
      lessons: chapter.lessons.sort((a, b) => a.order - b.order),
    }))
}

