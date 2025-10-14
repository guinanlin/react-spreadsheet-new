import React from 'react';
import { ProductListTable } from './components/ProductListTable';
import type { ProductItem } from './types';

// 简单的测试组件
export const SimpleTest: React.FC = () => {
  const [products, setProducts] = React.useState<ProductItem[]>([
    {
      id: 'test-1',
      color: '金色',
      part: '前部',
      unit: '件',
      quantity: 1,
      unitPrice: 10,
      note: '测试',
    },
  ]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>简单测试</h2>
      <ProductListTable
        products={products}
        onChange={setProducts}
        showIndexColumn={true}
      />
    </div>
  );
};
