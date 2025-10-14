/**
 * DtyLuckySheet 组件使用示例
 * 
 * 本文件展示了 DtyLuckySheet 组件的各种使用场景
 */

import React, { useState, useEffect } from 'react';
import { DtyLuckySheet } from './index';

// ============================================
// 示例 1: 基础用法
// ============================================
export function BasicExample() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">基础用法</h2>
      <DtyLuckySheet 
        title="欢迎"
        content="Hello, World!"
      />
    </div>
  );
}

// ============================================
// 示例 2: 自定义尺寸
// ============================================
export function CustomSizeExample() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">自定义尺寸</h2>
      <div className="space-y-4">
        <DtyLuckySheet 
          title="小尺寸"
          content="250 x 200"
          width={250}
          height={200}
        />
        <DtyLuckySheet 
          title="中等尺寸"
          content="400 x 300"
          width={400}
          height={300}
        />
        <DtyLuckySheet 
          title="大尺寸"
          content="600 x 400"
          width={600}
          height={400}
        />
      </div>
    </div>
  );
}

// ============================================
// 示例 3: 事件处理
// ============================================
export function EventHandlingExample() {
  const [message, setMessage] = useState('');
  const [eventData, setEventData] = useState<any>(null);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">事件处理</h2>
      <DtyLuckySheet 
        title="点击我"
        content="尝试点击组件"
        onClick={() => {
          setMessage('组件被点击了！');
          setTimeout(() => setMessage(''), 2000);
        }}
        onCustomEvent={(data) => {
          setEventData(data);
        }}
      />
      
      {/* 事件反馈 */}
      {message && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
      
      {/* 事件数据 */}
      {eventData && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded">
          <p>点击次数: {eventData.clickCount}</p>
          <p>点击时间: {new Date(eventData.timestamp).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// 示例 4: 状态管理
// ============================================
export function StateManagementExample() {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">状态管理</h2>
      
      <div className="mb-4">
        <button
          onClick={() => setIsDisabled(!isDisabled)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isDisabled ? '启用组件' : '禁用组件'}
        </button>
      </div>
      
      <DtyLuckySheet 
        title={isDisabled ? '已禁用' : '已启用'}
        content={isDisabled ? '组件当前不可用' : '组件可以点击'}
        disabled={isDisabled}
      />
    </div>
  );
}

// ============================================
// 示例 5: 加载状态
// ============================================
export function LoadingStateExample() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">加载状态示例</h2>
      
      <DtyLuckySheet 
        title={isLoading ? '加载中...' : '加载完成'}
        content={isLoading ? '请稍候片刻' : 'Hello, World!'}
        disabled={isLoading}
        className={isLoading ? 'animate-pulse' : ''}
      />
      
      {!isLoading && (
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          重新加载
        </button>
      )}
    </div>
  );
}

// ============================================
// 示例 6: 多个组件
// ============================================
export function MultipleComponentsExample() {
  const components = [
    { title: '组件 A', content: '第一个示例', color: 'blue' },
    { title: '组件 B', content: '第二个示例', color: 'green' },
    { title: '组件 C', content: '第三个示例', color: 'purple' },
    { title: '组件 D', content: '第四个示例', color: 'pink' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">多个组件</h2>
      <div className="grid grid-cols-2 gap-4">
        {components.map((comp, index) => (
          <DtyLuckySheet 
            key={index}
            title={comp.title}
            content={comp.content}
            width={300}
            height={250}
            className={`bg-${comp.color}-50 border-${comp.color}-400`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// 示例 7: 响应式布局
// ============================================
export function ResponsiveExample() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">响应式布局</h2>
      <DtyLuckySheet 
        title="响应式组件"
        content="调整浏览器窗口大小查看效果"
        className="w-full md:w-2/3 lg:w-1/2"
        height={300}
      />
    </div>
  );
}

// ============================================
// 示例 8: 调试模式
// ============================================
export function DebugModeExample() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">调试模式</h2>
      <p className="mb-4 text-gray-600">打开浏览器控制台查看调试信息</p>
      <DtyLuckySheet 
        title="调试模式"
        content="点击查看控制台日志"
        debug={true}
        onClick={() => console.log('用户点击了组件')}
      />
    </div>
  );
}

// ============================================
// 示例 9: 自定义样式
// ============================================
export function CustomStyleExample() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">自定义样式</h2>
      <div className="space-y-4">
        <DtyLuckySheet 
          title="渐变紫色"
          content="紫色主题"
          className="bg-gradient-to-r from-purple-400 to-pink-600 text-white border-purple-700"
        />
        <DtyLuckySheet 
          title="深色主题"
          content="暗色模式"
          className="bg-gray-800 text-white border-gray-600"
        />
        <DtyLuckySheet 
          title="霓虹效果"
          content="发光边框"
          className="bg-black text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
        />
      </div>
    </div>
  );
}

// ============================================
// 示例 10: 完整应用示例
// ============================================
export function FullApplicationExample() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});

  const handleComponentClick = (id: string) => {
    setSelectedComponent(id);
    setClickCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const components = [
    { id: 'comp1', title: '仪表板', content: '查看统计数据' },
    { id: 'comp2', title: '设置', content: '配置选项' },
    { id: 'comp3', title: '帮助', content: '获取支持' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">DtyLuckySheet 完整应用示例</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        {components.map((comp) => (
          <DtyLuckySheet 
            key={comp.id}
            title={comp.title}
            content={comp.content}
            width="100%"
            height={200}
            className={selectedComponent === comp.id ? 'ring-4 ring-blue-500' : ''}
            onClick={() => handleComponentClick(comp.id)}
          />
        ))}
      </div>
      
      {/* 状态面板 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">交互统计</h3>
        {selectedComponent && (
          <p className="text-gray-700 mb-2">
            当前选中: <span className="font-bold text-blue-600">{selectedComponent}</span>
          </p>
        )}
        <div className="space-y-2">
          {components.map((comp) => (
            <div key={comp.id} className="flex justify-between items-center">
              <span className="text-gray-600">{comp.title}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {clickCounts[comp.id] || 0} 次点击
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 导出所有示例
// ============================================
export default {
  BasicExample,
  CustomSizeExample,
  EventHandlingExample,
  StateManagementExample,
  LoadingStateExample,
  MultipleComponentsExample,
  ResponsiveExample,
  DebugModeExample,
  CustomStyleExample,
  FullApplicationExample,
};

