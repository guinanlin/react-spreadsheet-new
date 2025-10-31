/**
 * ERP Agent 销售智能体组件库 - 使用示例
 */

import * as React from 'react';
import { useState } from 'react';
import { 
  SalesFlow, 
  SalesNodeDetail, 
  useSalesWorkflow,
  type SalesDetailData,
  type SalesNodeData
} from './index';
import type { Node } from '@xyflow/react';

/**
 * 基础使用示例
 */
export function BasicUsageExample() {
  return (
    <div className="w-full h-screen">
      <SalesFlow 
        height={600}
        showControls={true}
        showMinimap={true}
      />
    </div>
  );
}

/**
 * 交互式使用示例
 */
export function InteractiveUsageExample() {
  const [selectedNode, setSelectedNode] = useState<Node<SalesNodeData> | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  const workflow = useSalesWorkflow();

  const handleNodeClick = (node: Node<SalesNodeData>) => {
    console.log('点击节点:', node);
    setSelectedNode(node);
    setShowDetail(true);
  };

  const handleSaveDetail = (data: SalesDetailData) => {
    if (selectedNode) {
      workflow.updateNodeData(selectedNode.id, {
        description: data.description,
        status: data.status,
      });
    }
    setShowDetail(false);
  };

  return (
    <div className="w-full h-screen relative">
      <SalesFlow
        initialNodes={workflow.nodes}
        initialEdges={workflow.edges}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={(node) => {
          alert(`双击节点: ${node.data.label}`);
        }}
        editable={true}
        showControls={true}
        showMinimap={true}
        height={700}
      />
      
      {selectedNode && (
        <SalesNodeDetail
          data={workflow.getNodeDetail(selectedNode.id)}
          visible={showDetail}
          onClose={() => setShowDetail(false)}
          editable={true}
          onSave={handleSaveDetail}
        />
      )}
    </div>
  );
}

/**
 * 自定义节点示例
 */
export function CustomNodesExample() {
  const customNodes: Node<SalesNodeData>[] = [
    {
      id: 'custom-root',
      type: 'rootNode',
      data: {
        label: '自定义销售流程',
        type: 'root',
        status: 'in-progress',
        description: '这是一个自定义的销售流程示例'
      },
      position: { x: 400, y: 50 },
    },
    {
      id: 'custom-sample',
      type: 'businessNode',
      data: {
        label: '定制样衣',
        type: 'business',
        businessType: 'sample',
        status: 'completed',
        description: '高端定制样衣业务'
      },
      position: { x: 400, y: 200 },
    },
    {
      id: 'custom-contract',
      type: 'processNode',
      data: {
        label: '签署定制协议',
        type: 'process',
        status: 'completed',
        description: '与客户签署高端定制协议'
      },
      position: { x: 300, y: 350 },
    },
    {
      id: 'custom-design',
      type: 'processNode',
      data: {
        label: '设计确认',
        type: 'process',
        status: 'in-progress',
        description: '确认最终设计方案'
      },
      position: { x: 400, y: 350 },
    },
    {
      id: 'custom-production',
      type: 'processNode',
      data: {
        label: '手工制作',
        type: 'process',
        status: 'pending',
        description: '手工制作定制样衣'
      },
      position: { x: 500, y: 350 },
    },
  ];

  const customEdges = [
    { 
      id: 'e-custom-root-sample', 
      source: 'custom-root', 
      target: 'custom-sample', 
      animated: true, 
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 2 }
    },
    { 
      id: 'e-custom-contract', 
      source: 'custom-sample', 
      target: 'custom-contract', 
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 1.5 }
    },
    { 
      id: 'e-custom-design', 
      source: 'custom-sample', 
      target: 'custom-design', 
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 1.5 }
    },
    { 
      id: 'e-custom-production', 
      source: 'custom-sample', 
      target: 'custom-production', 
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 1.5 }
    },
  ];

  return (
    <div className="w-full h-screen">
      <SalesFlow
        initialNodes={customNodes}
        initialEdges={customEdges}
        height={600}
        showControls={true}
        showMinimap={true}
        onNodeClick={(node) => {
          console.log('自定义节点点击:', node);
        }}
      />
    </div>
  );
}

/**
 * 统计数据显示示例
 */
export function StatisticsExample() {
  const workflow = useSalesWorkflow();
  const stats = workflow.getStatistics();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">销售统计</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm font-medium text-gray-500">总订单数</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm font-medium text-gray-500">样衣订单</div>
          <div className="text-2xl font-bold text-purple-600">{stats.sampleOrders}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm font-medium text-gray-500">大货订单</div>
          <div className="text-2xl font-bold text-orange-600">{stats.bulkOrders}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm font-medium text-gray-500">已完成</div>
          <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm font-medium text-gray-500">总销售额</div>
          <div className="text-2xl font-bold text-blue-600">¥{stats.totalRevenue.toLocaleString()}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm font-medium text-gray-500">样衣销售额</div>
          <div className="text-xl font-semibold text-purple-600">¥{stats.sampleRevenue.toLocaleString()}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm font-medium text-gray-500">平均完成时间</div>
          <div className="text-xl font-semibold text-gray-700">{stats.averageCompletionDays} 天</div>
        </div>
      </div>

      <div className="mt-6">
        <SalesFlow
          initialNodes={workflow.nodes}
          initialEdges={workflow.edges}
          height={400}
          showControls={true}
          showMinimap={false}
        />
      </div>
    </div>
  );
}

/**
 * 完整应用示例
 */
export function CompleteAppExample() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'statistics'>('workflow');
  const [selectedNode, setSelectedNode] = useState<Node<SalesNodeData> | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  const workflow = useSalesWorkflow();
  const stats = workflow.getStatistics();

  const handleNodeClick = (node: Node<SalesNodeData>) => {
    setSelectedNode(node);
    setShowDetail(true);
  };

  return (
    <div className="w-full h-screen bg-gray-100">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">ERP Agent 销售智能体</h1>
        </div>
        <div className="px-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'workflow'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              工作流程
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'statistics'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              统计数据
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 p-6">
        {activeTab === 'workflow' ? (
          <div className="h-full">
            <SalesFlow
              initialNodes={workflow.nodes}
              initialEdges={workflow.edges}
              onNodeClick={handleNodeClick}
              editable={true}
              showControls={true}
              showMinimap={true}
              height="calc(100vh - 200px)"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="text-sm font-medium text-gray-500">总订单数</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalOrders}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="text-sm font-medium text-gray-500">总销售额</div>
                <div className="text-3xl font-bold text-blue-600">¥{stats.totalRevenue.toLocaleString()}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="text-sm font-medium text-gray-500">已完成订单</div>
                <div className="text-3xl font-bold text-green-600">{stats.completedOrders}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="text-sm font-medium text-gray-500">平均完成时间</div>
                <div className="text-3xl font-bold text-orange-600">{stats.averageCompletionDays} 天</div>
              </div>
            </div>

            {/* 简化的流程图 */}
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">销售流程图</h3>
              </div>
              <div className="p-4">
                <SalesFlow
                  initialNodes={workflow.nodes}
                  initialEdges={workflow.edges}
                  height={400}
                  showControls={true}
                  showMinimap={false}
                  onNodeClick={handleNodeClick}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 节点详情弹窗 */}
      {selectedNode && (
        <SalesNodeDetail
          data={workflow.getNodeDetail(selectedNode.id)}
          visible={showDetail}
          onClose={() => setShowDetail(false)}
          editable={true}
          onSave={(data) => {
            workflow.updateNodeData(selectedNode.id, {
              description: data.description,
              status: data.status,
            });
            setShowDetail(false);
          }}
        />
      )}
    </div>
  );
}
