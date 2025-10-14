# 课程开发组件库

> 专业的课程开发和管理组件集合

## 📦 组件概览

- **CourseEditor** - 课程编辑器
- **CourseList** - 课程列表展示
- **CourseOutline** - 课程大纲/目录
- **CourseFlow** - 课程开发流程图（React Flow）
- **LessonEditor** - 课程内容编辑器（待实现）
- **CourseSettings** - 课程设置（待实现）

---

## 🚀 快速开始

### 安装

```bash
npm install @your-org/subject-development
```

### 依赖要求

如果您需要使用 **CourseFlow** 组件（课程开发流程图），需要额外安装 React Flow：

```bash
npm install @xyflow/react
```

**注意**：React Flow v12+ 使用新的包名 `@xyflow/react`

其他组件无需额外依赖。

### 基本使用

```tsx
import { CourseEditor, CourseList, CourseOutline } from '@/subject-development';

function App() {
  const [course, setCourse] = useState(myCourse);

  return (
    <div>
      {/* 课程编辑器 */}
      <CourseEditor
        course={course}
        onChange={setCourse}
        onSave={async (course) => {
          await api.saveCourse(course);
        }}
      />

      {/* 课程列表 */}
      <CourseList
        courses={courses}
        onSelect={(course) => console.log(course)}
        onDelete={(id) => handleDelete(id)}
      />

      {/* 课程大纲 */}
      <CourseOutline
        chapters={course.chapters}
        editable
        draggable
      />
    </div>
  );
}
```

---

## 📖 组件文档

### CourseEditor - 课程编辑器

用于创建和编辑课程基本信息。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `course` | `Course \| undefined` | - | 课程数据 |
| `onChange` | `(course: Course) => void` | - | 课程变化回调 |
| `onSave` | `(course: Course) => Promise<void>` | - | 保存回调 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `debug` | `boolean` | `false` | 调试模式 |

#### 示例

```tsx
<CourseEditor
  course={{
    id: '1',
    title: 'React 进阶教程',
    description: '深入学习 React 高级特性',
    category: '前端开发',
    status: 'draft',
    author: { id: '1', name: '张三' },
    createdAt: new Date(),
    updatedAt: new Date(),
  }}
  onChange={(course) => console.log('课程更新:', course)}
  onSave={async (course) => {
    await fetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  }}
/>
```

---

### CourseList - 课程列表

展示课程列表，支持选择和删除操作。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `courses` | `Course[]` | - | 课程列表数据 |
| `selectedId` | `string` | - | 选中的课程 ID |
| `onSelect` | `(course: Course) => void` | - | 选中回调 |
| `onDelete` | `(courseId: string) => void` | - | 删除回调 |
| `loading` | `boolean` | `false` | 是否加载中 |
| `emptyText` | `string` | `'暂无课程'` | 空状态文案 |

#### 示例

```tsx
<CourseList
  courses={[
    {
      id: '1',
      title: 'TypeScript 入门',
      description: '从零开始学习 TypeScript',
      category: '编程',
      status: 'published',
      author: { id: '1', name: '李四' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // ... 更多课程
  ]}
  selectedId="1"
  onSelect={(course) => console.log('选中:', course)}
  onDelete={(id) => {
    if (confirm('确定删除？')) {
      handleDelete(id);
    }
  }}
/>
```

---

### CourseOutline - 课程大纲

展示和管理课程的章节结构。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `chapters` | `CourseChapter[]` | - | 章节数据 |
| `onChange` | `(chapters: CourseChapter[]) => void` | - | 章节变化回调 |
| `draggable` | `boolean` | `false` | 是否可拖拽排序 |
| `editable` | `boolean` | `false` | 是否可编辑 |
| `expandedIds` | `string[]` | - | 展开的章节 ID（受控） |
| `onToggleExpand` | `(chapterId: string) => void` | - | 展开/收起回调 |

#### 示例

```tsx
<CourseOutline
  chapters={[
    {
      id: '1',
      title: 'React 基础',
      description: '了解 React 核心概念',
      order: 1,
      lessons: [
        {
          id: '1-1',
          title: 'JSX 语法',
          content: '...',
          type: 'video',
          duration: 30,
          order: 1,
        },
        {
          id: '1-2',
          title: '组件和 Props',
          content: '...',
          type: 'text',
          duration: 20,
          order: 2,
        },
      ],
    },
    // ... 更多章节
  ]}
  editable
  draggable
  onChange={(chapters) => console.log('大纲更新:', chapters)}
/>
```

---

### CourseFlow - 课程开发流程图

可视化的课程开发流程管理工具，基于 React Flow 实现。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `initialNodes` | `Node[]` | 默认流程 | 初始节点数据 |
| `initialEdges` | `Edge[]` | 默认连接 | 初始边数据 |
| `editable` | `boolean` | `false` | 是否可编辑（拖拽、连接） |
| `onNodesChange` | `(nodes: Node[]) => void` | - | 节点变化回调 |
| `onEdgesChange` | `(edges: Edge[]) => void` | - | 边变化回调 |
| `onNodeClick` | `(node: Node) => void` | - | 节点点击回调 |
| `onNodeDoubleClick` | `(node: Node) => void` | - | 节点双击回调 |
| `height` | `string \| number` | `600` | 组件高度 |
| `showControls` | `boolean` | `true` | 显示控制按钮 |
| `showMinimap` | `boolean` | `true` | 显示小地图 |

#### 示例

```tsx
<CourseFlow
  editable
  showControls
  showMinimap
  height={1200}
  onNodeClick={(node) => {
    console.log('点击节点:', node.data.label);
  }}
  onNodeDoubleClick={(node) => {
    // 打开编辑对话框
    openEditDialog(node);
  }}
/>
```

#### 默认流程

组件内置了标准的课程开发流程，包含 4 个主要阶段：

1. **学习目标设定** - 目标群体分析、学习成果设定、评估标准定义
2. **课程内容规划** - 课程模块设计、教学方法选择、教学时间安排
3. **课程教学设计** - 教学策略设计、学习活动设计、教学评价方案设计
4. **课程资料制作** - 教学PPT制作、习题与案例设计、课件录制与编辑

#### 节点状态

- `pending` - 待处理（灰色）
- `in-progress` - 进行中（蓝色）
- `completed` - 已完成（绿色）
- `blocked` - 被阻塞（红色）

---

## 🎨 类型定义

### Course - 课程

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  cover?: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}
```

### CourseChapter - 章节

```typescript
interface CourseChapter {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
}
```

### CourseLesson - 小节

```typescript
interface CourseLesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'practice';
  duration?: number; // 分钟
  order: number;
  resources?: LessonResource[];
}
```

---

## 🛠️ 工具函数

### formatDuration

格式化时长（分钟转为小时分钟）

```typescript
formatDuration(90) // "1小时30分钟"
formatDuration(45) // "45分钟"
```

### calculateCourseDuration

计算课程总时长

```typescript
const totalMinutes = calculateCourseDuration(chapters)
```

### validateCourseTitle

验证课程标题

```typescript
const result = validateCourseTitle('我的课程')
// { valid: true }

const result = validateCourseTitle('')
// { valid: false, error: '课程标题不能为空' }
```

### getCourseStatusText

获取课程状态中文文案

```typescript
getCourseStatusText('draft') // "草稿"
getCourseStatusText('published') // "已发布"
```

---

## 🎯 开发计划

### 已完成 ✅

- [x] 基础类型定义
- [x] CourseEditor 组件
- [x] CourseList 组件
- [x] CourseOutline 组件
- [x] 工具函数库
- [x] 基础文档

### 待实现 📝

- [ ] LessonEditor 组件（课程内容编辑器）
- [ ] CourseSettings 组件（课程设置）
- [ ] 拖拽排序功能
- [ ] 富文本编辑器集成
- [ ] 视频上传和管理
- [ ] 课程导入/导出
- [ ] 更多 Storybook 示例

---

## 📝 贡献指南

请参考项目根目录的 `DEVELOPMENT_WORKFLOW.md` 文件。

---

## 📄 许可证

MIT License

