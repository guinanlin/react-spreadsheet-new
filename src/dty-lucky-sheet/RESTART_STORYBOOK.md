# 🔄 重启 Storybook

## 当前状态

已安装的依赖：
- ✅ immer
- ✅ lodash
- ✅ numeral
- ✅ dayjs  
- ✅ fast-formula-parser
- ✅ tiny-emitter
- ✅ @formulajs/formulajs
- ✅ chevrotain

已复制的文件：
- ✅ core/ (所有核心模块)
- ✅ components/ (所有组件)
- ✅ context/
- ✅ hooks/
- ✅ formula-parser/

---

## 重启步骤

### 1. 停止当前的 Storybook

按 **Ctrl+C** 停止

### 2. 重新启动

```bash
pnpm run dev
```

### 3. 访问测试

```
http://localhost:6006/?path=/story/dtyluckysheet-features--basic
```

---

## 如果还有错误

查看错误信息，通常是：
1. 缺少某个npm包 → 安装它
2. 找不到某个文件 → 复制它
3. 导入路径错误 → 运行修复脚本

### 安装缺失的包

```bash
pnpm add <package-name>
```

### 运行修复脚本

```bash
node scripts/fix-all-imports.js
```

---

## 预期结果

重启后应该能看到：
- ✅ Storybook 正常启动
- ✅ DtyLuckySheet 组件加载
- ✅ 所有功能可用

现在重启 Storybook 吧！
