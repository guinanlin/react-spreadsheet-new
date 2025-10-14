# 课程开发组件 - 更新日志

所有值得注意的更改都将记录在此文件中。

---

## [v0.1.0] - 2024-10-12

### ✨ 新增功能

#### 组件（4 个）
- ✅ **CourseEditor** - 课程基本信息编辑器
  - 支持标题、描述、分类、状态编辑
  - 只读模式
  - 保存功能（异步）
  - 表单验证
  
- ✅ **CourseList** - 课程列表组件
  - 卡片式展示
  - 选中高亮
  - 删除确认
  - 加载骨架屏
  - 空状态展示
  
- ✅ **CourseOutline** - 课程大纲组件
  - 章节树形展示
  - 展开/收起交互
  - 小节列表
  - 时长统计
  - 资源数量显示
  
- ✅ **CourseFlow** - 课程开发流程图 🆕
  - 基于 React Flow 实现
  - 可视化流程管理
  - 4 个主要阶段（学习目标设定、内容规划、教学设计、资料制作）
  - 16 个子任务节点
  - 节点状态管理（待处理/进行中/已完成/被阻塞）
  - 可编辑模式（拖拽、连接）
  - 控制按钮和小地图
  - 自定义节点样式

#### 类型定义（16 个）
- `Course` - 课程基础信息
- `CourseStatus` - 课程状态
- `CourseChapter` - 章节
- `CourseLesson` - 小节
- `LessonType` - 小节类型
- `LessonResource` - 课程资源
- `CourseEditorProps` - 编辑器 Props
- `CourseListProps` - 列表 Props
- `CourseOutlineProps` - 大纲 Props
- `CourseFlowProps` - 流程图 Props 🆕
- `LessonEditorProps` - 内容编辑器 Props
- `CourseSettingsProps` - 设置 Props
- `ToolbarConfig` - 工具栏配置
- `CourseSettings` - 课程设置
- `FlowNodeType` - 流程节点类型 🆕
- `FlowNodeStatus` - 流程节点状态 🆕
- `FlowNodeData` - 流程节点数据 🆕

#### 工具函数（10 个）
- `cn()` - className 合并
- `generateId()` - 生成唯一 ID
- `formatDuration()` - 时长格式化
- `calculateCourseDuration()` - 计算总时长
- `validateCourseTitle()` - 标题验证
- `formatFileSize()` - 文件大小格式化
- `getCourseStatusText()` - 状态文案
- `getCourseLevelText()` - 难度文案
- `deepClone()` - 深拷贝
- `sortChapters()` - 章节排序

#### 自定义 Hooks（1 个）
- `useCourseForm` - 课程表单管理 Hook
  - 表单验证
  - 状态管理
  - 提交处理

#### Storybook 示例（35 个）
- CourseEditor.stories.tsx - 7 个 Story
- CourseList.stories.tsx - 9 个 Story
- CourseOutline.stories.tsx - 10 个 Story
- **CourseFlow.stories.tsx - 9 个 Story** 🆕
  - Default - 默认流程图
  - Editable - 可编辑模式
  - Minimal - 精简模式
  - WithProgress - 进度展示
  - SimpleFlow - 简化流程
  - CustomHeight - 自定义高度
  - Interactive - 交互示例
  - DebugMode - 调试模式
  - HorizontalLayout - 水平布局

### 📚 文档
- ✅ `README.md` - 完整的 API 文档
- ✅ `QUICK_START.md` - 快速上手指南
- ✅ `STRUCTURE.md` - 目录结构说明
- ✅ `USAGE_EXAMPLE.tsx` - 完整示例代码
- ✅ `INSTALLATION.md` - 安装指南 🆕
- ✅ `CHANGELOG.md` - 更新日志 🆕

### 🎨 样式特性
- Tailwind CSS 集成
- 响应式设计
- 深色/浅色主题准备
- 流畅的过渡动画
- Hover 交互效果

### 📦 依赖
- React >= 18.0.0
- clsx - className 工具
- tailwind-merge - Tailwind 合并
- **@xyflow/react >= 12.0.0** - CourseFlow 组件依赖 🆕

---

## 🎯 下一步计划

### 待实现组件
- [ ] LessonEditor - 富文本/Markdown 内容编辑器
- [ ] CourseSettings - 课程设置（价格、标签、难度）
- [ ] ResourceManager - 文件上传和资源管理
- [ ] CoursePreview - 课程预览

### 待实现功能
- [ ] 拖拽排序（react-dnd 集成）
- [ ] 富文本编辑器（TipTap 或 Slate）
- [ ] 自动保存
- [ ] 历史记录/撤销重做
- [ ] 课程导入/导出
- [ ] 协作编辑

### 性能优化
- [ ] 虚拟滚动（react-window）
- [ ] 懒加载
- [ ] 数据缓存
- [ ] Code splitting

### 测试
- [ ] 单元测试（Vitest）
- [ ] 集成测试
- [ ] E2E 测试（Playwright）

---

## 📊 统计信息

- **总文件数**：14 个
- **代码行数**：约 3000+ 行
- **组件数**：4 个
- **类型定义**：16 个
- **工具函数**：10 个
- **自定义 Hook**：1 个
- **Story 示例**：35 个
- **文档页数**：6 个

---

## 🙏 致谢

感谢以下开源项目：

- [React Flow](https://reactflow.dev/) - 流程图可视化
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [shadcn/ui](https://ui.shadcn.com/) - 组件设计参考
- [Storybook](https://storybook.js.org/) - 组件文档

---

**发布日期**：2024-10-12  
**版本**：v0.1.0 (初始版本)  
**维护者**：Subject Development Team

