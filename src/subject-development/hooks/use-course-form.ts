/**
 * 课程表单管理 Hook
 * 用于处理课程创建和编辑的表单逻辑
 */

import { useState, useCallback } from 'react';
import type { Course } from '../types';
import { validateCourseTitle, generateId } from '../lib/utils';

interface UseCourseFormOptions {
  initialCourse?: Course;
  onSubmit?: (course: Course) => Promise<void>;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  category?: string;
}

/**
 * 课程表单管理 Hook
 * 
 * @example
 * ```tsx
 * const { course, errors, handleChange, handleSubmit, isSubmitting } = useCourseForm({
 *   initialCourse: myCourse,
 *   onSubmit: async (course) => {
 *     await api.saveCourse(course);
 *   }
 * });
 * ```
 */
export function useCourseForm(options: UseCourseFormOptions = {}) {
  const { initialCourse, onSubmit } = options;

  // 创建默认课程
  const createDefaultCourse = (): Course => ({
    id: generateId(),
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
  });

  const [course, setCourse] = useState<Course>(initialCourse || createDefaultCourse());
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  /**
   * 验证表单
   */
  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // 验证标题
    const titleValidation = validateCourseTitle(course.title);
    if (!titleValidation.valid) {
      newErrors.title = titleValidation.error;
    }

    // 验证描述
    if (course.description.length > 1000) {
      newErrors.description = '课程描述不能超过1000个字符';
    }

    // 验证分类
    if (!course.category || course.category.trim().length === 0) {
      newErrors.category = '请选择课程分类';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [course]);

  /**
   * 更新字段值
   */
  const handleChange = useCallback(
    <K extends keyof Course>(field: K, value: Course[K]) => {
      setCourse((prev) => ({
        ...prev,
        [field]: value,
        updatedAt: new Date(),
      }));
      setIsDirty(true);

      // 清除该字段的错误
      if (errors[field as keyof ValidationErrors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  /**
   * 批量更新字段
   */
  const handleBatchChange = useCallback((updates: Partial<Course>) => {
    setCourse((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
    setIsDirty(true);
  }, []);

  /**
   * 提交表单
   */
  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return false;
    }

    if (!onSubmit) {
      return true;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(course);
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error('提交失败:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [course, validate, onSubmit]);

  /**
   * 重置表单
   */
  const handleReset = useCallback(() => {
    setCourse(initialCourse || createDefaultCourse());
    setErrors({});
    setIsDirty(false);
  }, [initialCourse]);

  return {
    course,
    errors,
    isDirty,
    isSubmitting,
    handleChange,
    handleBatchChange,
    handleSubmit,
    handleReset,
    validate,
  };
}

