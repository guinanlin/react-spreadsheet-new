/**
 * API调用插件示例
 * 
 * 展示如何创建与外部服务对接的插件
 * 包含数据预加载、缓存机制和错误处理
 */

import { createPlugin } from '../core/plugin/definePlugin';

/**
 * API调用插件
 * 演示如何对接外部REST API服务
 */
export const ExampleAPIPlugin = createPlugin({
  id: 'example-api',
  name: 'API调用插件',
  version: '1.0.0',
  author: 'DtyLuckySheet',
  description: '展示如何调用外部API并缓存数据',
  
  serviceConfig: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 5000,
  },
  
  // 插件初始化 - 预加载数据
  async initialize() {
    console.log('🔄 正在初始化 API 插件...');
    
    try {
      // ✅ 使用 serviceConfig 中的配置
      const baseUrl = this.serviceConfig?.baseUrl || 'http://localhost:3000/api';
      const timeout = this.serviceConfig?.timeout || 5000;
      
      console.log(`📡 尝试从 ${baseUrl} 加载数据...`);
      
      // 创建超时控制器
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        // 🔄 尝试加载汇率数据
        console.log('📊 正在加载汇率数据...');
        const ratesResponse = await fetch(`${baseUrl}/rates`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!ratesResponse.ok) {
          throw new Error(`汇率API调用失败: HTTP ${ratesResponse.status} ${ratesResponse.statusText}`);
        }
        
        const rates = await ratesResponse.json();
        (globalThis as any).__API_EXCHANGE_RATES__ = rates;
        console.log('✅ 汇率数据加载成功:', Object.keys(rates).length, '个汇率对');
        
        // 🔄 尝试加载产品数据
        console.log('📦 正在加载产品数据...');
        const productsResponse = await fetch(`${baseUrl}/products`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!productsResponse.ok) {
          throw new Error(`产品API调用失败: HTTP ${productsResponse.status} ${productsResponse.statusText}`);
        }
        
        const products = await productsResponse.json();
        (globalThis as any).__API_PRODUCTS__ = products;
        console.log('✅ 产品数据加载成功:', Object.keys(products).length, '个产品');
        
      } catch (fetchError) {
        const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
        console.warn('⚠️ API调用失败，使用模拟数据:', errorMessage);
        
        // 🔄 降级到模拟数据
        const mockRates = {
          'USD_CNY': 7.18,
          'CNY_USD': 0.139,
          'USD_EUR': 0.85,
          'EUR_USD': 1.18,
          'USD_JPY': 110.25,
          'JPY_USD': 0.009,
          'EUR_CNY': 8.45,
          'CNY_EUR': 0.118,
        };
        
        const mockProducts = {
          'SKU001': { name: '传真机', price: 500, stock: 100 },
          'SKU002': { name: '打印机', price: 1200, stock: 50 },
          'SKU003': { name: '电话机', price: 200, stock: 200 },
          'SKU004': { name: '扫描仪', price: 800, stock: 75 },
          'SKU005': { name: '投影仪', price: 3500, stock: 30 },
        };
        
        (globalThis as any).__API_EXCHANGE_RATES__ = mockRates;
        (globalThis as any).__API_PRODUCTS__ = mockProducts;
        
        console.log('📦 已加载模拟数据作为备选');
        console.log('  💱 汇率数据:', Object.keys(mockRates).length, '个汇率对');
        console.log('  📦 产品数据:', Object.keys(mockProducts).length, '个产品');
      } finally {
        clearTimeout(timeoutId);
      }
      
      console.log('✅ API 插件初始化完成');
      
    } catch (error) {
      console.error('❌ API 插件初始化失败:', error);
      // 即使初始化失败，插件也可以正常加载，只是函数会返回错误
    }
  },
  
  // 插件清理
  destroy() {
    delete (globalThis as any).__API_EXCHANGE_RATES__;
    delete (globalThis as any).__API_PRODUCTS__;
    console.log('🧹 API 插件已清理');
  },
  
  
  functions: [
    {
      name: 'API_EXCHANGE_RATE',
      category: 'financial',
      description: '货币汇率转换（从预加载数据获取）',
      params: [
        {
          name: 'from',
          type: 'string',
          required: true,
          description: '源币种（如 "USD"）',
        },
        {
          name: 'to',
          type: 'string',
          required: true,
          description: '目标币种（如 "CNY"）',
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          description: '金额',
        },
      ],
      examples: [
        '=API_EXCHANGE_RATE("USD", "CNY", 100)    // 将100美元转为人民币',
        '=API_EXCHANGE_RATE("EUR", "USD", A1)     // 将A1欧元转为美元',
      ],
      execute: (args) => {
        if (args.length < 3) {
          return '#N/A';
        }
        
        const from = String(args[0]).toUpperCase();
        const to = String(args[1]).toUpperCase();
        const amount = Number(args[2]);
        
        if (isNaN(amount)) {
          return '#VALUE!';
        }
        
        // 从缓存获取汇率数据
        const rates = (globalThis as any).__API_EXCHANGE_RATES__;
        
        if (!rates) {
          return '#ERROR!'; // 数据未加载
        }
        
        const rateKey = `${from}_${to}`;
        const rate = rates[rateKey];
        
        if (!rate) {
          return '#N/A'; // 汇率不存在
        }
        
        return Number((amount * rate).toFixed(2));
      },
    },
    
    {
      name: 'API_PRODUCT_PRICE',
      category: 'custom',
      description: '查询产品价格',
      params: [
        {
          name: 'sku',
          type: 'string',
          required: true,
          description: '产品SKU编码',
        },
      ],
      examples: [
        '=API_PRODUCT_PRICE("SKU001")    // 查询SKU001的价格',
        '=API_PRODUCT_PRICE(A1)          // 查询A1单元格SKU的价格',
      ],
      execute: (args) => {
        if (args.length === 0) {
          return '#N/A';
        }
        
        const sku = String(args[0]).trim();
        
        // 从缓存获取产品数据
        const products = (globalThis as any).__API_PRODUCTS__;
        
        if (!products) {
          return '#ERROR!'; // 数据未加载
        }
        
        const product = products[sku];
        
        if (!product) {
          return 0; // 产品不存在，返回0
        }
        
        return product.price;
      },
    },
    
    {
      name: 'API_PRODUCT_STOCK',
      category: 'custom',
      description: '查询产品库存',
      params: [
        {
          name: 'sku',
          type: 'string',
          required: true,
          description: '产品SKU编码',
        },
      ],
      examples: [
        '=API_PRODUCT_STOCK("SKU001")    // 查询SKU001的库存',
        '=API_PRODUCT_STOCK(A1)          // 查询A1单元格SKU的库存',
      ],
      execute: (args) => {
        if (args.length === 0) {
          return '#N/A';
        }
        
        const sku = String(args[0]).trim();
        
        const products = (globalThis as any).__API_PRODUCTS__;
        
        if (!products) {
          return '#ERROR!';
        }
        
        const product = products[sku];
        
        if (!product) {
          return 0;
        }
        
        return product.stock;
      },
    },
    
    {
      name: 'API_PRODUCT_NAME',
      category: 'custom',
      description: '查询产品名称',
      params: [
        {
          name: 'sku',
          type: 'string',
          required: true,
          description: '产品SKU编码',
        },
      ],
      examples: [
        '=API_PRODUCT_NAME("SKU001")     // 查询SKU001的名称',
        '=API_PRODUCT_NAME(A1)           // 查询A1单元格SKU的名称',
      ],
      execute: (args) => {
        if (args.length === 0) {
          return '#N/A';
        }
        
        const sku = String(args[0]).trim();
        
        const products = (globalThis as any).__API_PRODUCTS__;
        
        if (!products) {
          return '#ERROR!';
        }
        
        const product = products[sku];
        
        if (!product) {
          return '#N/A';
        }
        
        return product.name;
      },
    },
    
    {
      name: 'API_ORDER_TOTAL',
      category: 'financial',
      description: '计算订单总额（数量 × 单价）',
      params: [
        {
          name: 'sku',
          type: 'string',
          required: true,
          description: '产品SKU编码',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          description: '数量',
        },
      ],
      examples: [
        '=API_ORDER_TOTAL("SKU001", 10)  // SKU001 × 10的总额',
        '=API_ORDER_TOTAL(A1, B1)        // A1产品 × B1数量',
      ],
      execute: (args) => {
        if (args.length < 2) {
          return '#N/A';
        }
        
        const sku = String(args[0]).trim();
        const quantity = Number(args[1]);
        
        if (isNaN(quantity)) {
          return '#VALUE!';
        }
        
        const products = (globalThis as any).__API_PRODUCTS__;
        
        if (!products) {
          return '#ERROR!';
        }
        
        const product = products[sku];
        
        if (!product) {
          return '#N/A';
        }
        
        return Number((product.price * quantity).toFixed(2));
      },
    },
  ],
});

/**
 * 数据刷新工具函数
 * 可以手动调用来刷新API数据缓存
 */
export async function refreshAPICache(baseUrl: string = 'http://localhost:3000/api', timeout: number = 5000) {
  console.log('🔄 正在刷新API数据缓存...');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // 并行加载数据
    const [ratesResponse, productsResponse] = await Promise.all([
      fetch(`${baseUrl}/rates`, { 
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      }),
      fetch(`${baseUrl}/products`, { 
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      })
    ]);
    
    if (!ratesResponse.ok || !productsResponse.ok) {
      throw new Error('API调用失败');
    }
    
    const [rates, products] = await Promise.all([
      ratesResponse.json(),
      productsResponse.json()
    ]);
    
    (globalThis as any).__API_EXCHANGE_RATES__ = rates;
    (globalThis as any).__API_PRODUCTS__ = products;
    
    clearTimeout(timeoutId);
    console.log('✅ 数据缓存刷新成功');
    console.log('  💱 汇率数据:', Object.keys(rates).length, '个汇率对');
    console.log('  📦 产品数据:', Object.keys(products).length, '个产品');
    
    return { rates, products };
  } catch (error) {
    console.error('❌ 数据缓存刷新失败:', error);
    throw error;
  }
}

