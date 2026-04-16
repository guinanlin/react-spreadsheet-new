# Storybook MCP 使用说明（含跨机器访问）

本文档说明：
- 本机（项目机器）如何启动 Storybook MCP
- 其他 Client 如何通过局域网 IP 连接你的 MCP
- 可选的 Chromatic 远程 MCP 连接方式

---

## 1. 本机启动 Storybook MCP

### 1.1 前置

`@storybook/addon-mcp` 已安装，并已在 `.storybook/main.ts` 的 `addons` 中注册。

### 1.2 启动命令

```bash
pnpm storybook
```

当前脚本使用 `--host 0.0.0.0`，可被同网段机器访问。

### 1.3 本机验证

```bash
curl -I http://localhost:6006/mcp
```

看到非 404 且包含 `allow: GET, POST, DELETE, OPTIONS` 即表示 MCP 端点存在。

---

## 2. 其他机器连接这台机器的 MCP（你的 IP：10.253.32.50）

### 2.1 连接地址

其他 Client 应使用：

```txt
http://10.253.32.50:6006/mcp
```

### 2.2 网络前提

- Storybook 必须在这台机器上运行中（`pnpm storybook`）
- Client 机器能访问 `10.253.32.50:6006`（同网段/路由可达）
- 防火墙放行 6006 端口（如有防火墙）

### 2.3 用 mcp-add 给 Cursor 配置（推荐）

在“Client 机器”执行：

```bash
npx mcp-add \
  --name storybook-lan \
  --type http \
  --url "http://10.253.32.50:6006/mcp" \
  --client-id "cdf3737dff9d485485968e50b63fd8b4" \
  --scope project \
  --clients cursor
```

### 2.4 手动 MCP 配置（通用）

如果某个 Client 不支持 `mcp-add`，在它的 MCP 配置文件中添加 HTTP server，核心字段如下：

```json
{
  "mcpServers": {
    "storybook-lan": {
      "url": "http://10.253.32.50:6006/mcp",
      "auth": {
        "CLIENT_ID": "cdf3737dff9d485485968e50b63fd8b4"
      }
    }
  }
}
```

---

## 3. 可选：Chromatic 远程 MCP（公网/跨网络更稳定）

### 3.1 发布

```bash
pnpm chromatic --project-token <YOUR_CHROMATIC_PROJECT_TOKEN>
```

### 3.2 远程地址格式

```txt
https://main--<appid>.chromatic.com/mcp
```

### 3.3 Client 连接远程地址

```bash
npx mcp-add \
  --name storybook-remote \
  --type http \
  --url "https://main--<appid>.chromatic.com/mcp" \
  --client-id "cdf3737dff9d485485968e50b63fd8b4" \
  --scope project \
  --clients cursor
```

注意：按 Chromatic 文档，发布后的 MCP 主要提供 Docs 工具；开发/测试类能力仍以本地 Storybook MCP 为主。
