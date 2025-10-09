<div align="center">
  <img src="https://raw.githubusercontent.com/iddan/react-spreadsheet/master/assets/logo.svg?sanitize=true" height="120">
</div>

# React Spreadsheet

Simple, customizable yet performant spreadsheet for React.

![Screenshot](https://github.com/iddan/react-spreadsheet/blob/master/assets/screenshot.png?raw=true)
[![CI](https://github.com/iddan/react-spreadsheet/workflows/CI/badge.svg?branch=master)](https://github.com/iddan/react-spreadsheet/actions/workflows/ci.yaml?query=branch%3Amaster)

**原作者 (Original Author):** Iddan Aaronsohn <mail@aniddan.com>

## 安装 (Installation)

```bash
npm install react react-dom scheduler react-spreadsheet
```

_或者 (or)_

```bash
pnpm add react react-dom scheduler react-spreadsheet
```

_或者 (or)_

```bash
yarn add react react-dom scheduler react-spreadsheet
```

## 快速开始 (Quick Start)

### 前端开发 (Frontend Development)

推荐使用 pnpm 进行依赖管理和开发：

```bash
# 安装依赖 (Install dependencies)
pnpm install

# 启动开发服务器 (Start development server)
pnpm dev

# 运行测试 (Run tests)
pnpm test

# 构建项目 (Build project)
pnpm build
```

开发服务器将在 http://localhost:6006 启动 Storybook。

### 后端开发 (Backend Development)

后端使用 FastAPI 提供透视表功能，基于 DuckDB 进行高性能服务端计算。

**环境要求：**
- Python 3.9+
- 无需 Conda 环境（使用 uv 自动管理依赖）

**快速启动：**

```bash
# 运行启动脚本（会自动安装 uv 并配置环境）
./deployment-dev/start-backend.sh
```

启动脚本会自动：
- 检测并安装 uv（如果未安装）
- 同步 Python 依赖（从 pyproject.toml）
- 创建示例数据（如果不存在）
- 启动 FastAPI 服务器（默认端口：8126）

后端 API 文档：
- Swagger UI: http://localhost:8126/docs
- ReDoc: http://localhost:8126/redoc

**手动安装（可选）：**

如果需要手动安装依赖：

```bash
cd backend

# 安装 uv（如果未安装）
# Linux/macOS:
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows:
# powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 同步依赖
uv sync

# 运行服务器
uv run pivot_api.py
```


发布成功后，用户就可以这样使用了：

```bash
# 初始化
npx @goodhawk/react-spreadsheet-cli init

# 添加组件
npx @goodhawk/react-spreadsheet-cli add spreadsheet
npx @goodhawk/react-spreadsheet-cli add pivot-table
```

试试看吧！🚀

更多后端信息请参考 [backend/README.md](backend/README.md)

## 功能特性 (Features)

### 核心功能
- Simple straightforward API focusing on common use cases while keeping flexibility
- Performant (yet not virtualized)
- Implements Just Components™

### 透视表功能 (Pivot Table Features)
- 🚀 基于 DuckDB 的高性能服务端计算
- 📊 动态透视表配置和实时更新
- 🔍 多维度钻取和交互式展开/折叠
- 📤 多格式导出（CSV、Excel、PDF、JSON）
- 🎯 高级过滤和聚合功能
- ⚡ 结果缓存优化性能

## 资源链接 (Resources)

### [在线演示 (Demo)](https://iddan.github.io/react-spreadsheet)

### [文档 (Docs)](https://iddan.github.io/react-spreadsheet/docs)

### [Storybook](https://iddan.github.io/react-spreadsheet/storybook)

## 许可证 (License)

MIT License
