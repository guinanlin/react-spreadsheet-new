/**
 * 课程开发组件 - 完整使用示例
 * 
 * 这个文件展示了如何在实际项目中使用课程开发组件库
 */

import React, { useState, useEffect } from 'react';
import {
  CourseEditor,
  CourseList,
  CourseOutline,
  type Course,
  type CourseChapter,
  generateId,
  calculateCourseDuration,
  formatDuration,
  validateCourseTitle,
} from './index';

/**
 * 完整的课程管理页面示例
 */
export function CourseManagementPage() {
  // 状态管理
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'outline'>('info');

  // 加载课程列表
  useEffect(() => {
    loadCourses();
  }, []);

  // 模拟 API 调用
  const loadCourses = async () => {
    setLoading(true);
    try {
      // 实际项目中这里应该是真实的 API 调用
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('加载课程失败:', error);
      // 使用模拟数据
      setCourses(mockCourses);
    } finally {
      setLoading(false);
    }
  };

  // 创建新课程
  const handleCreateCourse = () => {
    const newCourse: Course = {
      id: generateId(),
      title: '新课程',
      description: '',
      category: '',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: 'current-user',
        name: '当前用户',
      },
    };
    setSelectedCourse(newCourse);
    setChapters([]);
    setActiveTab('info');
  };

  // 选中课程
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    // 加载课程章节
    loadChapters(course.id);
  };

  // 加载课程章节
  const loadChapters = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/chapters`);
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error('加载章节失败:', error);
      setChapters([]);
    }
  };

  // 保存课程
  const handleSaveCourse = async (course: Course) => {
    // 验证标题
    const validation = validateCourseTitle(course.title);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const method = course.id.startsWith('new') ? 'POST' : 'PUT';
      const url = method === 'POST' 
        ? '/api/courses' 
        : `/api/courses/${course.id}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        alert('课程保存成功！');
        loadCourses();
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    }
  };

  // 删除课程
  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCourses(courses.filter(c => c.id !== courseId));
        if (selectedCourse?.id === courseId) {
          setSelectedCourse(null);
        }
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 更新章节
  const handleUpdateChapters = async (updatedChapters: CourseChapter[]) => {
    setChapters(updatedChapters);

    if (selectedCourse) {
      try {
        await fetch(`/api/courses/${selectedCourse.id}/chapters`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedChapters),
        });
      } catch (error) {
        console.error('更新章节失败:', error);
      }
    }
  };

  // 计算统计信息
  const statistics = selectedCourse && chapters.length > 0 ? {
    totalChapters: chapters.length,
    totalLessons: chapters.reduce((sum, ch) => sum + ch.lessons.length, 0),
    totalDuration: calculateCourseDuration(chapters),
  } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">课程管理</h1>
          <p className="text-gray-600 mt-2">创建和管理您的在线课程</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 左侧：课程列表 */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">我的课程</h2>
                <button
                  onClick={handleCreateCourse}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  + 新建课程
                </button>
              </div>

              <CourseList
                courses={courses}
                selectedId={selectedCourse?.id}
                onSelect={handleSelectCourse}
                onDelete={handleDeleteCourse}
                loading={loading}
                emptyText="还没有创建任何课程"
              />
            </div>
          </div>

          {/* 右侧：课程详情 */}
          <div className="col-span-8">
            {selectedCourse ? (
              <div className="bg-white rounded-lg shadow-sm">
                {/* 选项卡 */}
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === 'info'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    基本信息
                  </button>
                  <button
                    onClick={() => setActiveTab('outline')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === 'outline'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    课程大纲
                  </button>
                </div>

                {/* 内容区域 */}
                <div className="p-6">
                  {activeTab === 'info' ? (
                    <CourseEditor
                      course={selectedCourse}
                      onChange={setSelectedCourse}
                      onSave={handleSaveCourse}
                    />
                  ) : (
                    <div>
                      {/* 统计信息 */}
                      {statistics && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex gap-6 text-sm">
                            <div>
                              <span className="text-gray-600">章节数：</span>
                              <span className="font-semibold text-gray-900">
                                {statistics.totalChapters}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">课时数：</span>
                              <span className="font-semibold text-gray-900">
                                {statistics.totalLessons}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">总时长：</span>
                              <span className="font-semibold text-gray-900">
                                {formatDuration(statistics.totalDuration)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 课程大纲 */}
                      <CourseOutline
                        chapters={chapters}
                        onChange={handleUpdateChapters}
                        editable
                        draggable
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  未选择课程
                </h3>
                <p className="text-gray-600">
                  从左侧列表选择一个课程，或创建新课程
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 模拟数据
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React 18 进阶教程',
    description: '深入学习 React 18 新特性',
    category: '前端开发',
    status: 'published',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-01'),
    author: { id: '1', name: '张三' },
  },
  {
    id: '2',
    title: 'TypeScript 完全指南',
    description: '从零开始学习 TypeScript',
    category: '编程语言',
    status: 'draft',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-09-15'),
    author: { id: '2', name: '李四' },
  },
];

export default CourseManagementPage;

