# 课程开发组件 - 快速上手

> 5 分钟快速了解和使用课程开发组件库 [[memory:7778158]]

## 🎯 这是什么？

一个专业的课程开发和管理组件库，帮助您快速构建在线教育平台。

**核心功能：**
- 📝 课程信息编辑
- 📚 课程列表管理
- 🗂️ 课程大纲/章节管理
- 🔄 课程开发流程图（可视化）
- 🔧 丰富的工具函数

---

## ⚡ 3 分钟集成

### 第 1 步：导入组件

```tsx
import { CourseEditor, CourseList, CourseOutline } from '@/subject-development';
import type { Course, CourseChapter } from '@/subject-development';
```

### 第 2 步：准备数据

```tsx
const myCourse: Course = {
  id: '1',
  title: 'React 进阶教程',
  description: '深入学习 React 新特性',
  category: '前端开发',
  status: 'draft',
  author: { id: '1', name: '张三' },
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### 第 3 步：使用组件

```tsx
function MyPage() {
  const [course, setCourse] = useState(myCourse);

  return (
    <CourseEditor
      course={course}
      onChange={setCourse}
      onSave={async (course) => {
        // 保存到后端
        await fetch('/api/courses', {
          method: 'POST',
          body: JSON.stringify(course),
        });
      }}
    />
  );
}
```

**搞定！** 🎉

---

## 📦 四大核心组件

### 1️⃣ CourseEditor - 课程编辑器

用于编辑课程基本信息。

```tsx
<CourseEditor
  course={course}
  onChange={(updated) => setCourse(updated)}
  onSave={handleSave}
/>
```

**关键 Props：**
- `course` - 课程数据
- `onChange` - 变化回调
- `onSave` - 保存回调
- `readonly` - 只读模式

---

### 2️⃣ CourseList - 课程列表

展示和管理课程列表。

```tsx
<CourseList
  courses={courses}
  selectedId={selectedId}
  onSelect={(course) => setSelected(course)}
  onDelete={(id) => handleDelete(id)}
/>
```

**关键 Props：**
- `courses` - 课程数组
- `onSelect` - 选中回调
- `onDelete` - 删除回调
- `loading` - 加载状态

---

### 3️⃣ CourseOutline - 课程大纲

管理课程的章节结构。

```tsx
<CourseOutline
  chapters={chapters}
  onChange={(updated) => setChapters(updated)}
  editable
  draggable
/>
```

**关键 Props：**
- `chapters` - 章节数组
- `onChange` - 变化回调
- `editable` - 可编辑
- `draggable` - 可拖拽

---

### 4️⃣ CourseFlow - 课程开发流程图

可视化的课程开发流程管理（基于 React Flow）。

```tsx
<CourseFlow
  editable
  showControls
  showMinimap
  height={1200}
  onNodeClick={(node) => console.log(node)}
/>
```

**关键 Props：**
- `editable` - 可编辑（拖拽节点）
- `showControls` - 显示控制按钮
- `showMinimap` - 显示小地图
- `height` - 组件高度
- `onNodeClick` - 节点点击回调

**⚠️ 依赖要求：** 使用此组件需要安装 `@xyflow/react`：
```bash
npm install @xyflow/react
```

---

## 🛠️ 实用工具函数

### 格式化时长

```tsx
import { formatDuration } from '@/subject-development';

formatDuration(90);  // "1小时30分钟"
formatDuration(45);  // "45分钟"
```

### 验证课程标题

```tsx
import { validateCourseTitle } from '@/subject-development';

const result = validateCourseTitle('我的课程');
if (!result.valid) {
  alert(result.error);
}
```

### 计算课程总时长

```tsx
import { calculateCourseDuration } from '@/subject-development';

const totalMinutes = calculateCourseDuration(chapters);
console.log(formatDuration(totalMinutes));
```

---

## 🎨 查看所有示例

运行 Storybook 查看所有组件的交互示例：

```bash
npm run storybook
```

然后访问：
- `SubjectDevelopment/CourseEditor` - 7 个示例
- `SubjectDevelopment/CourseList` - 9 个示例
- `SubjectDevelopment/CourseOutline` - 10 个示例

---

## 📖 完整示例

查看 `USAGE_EXAMPLE.tsx` 文件，里面有一个完整的课程管理页面实现，包含：

- ✅ 课程列表加载
- ✅ 课程创建/编辑
- ✅ 课程删除
- ✅ 章节管理
- ✅ 统计信息展示
- ✅ 错误处理

---

## 🔍 目录结构

```
src/subject-development/
├── components/         # 3 个组件
├── hooks/             # 1 个自定义 Hook
├── lib/               # 工具函数库
├── stories/           # 26 个 Storybook 示例
├── types.ts           # 13 个类型定义
├── index.ts           # 统一导出
└── README.md          # 详细文档
```

详见 `STRUCTURE.md` 文件。

---

## 💡 进阶用法

### 使用表单 Hook

```tsx
import { useCourseForm } from '@/subject-development';

function MyComponent() {
  const { 
    course, 
    errors, 
    handleChange, 
    handleSubmit 
  } = useCourseForm({
    initialCourse: myCourse,
    onSubmit: async (course) => {
      await api.saveCourse(course);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={course.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      {errors.title && <span>{errors.title}</span>}
    </form>
  );
}
```

---

## 📚 更多资源

- **详细文档**：查看 `README.md`
- **类型定义**：查看 `types.ts`
- **完整示例**：查看 `USAGE_EXAMPLE.tsx`
- **目录说明**：查看 `STRUCTURE.md`

---

## 🚀 开始开发

现在您已经了解了基础用法，可以开始构建您的课程管理系统了！

**下一步建议：**

1. 在 Storybook 中体验各个组件
2. 阅读 `USAGE_EXAMPLE.tsx` 了解完整流程
3. 根据需求自定义样式和功能
4. 集成到您的项目中

**祝开发愉快！** 🎉

---

**文档更新**：2024-10-12  
**版本**：v0.1.0 (基础版本)

