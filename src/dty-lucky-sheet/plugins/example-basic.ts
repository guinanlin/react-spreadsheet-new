/**
 * 基础计算插件示例
 * 
 * 这是一个最简单的插件模板，展示如何创建纯计算函数
 * 不涉及外部API调用，适合作为入门示例
 */

import { createPlugin } from '../core/plugin/definePlugin';

/**
 * 基础计算插件
 * 提供简单的数学和业务计算函数
 */
export const ExampleBasicPlugin = createPlugin({
  id: 'example-basic',
  name: '基础计算插件',
  version: '1.0.0',
  author: 'DtyLuckySheet',
  description: '提供基础的数学和业务计算函数示例',
  
  functions: [
    {
      name: 'DOUBLE',
      category: 'custom',
      description: '将数值加倍',
      params: [
        {
          name: 'value',
          type: 'number',
          required: true,
          description: '要加倍的数值',
        },
      ],
      examples: [
        '=DOUBLE(5)    // 返回 10',
        '=DOUBLE(A1)   // 返回 A1 单元格值的两倍',
      ],
      execute: (args) => {
        if (args.length === 0) {
          return '#N/A';
        }
        
        const value = Number(args[0]);
        
        if (isNaN(value)) {
          return '#VALUE!';
        }
        
        return value * 2;
      },
    },
    
    {
      name: 'ADD_TAX',
      category: 'financial',
      description: '计算含税金额',
      params: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          description: '不含税金额',
        },
        {
          name: 'tax_rate',
          type: 'number',
          required: true,
          description: '税率（如 0.13 表示 13%）',
        },
      ],
      examples: [
        '=ADD_TAX(100, 0.13)    // 返回 113（100 + 13%税）',
        '=ADD_TAX(A1, 0.06)     // A1金额加6%税',
      ],
      execute: (args) => {
        if (args.length < 2) {
          return '#N/A';
        }
        
        const amount = Number(args[0]);
        const taxRate = Number(args[1]);
        
        if (isNaN(amount) || isNaN(taxRate)) {
          return '#VALUE!';
        }
        
        if (taxRate < 0 || taxRate > 1) {
          return '#NUM!';
        }
        
        return Number((amount * (1 + taxRate)).toFixed(2));
      },
    },
    
    {
      name: 'DISCOUNT',
      category: 'financial',
      description: '计算折扣后价格',
      params: [
        {
          name: 'price',
          type: 'number',
          required: true,
          description: '原价',
        },
        {
          name: 'discount_percent',
          type: 'number',
          required: true,
          description: '折扣百分比（如 20 表示打8折）',
        },
      ],
      examples: [
        '=DISCOUNT(100, 20)     // 返回 80（打8折）',
        '=DISCOUNT(A1, 15)      // A1价格打85折',
      ],
      execute: (args) => {
        if (args.length < 2) {
          return '#N/A';
        }
        
        const price = Number(args[0]);
        const discountPercent = Number(args[1]);
        
        if (isNaN(price) || isNaN(discountPercent)) {
          return '#VALUE!';
        }
        
        if (discountPercent < 0 || discountPercent > 100) {
          return '#NUM!';
        }
        
        return Number((price * (1 - discountPercent / 100)).toFixed(2));
      },
    },
    
    {
      name: 'MARGIN_RATE',
      category: 'financial',
      description: '计算利润率',
      params: [
        {
          name: 'revenue',
          type: 'number',
          required: true,
          description: '收入',
        },
        {
          name: 'cost',
          type: 'number',
          required: true,
          description: '成本',
        },
      ],
      examples: [
        '=MARGIN_RATE(100, 60)     // 返回 40（利润率40%）',
        '=MARGIN_RATE(A1, B1)      // 计算A1和B1的利润率',
      ],
      execute: (args) => {
        if (args.length < 2) {
          return '#N/A';
        }
        
        const revenue = Number(args[0]);
        const cost = Number(args[1]);
        
        if (isNaN(revenue) || isNaN(cost)) {
          return '#VALUE!';
        }
        
        if (revenue === 0) {
          return '#DIV/0!';
        }
        
        const margin = ((revenue - cost) / revenue) * 100;
        return Number(margin.toFixed(2));
      },
    },
    
    {
      name: 'WEIGHTED_AVG',
      category: 'statistical',
      description: '计算加权平均值（两个值）',
      params: [
        {
          name: 'value1',
          type: 'number',
          required: true,
          description: '第一个值',
        },
        {
          name: 'weight1',
          type: 'number',
          required: true,
          description: '第一个权重',
        },
        {
          name: 'value2',
          type: 'number',
          required: true,
          description: '第二个值',
        },
        {
          name: 'weight2',
          type: 'number',
          required: true,
          description: '第二个权重',
        },
      ],
      examples: [
        '=WEIGHTED_AVG(80, 0.6, 90, 0.4)    // 返回 84（加权平均）',
        '=WEIGHTED_AVG(A1, 0.7, B1, 0.3)    // A1权重70%，B1权重30%',
      ],
      execute: (args) => {
        if (args.length < 4) {
          return '#N/A';
        }
        
        const value1 = Number(args[0]);
        const weight1 = Number(args[1]);
        const value2 = Number(args[2]);
        const weight2 = Number(args[3]);
        
        if (
          isNaN(value1) ||
          isNaN(weight1) ||
          isNaN(value2) ||
          isNaN(weight2)
        ) {
          return '#VALUE!';
        }
        
        const totalWeight = weight1 + weight2;
        
        if (totalWeight === 0) {
          return '#DIV/0!';
        }
        
        const weightedAvg =
          (value1 * weight1 + value2 * weight2) / totalWeight;
        return Number(weightedAvg.toFixed(2));
      },
    },
  ],
});

