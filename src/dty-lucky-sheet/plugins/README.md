# DtyLuckySheet 插件开发指南

## 📦 什么是插件

插件是扩展 DtyLuckySheet 功能的独立模块，可以添加自定义公式函数。通过插件系统，你可以：

- 创建自定义计算函数
- 对接外部 API 服务（Node.js、Python、Java 等）
- 集成企业内部系统（ERP、CRM 等）
- 实现复杂的业务逻辑

## 🚀 快速开始

### 最简单的插件

```typescript
import { createPlugin } from '../core/plugin';

export const MyPlugin = createPlugin({
  id: 'my-plugin',
  name: '我的插件',
  
  functions: [
    {
      name: 'MY_FUNCTION',
      description: '我的自定义函数',
      execute: (args) => {
        return args[0] * 2;  // 将参数加倍
      }
    }
  ]
});
```

### 使用插件

```typescript
// 方式 1：导入即自动注册（推荐）
import './plugins/my-plugin';

// 然后在表格中使用
// =MY_FUNCTION(100)  // 返回 200
```

## 📚 插件结构

### 完整的插件定义

```typescript
import { createPlugin } from '../core/plugin';

export const MyPlugin = createPlugin({
  // 基本信息
  id: 'com.mycompany.my-plugin',      // 唯一标识（建议使用反向域名）
  name: '我的插件',                     // 显示名称
  version: '1.0.0',                    // 版本号
  author: 'Your Name',                 // 作者
  description: '插件功能描述',          // 描述
  
  // 可选：初始化函数
  async initialize() {
    // 预加载数据、连接API等
    console.log('插件初始化');
  },
  
  // 可选：清理函数
  destroy() {
    // 清理资源
    console.log('插件清理');
  },
  
  // 可选：服务配置
  serviceConfig: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 5000,
  },
  
  // 函数列表（必填）
  functions: [
    // 函数定义...
  ]
});
```

### 函数定义

```typescript
{
  name: 'MY_FUNCTION',              // 函数名（大写）
  category: 'custom',                // 分类：financial, statistical, text, logical, custom
  description: '函数描述',
  
  // 参数说明（可选，用于文档）
  params: [
    {
      name: 'value',
      type: 'number',                // number, string, boolean, range, any
      required: true,
      description: '参数描述'
    }
  ],
  
  // 示例（可选）
  examples: [
    '=MY_FUNCTION(100)',
    '=MY_FUNCTION(A1)'
  ],
  
  // 执行逻辑（必填）
  execute: (args, context) => {
    // args: 参数数组
    // context: 上下文信息（sheetId, row, col等）
    
    const value = args[0];
    return value * 2;
  }
}
```

## 💡 示例：纯计算函数

```typescript
import { createPlugin } from '../core/plugin';

export const MathPlugin = createPlugin({
  id: 'math-plugin',
  name: '数学插件',
  
  functions: [
    {
      name: 'TRIPLE',
      description: '将数值乘以3',
      execute: (args) => {
        if (args.length === 0) return '#N/A';
        
        const value = Number(args[0]);
        
        if (isNaN(value)) return '#VALUE!';
        
        return value * 3;
      }
    },
    
    {
      name: 'CIRCLE_AREA',
      description: '计算圆面积',
      params: [
        { name: 'radius', type: 'number', required: true, description: '半径' }
      ],
      execute: (args) => {
        if (args.length === 0) return '#N/A';
        
        const radius = Number(args[0]);
        
        if (isNaN(radius) || radius < 0) return '#NUM!';
        
        return Number((Math.PI * radius * radius).toFixed(2));
      }
    }
  ]
});
```

使用：
```excel
=TRIPLE(10)           // 返回 30
=CIRCLE_AREA(5)       // 返回 78.54
```

## 🌐 示例：对接外部 API

```typescript
import { createPlugin } from '../core/plugin';

export const APIPlugin = createPlugin({
  id: 'api-plugin',
  name: 'API插件',
  
  // 初始化时预加载数据
  async initialize() {
    try {
      const response = await fetch('http://localhost:3000/api/data');
      const data = await response.json();
      
      // 存储到全局缓存
      (globalThis as any).__MY_PLUGIN_DATA__ = data;
      
      console.log('✅ 数据加载成功');
    } catch (error) {
      console.error('❌ 数据加载失败:', error);
    }
  },
  
  destroy() {
    delete (globalThis as any).__MY_PLUGIN_DATA__;
  },
  
  functions: [
    {
      name: 'GET_PRICE',
      description: '从API获取价格',
      execute: (args) => {
        if (args.length === 0) return '#N/A';
        
        const productId = String(args[0]);
        const data = (globalThis as any).__MY_PLUGIN_DATA__;
        
        if (!data) return '#ERROR!';
        
        const product = data.products?.[productId];
        return product ? product.price : 0;
      }
    }
  ]
});
```

使用：
```excel
=GET_PRICE("SKU001")    // 从API获取SKU001的价格
```

## 🔧 错误处理

插件函数应该返回标准的 Excel 错误：

| 错误代码 | 说明 | 使用场景 |
|---------|------|---------|
| `#N/A` | 数据不可用 | 查询不到数据、参数不足 |
| `#VALUE!` | 值错误 | 参数类型错误 |
| `#NUM!` | 数值错误 | 数值超出范围 |
| `#DIV/0!` | 除零错误 | 除数为0 |
| `#ERROR!` | 通用错误 | 其他错误情况 |

示例：
```typescript
execute: (args) => {
  if (args.length === 0) return '#N/A';           // 参数不足
  
  const value = Number(args[0]);
  if (isNaN(value)) return '#VALUE!';             // 类型错误
  
  if (value < 0) return '#NUM!';                  // 数值错误
  
  if (value === 0) return '#DIV/0!';              // 除零错误
  
  try {
    // 计算逻辑
  } catch (error) {
    return '#ERROR!';                             // 通用错误
  }
}
```

## 📖 高级功能

### 使用上下文信息

```typescript
execute: (args, context) => {
  // 获取当前工作表ID
  const sheetId = context?.sheetId;
  
  // 获取公式所在单元格位置
  const row = context?.row;
  const col = context?.col;
  
  console.log(`函数在 Sheet ${sheetId} 的 (${row}, ${col}) 执行`);
  
  return args[0];
}
```

### 数据缓存策略

```typescript
// 方式 1：使用 globalThis（内存缓存）
(globalThis as any).__MY_CACHE__ = data;

// 方式 2：使用 sessionStorage（会话缓存）
sessionStorage.setItem('MY_CACHE', JSON.stringify(data));

// 方式 3：使用 localStorage（持久化缓存）
localStorage.setItem('MY_CACHE', JSON.stringify(data));
```

### 动态刷新数据

```typescript
export const RefreshablePlugin = createPlugin({
  id: 'refreshable-plugin',
  name: '可刷新插件',
  
  async initialize() {
    // 初始加载
    await this.loadData();
    
    // 每5分钟刷新一次
    setInterval(() => this.loadData(), 5 * 60 * 1000);
  },
  
  async loadData() {
    const response = await fetch('http://localhost:3000/api/data');
    const data = await response.json();
    (globalThis as any).__REFRESHABLE_DATA__ = data;
  },
  
  functions: [
    // 函数定义...
  ]
});
```

## 📝 最佳实践

### 1. 命名规范

- **插件ID**：使用反向域名格式 `com.company.plugin-name`
- **函数名**：全大写，使用下划线分隔 `MY_FUNCTION`
- **变量名**：使用描述性名称，避免冲突

### 2. 性能优化

- ✅ 在 `initialize()` 中预加载数据
- ✅ 使用缓存避免重复计算
- ✅ 对复杂计算进行防抖
- ❌ 避免在 `execute()` 中进行同步的网络请求

### 3. 错误处理

- ✅ 总是验证参数数量和类型
- ✅ 返回标准的 Excel 错误代码
- ✅ 使用 try-catch 捕获异常
- ✅ 在控制台输出有用的调试信息

### 4. 文档

- ✅ 为每个函数提供清晰的描述
- ✅ 定义参数类型和说明
- ✅ 提供使用示例
- ✅ 说明返回值的含义

## 🔗 参考资源

- [查看示例插件](./example-basic.ts) - 基础计算函数
- [查看API插件](./example-api.ts) - 外部API对接
- [核心类型定义](../core/plugin/types.ts) - 完整的类型定义

## 🤝 贡献

欢迎提交你的插件示例！

## 📄 许可

与 DtyLuckySheet 相同的许可协议。

