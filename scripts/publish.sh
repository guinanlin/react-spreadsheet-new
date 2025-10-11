#!/bin/bash

# ==============================================
# React Spreadsheet CLI 发布脚本
# ==============================================
# 
# 用途：自动化 CLI 工具的发布流程
# 1. 同步组件模板到 packages/components/
# 2. 构建 CLI 工具
# 3. 发布到 npm
#
# 使用方法：
#   ./scripts/publish.sh [patch|minor|major]
#   默认为 patch 版本
# ==============================================

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 辅助函数：打印带颜色的消息
info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# 辅助函数：确认操作
confirm() {
    local prompt="$1"
    local default="${2:-n}"
    
    if [ "$default" = "y" ]; then
        prompt="$prompt [Y/n]: "
    else
        prompt="$prompt [y/N]: "
    fi
    
    read -p "$(echo -e ${YELLOW}${prompt}${NC})" response
    response=${response:-$default}
    
    case "$response" in
        [yY][eE][sS]|[yY]) 
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# 获取版本类型参数
VERSION_TYPE=${1:-patch}

# 验证版本类型
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major|prepatch|preminor|premajor|prerelease)$ ]]; then
    error "无效的版本类型: $VERSION_TYPE"
    echo "支持的版本类型: patch, minor, major, prepatch, preminor, premajor, prerelease"
    exit 1
fi

echo ""
echo "========================================"
echo "  React Spreadsheet CLI 发布流程"
echo "========================================"
echo ""

# 步骤 0：检查工作目录
info "检查工作目录..."
if [ ! -f "package.json" ]; then
    error "请在项目根目录运行此脚本"
    exit 1
fi
success "工作目录正确"

# 步骤 1：检查 Git 状态
info "检查 Git 状态..."
if [ -n "$(git status --porcelain)" ]; then
    warning "工作区有未提交的更改"
    git status --short
    echo ""
    if ! confirm "是否继续？"; then
        error "已取消发布"
        exit 1
    fi
fi
success "Git 状态检查完成"

# 步骤 2：拉取最新代码
info "拉取最新代码..."
git pull origin $(git branch --show-current) || {
    error "拉取代码失败"
    exit 1
}
success "代码已更新"

# 步骤 3：运行同步脚本
echo ""
info "开始同步组件模板..."
npm run sync-templates || {
    error "同步模板失败"
    exit 1
}
success "组件模板同步完成"

# 步骤 4：检查 CLI 包
echo ""
info "检查 CLI 包..."
if [ ! -d "packages/cli" ]; then
    error "找不到 packages/cli 目录"
    exit 1
fi
success "CLI 目录存在"

# 步骤 5：进入 CLI 目录
cd packages/cli

# 获取当前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")
info "当前版本: $CURRENT_VERSION"

# 步骤 6：清理并安装依赖
info "安装依赖..."
npm install || {
    error "依赖安装失败"
    cd ../..
    exit 1
}
success "依赖安装完成"

# 步骤 7：构建 CLI
echo ""
info "开始构建 CLI..."
npm run build || {
    error "构建失败"
    cd ../..
    exit 1
}
success "CLI 构建完成"

# 步骤 8：检查构建产物
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
    error "构建产物不完整"
    cd ../..
    exit 1
fi
success "构建产物验证通过"

# 步骤 9：版本确认
echo ""
info "准备更新版本..."
info "版本类型: $VERSION_TYPE"

# 预览新版本号
NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version --dry-run | grep -oE '[0-9]+\.[0-9]+\.[0-9]+(-.*)?')
warning "即将发布: $CURRENT_VERSION → $NEW_VERSION"
echo ""

if ! confirm "确认发布新版本？" "y"; then
    error "已取消发布"
    cd ../..
    exit 1
fi

# 步骤 10：更新版本号
echo ""
info "更新版本号..."
npm version $VERSION_TYPE --no-git-tag-version || {
    error "版本更新失败"
    cd ../..
    exit 1
}
success "版本号已更新: $NEW_VERSION"

# 步骤 11：提交更改到 Git
echo ""
info "提交更改到 Git..."
cd ../..
git add packages/cli/package.json packages/cli/package-lock.json packages/components/
git commit -m "chore(cli): release v$NEW_VERSION" || {
    warning "没有需要提交的更改或提交失败"
}

# 创建 Git 标签
info "创建 Git 标签..."
git tag -a "cli-v$NEW_VERSION" -m "CLI Release v$NEW_VERSION" || {
    warning "标签创建失败（可能已存在）"
}
success "Git 提交和标签完成"

# 步骤 12：发布到 npm
echo ""
warning "准备发布到 npm..."
if ! confirm "确认发布到 npm？" "y"; then
    error "已取消发布"
    exit 1
fi

cd packages/cli
info "发布到 npm..."
npm publish --access public || {
    error "npm 发布失败"
    cd ../..
    exit 1
}
success "成功发布到 npm!"

# 步骤 13：推送到 Git
echo ""
cd ../..
info "推送到远程仓库..."
git push origin $(git branch --show-current) || {
    warning "推送代码失败"
}
git push origin "cli-v$NEW_VERSION" || {
    warning "推送标签失败"
}
success "代码和标签已推送"

# 完成
echo ""
echo "========================================"
success "发布完成！"
echo "========================================"
echo ""
info "包名: @goodhawk/react-spreadsheet-cli"
info "版本: v$NEW_VERSION"
info "安装命令: npm install -g @goodhawk/react-spreadsheet-cli"
echo ""
info "查看发布: https://www.npmjs.com/package/@goodhawk/react-spreadsheet-cli"
echo ""

