import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProductListTable } from '../components/ProductListTable';
import type { ProductItem } from '../types';
import { DEFAULT_COLOR_OPTIONS } from '../types';

// 示例数据
const sampleProducts: ProductItem[] = [
  {
    id: '1',
    color: '金色',
    part: '前部',
    unit: '件',
    quantity: 10,
    unitPrice: 25.5,
    totalPrice: 255,
    note: '高质量产品',
  },
  {
    id: '2',
    color: '银色',
    part: '后部',
    unit: '个',
    quantity: 5,
    unitPrice: 30.0,
    totalPrice: 150,
    note: '标准质量',
  },
  {
    id: '3',
    color: '黑色',
    part: '侧部',
    unit: '套',
    quantity: 3,
    unitPrice: 45.0,
    totalPrice: 135,
    note: '特价产品',
  },
];

const meta: Meta<typeof ProductListTable> = {
  title: 'ProductListTable',
  component: ProductListTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '基于 Spreadsheet 组件的产品列表管理表格，支持内联编辑、自动计算金额、颜色选择和产品管理功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    products: {
      description: '产品列表数据',
      control: 'object',
    },
    onChange: {
      description: '数据变化回调函数',
      action: 'onChange',
    },
    colorOptions: {
      description: '可选的颜色选项列表',
      control: 'object',
    },
    showToolbar: {
      description: '是否显示工具栏',
      control: 'boolean',
    },
    showIndexColumn: {
      description: '是否显示序号列（false时使用 Spreadsheet 自带行号）',
      control: 'boolean',
    },
    darkMode: {
      description: '是否启用暗色模式',
      control: 'boolean',
    },
    className: {
      description: '自定义CSS类名',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductListTable>;

// 基础示例（不显示序号列，使用 Spreadsheet 自带的行号）
export const Basic: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>([]);
    
    return (
      <ProductListTable
        {...args}
        products={products}
        onChange={setProducts}
      />
    );
  },
  args: {
    showToolbar: true,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: false,
  },
};

// 带有初始数据（显示序号列）
export const WithInitialData: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>(sampleProducts);
    
    return (
      <ProductListTable
        {...args}
        products={products}
        onChange={setProducts}
      />
    );
  },
  args: {
    showToolbar: true,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: true,
  },
};

// 基础示例带序号列（与 Basic 对比）
export const BasicWithIndex: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>(sampleProducts);
    
    return (
      <ProductListTable
        {...args}
        products={products}
        onChange={setProducts}
      />
    );
  },
  args: {
    showToolbar: true,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: true,
  },
};

// 空列表状态
export const Empty: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>([]);
    
    return (
      <ProductListTable
        {...args}
        products={products}
        onChange={setProducts}
      />
    );
  },
  args: {
    showToolbar: true,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: true,
  },
};

// 自定义颜色选项
export const CustomColors: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>(sampleProducts);
    
    return (
      <ProductListTable
        {...args}
        products={products}
        onChange={setProducts}
      />
    );
  },
  args: {
    showToolbar: true,
    colorOptions: ['红色', '蓝色', '绿色', '黄色', '紫色'],
    showIndexColumn: true,
  },
};

// 无工具栏模式
export const WithoutToolbar: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>(sampleProducts);
    
    return (
      <ProductListTable
        {...args}
        products={products}
        onChange={setProducts}
      />
    );
  },
  args: {
    showToolbar: false,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: true,
  },
};

// 暗色模式
export const DarkMode: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>(sampleProducts);
    
    return (
      <ProductListTable
        {...args}
        products={products}
        onChange={setProducts}
      />
    );
  },
  args: {
    showToolbar: true,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    darkMode: true,
    showIndexColumn: true,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

// 受控模式示例
export const Controlled: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>(sampleProducts);
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">受控模式示例</h3>
          <p className="text-sm text-blue-600">
            当前产品数量: {products.length} | 
            总金额: ¥{products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0).toFixed(2)}
          </p>
        </div>
        <ProductListTable
          {...args}
          products={products}
          onChange={setProducts}
        />
      </div>
    );
  },
  args: {
    showToolbar: true,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: true,
  },
};

// 大量数据性能测试
export const LargeDataset: Story = {
  render: (args) => {
    const initialProducts = Array.from({ length: 50 }, (_, index) => ({
      id: `product-${index + 1}`,
      color: DEFAULT_COLOR_OPTIONS[index % DEFAULT_COLOR_OPTIONS.length],
      part: ['前部', '后部', '侧部', '顶部', '底部'][index % 5],
      unit: ['件', '个', '套', '台', '只'][index % 5],
      quantity: Math.floor(Math.random() * 100) + 1,
      unitPrice: Math.floor(Math.random() * 1000) + 10,
      note: `产品 ${index + 1} 的备注信息`,
    }));
    
    const [products, setProducts] = React.useState<ProductItem[]>(initialProducts);
    
    return (
      <ProductListTable
        {...args}
        products={products}
        onChange={setProducts}
      />
    );
  },
  args: {
    showToolbar: true,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: true,
  },
};

// 交互演示
export const Interactive: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>(sampleProducts);
    const [log, setLog] = React.useState<string[]>([]);
    
    const handleChange = (newProducts: ProductItem[]) => {
      setProducts(newProducts);
      setLog(prev => [...prev.slice(-4), `更新: ${new Date().toLocaleTimeString()} - 产品数量: ${newProducts.length}`]);
    };
    
    return (
      <div className="space-y-4">
        <ProductListTable
          {...args}
          products={products}
          onChange={handleChange}
        />
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">操作日志</h3>
          <div className="space-y-1 text-sm">
            {log.map((entry, index) => (
              <div key={index} className="text-gray-600">{entry}</div>
            ))}
            {log.length === 0 && (
              <div className="text-gray-400 italic">暂无操作记录</div>
            )}
          </div>
        </div>
      </div>
    );
  },
  args: {
    showToolbar: true,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: true,
  },
};

// 行操作演示
export const RowOperations: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>(sampleProducts);
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">行操作功能演示</h3>
          <p className="text-sm text-blue-600 mb-2">
            • 点击 <span className="font-mono">➕</span> 按钮：在当前行下方插入新行
          </p>
          <p className="text-sm text-blue-600">
            • 点击 <span className="font-mono">🗑️</span> 按钮：删除当前行
          </p>
        </div>
        <ProductListTable
          {...args}
          products={products}
          onChange={setProducts}
        />
      </div>
    );
  },
  args: {
    showToolbar: true,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: true,
  },
};

// 调试场景 - 检查操作按钮是否显示
export const Debug: Story = {
  render: (args) => {
    const [products, setProducts] = React.useState<ProductItem[]>([
      {
        id: 'debug-1',
        color: '金色',
        part: '前部',
        unit: '件',
        quantity: 1,
        unitPrice: 10,
        note: '调试产品',
      },
    ]);
    
    React.useEffect(() => {
      console.log('Debug - 当前产品数据:', products);
    }, [products]);
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">调试模式</h3>
          <p className="text-sm text-yellow-600">
            检查操作列的按钮是否正确显示。打开浏览器控制台查看数据。
          </p>
        </div>
        <ProductListTable
          {...args}
          products={products}
          onChange={setProducts}
        />
        <div className="p-2 bg-gray-100 rounded text-xs">
          <strong>当前数据:</strong>
          <pre>{JSON.stringify(products, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    showToolbar: false,
    colorOptions: [...DEFAULT_COLOR_OPTIONS],
    showIndexColumn: true,
  },
};
