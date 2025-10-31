# 迁移到 uv 包管理器

## 📦 变更说明

项目已从 `venv + pip + requirements.txt` 迁移到 `uv + pyproject.toml`

### 主要变更

1. **新增文件**：`pyproject.toml` - 现代化的 Python 项目配置文件
2. **修改文件**：`start-backend.sh` - 使用 uv 管理依赖和运行
3. **保留文件**：`requirements.txt` - 暂时保留，方便向后兼容

## 🚀 使用方法

### 启动后端服务（不变）

```bash
./deployment-dev/start-backend.sh
```

脚本会自动：
- 检测并安装 uv（如果未安装）
- 从 `pyproject.toml` 同步依赖
- 自动创建虚拟环境（`.venv` 目录）
- 启动 FastAPI 服务

### 手动使用 uv 命令

```bash
cd backend

# 同步依赖（首次运行或更新依赖时）
uv sync

# 添加新依赖
uv add fastapi

# 添加开发依赖
uv add --dev pytest

# 运行 Python 脚本
uv run pivot_api.py
uv run order_api.py

# 运行 Python 命令
uv run python -c "print('Hello')"
```

## 🎯 uv 的优势

1. **极快速度** - 比 pip 快 10-100 倍
2. **自动管理虚拟环境** - 不需要手动创建 venv
3. **锁定依赖** - 自动生成 `uv.lock` 确保可重现性
4. **现代化** - 使用 `pyproject.toml` 标准格式
5. **统一工具** - 包管理、虚拟环境、运行脚本一体化

## 📝 文件说明

### pyproject.toml
```toml
[project]
dependencies = [
    "fastapi>=0.104.1",
    "uvicorn>=0.24.0",
    # ... 其他依赖
]
```

### 虚拟环境位置
- 旧方式：`backend/venv/`
- 新方式：`backend/.venv/` (由 uv 自动创建)

## 🔄 回退到旧方式

如果需要回退到 pip，仍然可以使用：

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python pivot_api.py
```

## 📚 更多信息

- uv 官方文档：https://docs.astral.sh/uv/
- uv GitHub：https://github.com/astral-sh/uv

