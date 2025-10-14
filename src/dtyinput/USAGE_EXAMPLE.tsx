/**
 * DtyInput 使用示例
 * 
 * 这个文件展示了如何在实际项目中使用 DtyInput 组件
 */

import React, { useState } from 'react';
import { DtyInput, SuggestionItem } from './index';
// 确保导入全局样式
import './styles/globals.css';

// ============================================
// 示例 1: 基本用法
// ============================================
export function BasicExample() {
  const [value, setValue] = useState('');

  return (
    <div>
      <h2>基本输入框</h2>
      <DtyInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入内容"
        width={300}
      />
      <p>当前值: {value}</p>
    </div>
  );
}

// ============================================
// 示例 2: 带静态建议的输入框
// ============================================
export function WithStaticSuggestions() {
  const [value, setValue] = useState('');

  const suggestions: SuggestionItem[] = [
    { id: '1', type: 'normal', content: 'Apple', value: 'apple' },
    { id: '2', type: 'normal', content: 'Banana', value: 'banana' },
    { id: '3', type: 'bold', content: 'Cherry (推荐)', value: 'cherry' },
    {
      id: '4',
      type: 'multiline',
      content: ['Durian', '榴莲 - 水果之王', '特别推荐'],
      value: 'durian',
    },
    { id: '5', type: 'action', content: '添加新水果', icon: 'plus' },
  ];

  const handleSuggestionSelect = (item: SuggestionItem) => {
    if (item.type === 'action') {
      alert('打开添加对话框');
    } else {
      console.log('选择了:', item);
    }
  };

  return (
    <div>
      <h2>带静态建议的输入框</h2>
      <p>双击或清空输入框可显示建议</p>
      <DtyInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="选择水果"
        showSuggestions={true}
        suggestions={suggestions}
        width={350}
        onSuggestionSelect={handleSuggestionSelect}
      />
    </div>
  );
}

// ============================================
// 示例 3: 服务器端数据获取
// ============================================
export function WithServerFetch() {
  const [value, setValue] = useState('');

  // 模拟从服务器获取数据
  const fetchSuggestions = async (query: string): Promise<SuggestionItem[]> => {
    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 模拟 API 响应
    if (!query) {
      return [
        { id: '1', type: 'normal', content: '用户001', value: 'user001' },
        { id: '2', type: 'normal', content: '用户002', value: 'user002' },
      ];
    }

    // 根据查询过滤
    const mockData = [
      { id: '1', type: 'normal', content: '张三', value: 'zhangsan' },
      { id: '2', type: 'normal', content: '李四', value: 'lisi' },
      { id: '3', type: 'normal', content: '王五', value: 'wangwu' },
    ] as SuggestionItem[];

    return mockData.filter((item) =>
      item.content.toString().toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div>
      <h2>服务器端数据获取</h2>
      <p>输入进行搜索，带防抖功能</p>
      <DtyInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="搜索用户"
        showSuggestions={true}
        fetchFromServer={true}
        fetchSuggestions={fetchSuggestions}
        debounceTime={300}
        width={350}
      />
    </div>
  );
}

// ============================================
// 示例 4: 产品搜索（复杂示例）
// ============================================
export function ProductSearchExample() {
  const [selectedProduct, setSelectedProduct] = useState<SuggestionItem | null>(null);

  const fetchProducts = async (query: string): Promise<SuggestionItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const products = [
      {
        id: 'P001',
        type: 'multiline' as const,
        content: ['T恤 - 红色', 'SKU: TS001', '库存: 50件'],
        value: 'TS001',
        stockUom: 'M',
        extra: { price: 99, category: '服装' },
      },
      {
        id: 'P002',
        type: 'multiline' as const,
        content: ['T恤 - 蓝色', 'SKU: TS002', '库存: 30件'],
        value: 'TS002',
        stockUom: 'L',
        extra: { price: 99, category: '服装' },
      },
      {
        id: 'P003',
        type: 'multiline' as const,
        content: ['牛仔裤', 'SKU: JE001', '库存: 20件'],
        value: 'JE001',
        stockUom: '32',
        extra: { price: 299, category: '服装' },
      },
    ];

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      Array.isArray(product.content)
        ? product.content.some((line) => line.toLowerCase().includes(query.toLowerCase()))
        : product.content.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleProductSelect = (item: SuggestionItem) => {
    setSelectedProduct(item);
  };

  return (
    <div>
      <h2>产品搜索</h2>
      <DtyInput
        placeholder="搜索产品（SKU、名称）"
        showSuggestions={true}
        fetchFromServer={true}
        fetchSuggestions={fetchProducts}
        width={400}
        dropdownWidth={450}
        onSuggestionSelect={handleProductSelect}
      />

      {selectedProduct && (
        <div style={{ marginTop: 20, padding: 15, background: '#f5f5f5', borderRadius: 8 }}>
          <h3>已选产品信息</h3>
          <p><strong>SKU:</strong> {selectedProduct.value}</p>
          <p><strong>尺码:</strong> {selectedProduct.stockUom}</p>
          {selectedProduct.extra && (
            <>
              <p><strong>价格:</strong> ¥{selectedProduct.extra.price}</p>
              <p><strong>分类:</strong> {selectedProduct.extra.category}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// 完整示例页面
// ============================================
export default function DtyInputExamples() {
  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <h1>DtyInput 组件使用示例</h1>

      <div style={{ marginTop: 40 }}>
        <BasicExample />
      </div>

      <div style={{ marginTop: 40 }}>
        <WithStaticSuggestions />
      </div>

      <div style={{ marginTop: 40 }}>
        <WithServerFetch />
      </div>

      <div style={{ marginTop: 40 }}>
        <ProductSearchExample />
      </div>
    </div>
  );
}

