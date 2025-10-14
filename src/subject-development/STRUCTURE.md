# 课程开发组件 - 目录结构

```
src/subject-development/
├── components/              # 组件实现
│   ├── CourseEditor.tsx    # 课程编辑器组件
│   ├── CourseList.tsx      # 课程列表组件
│   └── CourseOutline.tsx   # 课程大纲组件
│
├── hooks/                   # 自定义 Hooks
│   └── use-course-form.ts  # 课程表单管理 Hook
│
├── lib/                     # 工具函数库
│   └── utils.ts            # 通用工具函数（cn, 格式化等）
│
├── stories/                 # Storybook 示例
│   ├── CourseEditor.stories.tsx
│   ├── CourseList.stories.tsx
│   └── CourseOutline.stories.tsx
│
├── index.ts                 # 统一导出入口
├── types.ts                 # TypeScript 类型定义
├── README.md                # 组件文档
├── USAGE_EXAMPLE.tsx        # 完整使用示例
└── STRUCTURE.md            # 本文件 - 目录结构说明
```

## 📂 目录说明

### `/components` - 组件实现

存放所有 React 组件的实现代码。

**已实现：**
- ✅ `CourseEditor.tsx` - 课程基本信息编辑器
- ✅ `CourseList.tsx` - 课程列表展示
- ✅ `CourseOutline.tsx` - 课程大纲/章节管理
- ✅ `CourseFlow.tsx` - 课程开发流程图（React Flow）

**待实现：**
- [ ] `LessonEditor.tsx` - 课程内容编辑器（支持富文本/Markdown）
- [ ] `CourseSettings.tsx` - 课程设置（价格、标签、难度等）
- [ ] `ResourceManager.tsx` - 课程资源管理
- [ ] `CoursePreview.tsx` - 课程预览组件

---

### `/hooks` - 自定义 Hooks

封装可复用的业务逻辑。

**已实现：**
- ✅ `use-course-form.ts` - 课程表单管理（验证、提交等）

**待实现：**
- [ ] `use-course-api.ts` - 课程 API 调用封装
- [ ] `use-chapter-drag.ts` - 章节拖拽排序
- [ ] `use-course-autosave.ts` - 自动保存功能
- [ ] `use-course-history.ts` - 编辑历史/撤销重做

---

### `/lib` - 工具函数库

通用的辅助函数，不依赖 React。

**已实现：**
- ✅ `utils.ts` - 包含：
  - `cn()` - className 合并（Tailwind）
  - `generateId()` - 生成唯一 ID
  - `formatDuration()` - 时长格式化
  - `calculateCourseDuration()` - 计算总时长
  - `validateCourseTitle()` - 标题验证
  - `formatFileSize()` - 文件大小格式化
  - `getCourseStatusText()` - 状态文案
  - `getCourseLevelText()` - 难度文案
  - `deepClone()` - 深拷贝
  - `sortChapters()` - 章节排序

**待实现：**
- [ ] `validation.ts` - 更多验证规则
- [ ] `constants.ts` - 常量定义
- [ ] `api-client.ts` - API 客户端封装

---

### `/stories` - Storybook 示例

展示组件的各种使用场景和交互状态。

**已实现：**
- ✅ `CourseEditor.stories.tsx` - 7 个 Story
- ✅ `CourseList.stories.tsx` - 9 个 Story
- ✅ `CourseOutline.stories.tsx` - 10 个 Story
- ✅ `CourseFlow.stories.tsx` - 9 个 Story

每个 Story 文件都包含：
- 默认状态
- 不同数据状态
- 交互式示例
- 边界情况（空状态、加载中等）

---

### 根目录文件

- **`index.ts`** - 统一导出入口，外部通过这个文件导入所有内容
- **`types.ts`** - 所有 TypeScript 类型定义
- **`README.md`** - 组件库文档（API、示例、最佳实践）
- **`USAGE_EXAMPLE.tsx`** - 完整的课程管理页面示例
- **`STRUCTURE.md`** - 本文件

---

## 🎯 使用方式

### 1. 导入组件

```typescript
import { 
  CourseEditor, 
  CourseList, 
  CourseOutline 
} from '@/subject-development';
```

### 2. 导入类型

```typescript
import type { 
  Course, 
  CourseChapter, 
  CourseEditorProps 
} from '@/subject-development';
```

### 3. 导入工具函数

```typescript
import { 
  formatDuration, 
  validateCourseTitle 
} from '@/subject-development';
```

### 4. 导入 Hooks

```typescript
import { useCourseForm } from '@/subject-development';
```

---

## 📊 统计信息

- **总文件数**：13 个
- **组件数**：4 个（已实现）
- **类型定义**：16 个接口/类型
- **工具函数**：10 个
- **自定义 Hook**：1 个
- **Story 示例**：35 个

---

## 🚀 下一步计划

1. **完善编辑器功能**
   - 集成富文本编辑器（如 TipTap 或 Slate）
   - 支持 Markdown 模式
   - 添加代码高亮

2. **增强交互体验**
   - 实现拖拽排序（react-dnd）
   - 添加键盘快捷键
   - 优化移动端体验

3. **数据管理**
   - 集成状态管理（Zustand 或 Redux）
   - 实现数据缓存
   - 添加离线支持

4. **性能优化**
   - 虚拟滚动（react-window）
   - 懒加载
   - 代码分割

5. **测试覆盖**
   - 单元测试（Vitest）
   - 集成测试
   - E2E 测试（Playwright）

---

## 📝 贡献提示

添加新组件时，请确保：

1. 在 `components/` 创建组件文件
2. 在 `types.ts` 定义 Props 类型
3. 在 `stories/` 创建至少 3 个 Story
4. 在 `index.ts` 导出组件和类型
5. 在 `README.md` 更新文档

参考现有组件的实现风格保持一致性。

---

**创建时间**：2024-10-12  
**维护者**：Subject Development Team

