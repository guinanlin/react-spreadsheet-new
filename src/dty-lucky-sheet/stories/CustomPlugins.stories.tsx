/**
 * 自定义插件演示
 * 
 * 展示如何使用插件系统扩展 DtyLuckySheet 的公式功能
 */

import React, { useState, useCallback } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { DtyLuckySheet } from "../components/DtyLuckySheet";
import type { Sheet } from "../core/types";

// 导入示例插件（自动注册）
import "../plugins/example-basic";
import "../plugins/example-api";

export default {
  title: "DtyLuckySheet/Custom Plugins",
  component: DtyLuckySheet,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# 自定义插件系统

DtyLuckySheet 提供了强大的插件系统，让你可以轻松扩展公式功能。

## 特性

- 🔌 **即插即用**：导入插件即自动注册
- 🌐 **对接任何服务**：支持 Node.js、Python、Java 等后端
- 💾 **数据预加载**：支持初始化时加载数据
- 🎯 **类型安全**：完整的 TypeScript 支持

## 本示例包含的函数

### 基础计算函数
- \`DOUBLE(value)\` - 数值加倍
- \`ADD_TAX(amount, rate)\` - 计算含税金额
- \`DISCOUNT(price, percent)\` - 计算折扣价格
- \`MARGIN_RATE(revenue, cost)\` - 计算利润率
- \`WEIGHTED_AVG(v1, w1, v2, w2)\` - 加权平均

### API 函数
- \`API_EXCHANGE_RATE(from, to, amount)\` - 货币转换
- \`API_PRODUCT_PRICE(sku)\` - 产品价格查询
- \`API_PRODUCT_STOCK(sku)\` - 产品库存查询
- \`API_PRODUCT_NAME(sku)\` - 产品名称查询
- \`API_ORDER_TOTAL(sku, quantity)\` - 订单总额计算

查看 [插件开发文档](../plugins/README.md) 了解如何创建自己的插件。
        `,
      },
    },
  },
  tags: ['autodocs'],
} as Meta<typeof DtyLuckySheet>;

/**
 * 基础插件演示
 * 展示纯计算函数的使用
 */
export const BasicPlugin: StoryFn<typeof DtyLuckySheet> = () => {
  const [data, setData] = useState<Sheet[]>([
    {
      name: "基础插件演示",
      celldata: [
        // 标题
        {
          r: 0,
          c: 0,
          v: {
            v: "基础计算插件演示",
            m: "基础计算插件演示",
            bg: "#4472C4",
            fc: "#fff",
            bl: 1,
            fs: 12,
          },
        },
        
        // DOUBLE 函数
        { r: 2, c: 0, v: { v: "DOUBLE 函数", m: "DOUBLE 函数", bl: 1 } },
        { r: 3, c: 0, v: { v: "原值", m: "原值" } },
        { r: 3, c: 1, v: { v: 50, m: "50" } },
        { r: 3, c: 2, v: { v: "加倍后", m: "加倍后" } },
        { r: 3, c: 3, v: { f: "=DOUBLE(B4)" } },
        
        // ADD_TAX 函数
        { r: 5, c: 0, v: { v: "ADD_TAX 函数", m: "ADD_TAX 函数", bl: 1 } },
        { r: 6, c: 0, v: { v: "不含税金额", m: "不含税金额" } },
        { r: 6, c: 1, v: { v: 1000, m: "1000" } },
        { r: 6, c: 2, v: { v: "税率", m: "税率" } },
        { r: 6, c: 3, v: { v: 0.13, m: "0.13" } },
        { r: 7, c: 0, v: { v: "含税金额", m: "含税金额" } },
        { r: 7, c: 1, v: { f: "=ADD_TAX(B7,D7)" } },
        
        // DISCOUNT 函数
        { r: 9, c: 0, v: { v: "DISCOUNT 函数", m: "DISCOUNT 函数", bl: 1 } },
        { r: 10, c: 0, v: { v: "原价", m: "原价" } },
        { r: 10, c: 1, v: { v: 500, m: "500" } },
        { r: 10, c: 2, v: { v: "折扣(%)", m: "折扣(%)" } },
        { r: 10, c: 3, v: { v: 20, m: "20" } },
        { r: 11, c: 0, v: { v: "折后价", m: "折后价" } },
        { r: 11, c: 1, v: { f: "=DISCOUNT(B11,D11)" } },
        
        // MARGIN_RATE 函数
        { r: 13, c: 0, v: { v: "MARGIN_RATE 函数", m: "MARGIN_RATE 函数", bl: 1 } },
        { r: 14, c: 0, v: { v: "收入", m: "收入" } },
        { r: 14, c: 1, v: { v: 10000, m: "10000" } },
        { r: 14, c: 2, v: { v: "成本", m: "成本" } },
        { r: 14, c: 3, v: { v: 6000, m: "6000" } },
        { r: 15, c: 0, v: { v: "利润率(%)", m: "利润率(%)" } },
        { r: 15, c: 1, v: { f: "=MARGIN_RATE(B15,D15)" } },
        
        // WEIGHTED_AVG 函数
        { r: 17, c: 0, v: { v: "WEIGHTED_AVG 函数", m: "WEIGHTED_AVG 函数", bl: 1 } },
        { r: 18, c: 0, v: { v: "值1", m: "值1" } },
        { r: 18, c: 1, v: { v: 80, m: "80" } },
        { r: 18, c: 2, v: { v: "权重1", m: "权重1" } },
        { r: 18, c: 3, v: { v: 0.6, m: "0.6" } },
        { r: 19, c: 0, v: { v: "值2", m: "值2" } },
        { r: 19, c: 1, v: { v: 90, m: "90" } },
        { r: 19, c: 2, v: { v: "权重2", m: "权重2" } },
        { r: 19, c: 3, v: { v: 0.4, m: "0.4" } },
        { r: 20, c: 0, v: { v: "加权平均", m: "加权平均" } },
        { r: 20, c: 1, v: { f: "=WEIGHTED_AVG(B19,D19,B20,D20)" } },
      ],
      row: 30,
      column: 10,
    },
  ]);

  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <DtyLuckySheet data={data} onChange={onChange} />
    </div>
  );
};

/**
 * API 插件演示
 * 展示如何对接外部数据源
 */
export const APIPlugin: StoryFn<typeof DtyLuckySheet> = () => {
  const [data, setData] = useState<Sheet[]>([
    {
      name: "API插件演示",
      celldata: [
        // 标题
        {
          r: 0,
          c: 0,
          v: {
            v: "API 插件演示",
            m: "API 插件演示",
            bg: "#70AD47",
            fc: "#fff",
            bl: 1,
            fs: 12,
          },
        },
        
        // 汇率转换
        { r: 2, c: 0, v: { v: "汇率转换", m: "汇率转换", bl: 1, bg: "#E2EFDA" } },
        { r: 3, c: 0, v: { v: "源币种", m: "源币种" } },
        { r: 3, c: 1, v: { v: "USD", m: "USD" } },
        { r: 3, c: 2, v: { v: "目标币种", m: "目标币种" } },
        { r: 3, c: 3, v: { v: "CNY", m: "CNY" } },
        { r: 4, c: 0, v: { v: "金额", m: "金额" } },
        { r: 4, c: 1, v: { v: 1000, m: "1000" } },
        { r: 4, c: 2, v: { v: "转换后", m: "转换后" } },
        { r: 4, c: 3, v: { f: '=API_EXCHANGE_RATE(B4,D4,B5)' } },
        
        // 产品查询
        { r: 6, c: 0, v: { v: "产品信息查询", m: "产品信息查询", bl: 1, bg: "#E2EFDA" } },
        { r: 7, c: 0, v: { v: "SKU", m: "SKU", bl: 1 } },
        { r: 7, c: 1, v: { v: "产品名称", m: "产品名称", bl: 1 } },
        { r: 7, c: 2, v: { v: "单价", m: "单价", bl: 1 } },
        { r: 7, c: 3, v: { v: "库存", m: "库存", bl: 1 } },
        
        { r: 8, c: 0, v: { v: "SKU001", m: "SKU001" } },
        { r: 8, c: 1, v: { f: '=API_PRODUCT_NAME(A9)' } },
        { r: 8, c: 2, v: { f: '=API_PRODUCT_PRICE(A9)' } },
        { r: 8, c: 3, v: { f: '=API_PRODUCT_STOCK(A9)' } },
        
        { r: 9, c: 0, v: { v: "SKU002", m: "SKU002" } },
        { r: 9, c: 1, v: { f: '=API_PRODUCT_NAME(A10)' } },
        { r: 9, c: 2, v: { f: '=API_PRODUCT_PRICE(A10)' } },
        { r: 9, c: 3, v: { f: '=API_PRODUCT_STOCK(A10)' } },
        
        { r: 10, c: 0, v: { v: "SKU003", m: "SKU003" } },
        { r: 10, c: 1, v: { f: '=API_PRODUCT_NAME(A11)' } },
        { r: 10, c: 2, v: { f: '=API_PRODUCT_PRICE(A11)' } },
        { r: 10, c: 3, v: { f: '=API_PRODUCT_STOCK(A11)' } },
        
        // 订单计算
        { r: 12, c: 0, v: { v: "订单计算", m: "订单计算", bl: 1, bg: "#E2EFDA" } },
        { r: 13, c: 0, v: { v: "SKU", m: "SKU", bl: 1 } },
        { r: 13, c: 1, v: { v: "数量", m: "数量", bl: 1 } },
        { r: 13, c: 2, v: { v: "单价", m: "单价", bl: 1 } },
        { r: 13, c: 3, v: { v: "总额", m: "总额", bl: 1 } },
        
        { r: 14, c: 0, v: { v: "SKU001", m: "SKU001" } },
        { r: 14, c: 1, v: { v: 10, m: "10" } },
        { r: 14, c: 2, v: { f: '=API_PRODUCT_PRICE(A15)' } },
        { r: 14, c: 3, v: { f: '=API_ORDER_TOTAL(A15,B15)' } },
        
        { r: 15, c: 0, v: { v: "SKU002", m: "SKU002" } },
        { r: 15, c: 1, v: { v: 5, m: "5" } },
        { r: 15, c: 2, v: { f: '=API_PRODUCT_PRICE(A16)' } },
        { r: 15, c: 3, v: { f: '=API_ORDER_TOTAL(A16,B16)' } },
        
        { r: 16, c: 2, v: { v: "合计", m: "合计", bl: 1 } },
        { r: 16, c: 3, v: { f: '=SUM(D15:D16)', bl: 1 } },
      ],
      row: 30,
      column: 10,
    },
  ]);

  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <DtyLuckySheet data={data} onChange={onChange} />
    </div>
  );
};

/**
 * 综合演示
 * 组合使用多个插件函数
 */
export const CombinedExample: StoryFn<typeof DtyLuckySheet> = () => {
  const [data, setData] = useState<Sheet[]>([
    {
      name: "综合演示",
      celldata: [
        // 标题
        {
          r: 0,
          c: 0,
          v: {
            v: "销售订单计算",
            m: "销售订单计算",
            bg: "#FF6B6B",
            fc: "#fff",
            bl: 1,
            fs: 14,
          },
        },
        
        // 表头
        { r: 2, c: 0, v: { v: "产品SKU", m: "产品SKU", bl: 1, bg: "#FFE66D" } },
        { r: 2, c: 1, v: { v: "产品名称", m: "产品名称", bl: 1, bg: "#FFE66D" } },
        { r: 2, c: 2, v: { v: "单价", m: "单价", bl: 1, bg: "#FFE66D" } },
        { r: 2, c: 3, v: { v: "数量", m: "数量", bl: 1, bg: "#FFE66D" } },
        { r: 2, c: 4, v: { v: "小计", m: "小计", bl: 1, bg: "#FFE66D" } },
        { r: 2, c: 5, v: { v: "折扣(%)", m: "折扣(%)", bl: 1, bg: "#FFE66D" } },
        { r: 2, c: 6, v: { v: "折后金额", m: "折后金额", bl: 1, bg: "#FFE66D" } },
        
        // 数据行1
        { r: 3, c: 0, v: { v: "SKU001", m: "SKU001" } },
        { r: 3, c: 1, v: { f: '=API_PRODUCT_NAME(A4)' } },
        { r: 3, c: 2, v: { f: '=API_PRODUCT_PRICE(A4)' } },
        { r: 3, c: 3, v: { v: 10, m: "10" } },
        { r: 3, c: 4, v: { f: '=API_ORDER_TOTAL(A4,D4)' } },
        { r: 3, c: 5, v: { v: 10, m: "10" } },
        { r: 3, c: 6, v: { f: '=DISCOUNT(E4,F4)' } },
        
        // 数据行2
        { r: 4, c: 0, v: { v: "SKU002", m: "SKU002" } },
        { r: 4, c: 1, v: { f: '=API_PRODUCT_NAME(A5)' } },
        { r: 4, c: 2, v: { f: '=API_PRODUCT_PRICE(A5)' } },
        { r: 4, c: 3, v: { v: 3, m: "3" } },
        { r: 4, c: 4, v: { f: '=API_ORDER_TOTAL(A5,D5)' } },
        { r: 4, c: 5, v: { v: 5, m: "5" } },
        { r: 4, c: 6, v: { f: '=DISCOUNT(E5,F5)' } },
        
        // 数据行3
        { r: 5, c: 0, v: { v: "SKU003", m: "SKU003" } },
        { r: 5, c: 1, v: { f: '=API_PRODUCT_NAME(A6)' } },
        { r: 5, c: 2, v: { f: '=API_PRODUCT_PRICE(A6)' } },
        { r: 5, c: 3, v: { v: 20, m: "20" } },
        { r: 5, c: 4, v: { f: '=API_ORDER_TOTAL(A6,D6)' } },
        { r: 5, c: 5, v: { v: 15, m: "15" } },
        { r: 5, c: 6, v: { f: '=DISCOUNT(E6,F6)' } },
        
        // 合计
        { r: 7, c: 5, v: { v: "总计", m: "总计", bl: 1 } },
        { r: 7, c: 6, v: { f: '=SUM(G4:G6)', bl: 1, bg: "#FFE66D" } },
        
        // 税费计算
        { r: 9, c: 5, v: { v: "增值税(13%)", m: "增值税(13%)" } },
        { r: 9, c: 6, v: { f: '=ADD_TAX(G8,0.13)-G8' } },
        
        { r: 10, c: 5, v: { v: "含税总额", m: "含税总额", bl: 1 } },
        { r: 10, c: 6, v: { f: '=ADD_TAX(G8,0.13)', bl: 1, bg: "#4ECDC4", fc: "#fff" } },
      ],
      row: 30,
      column: 10,
      config: {
        columnlen: {
          0: 100,
          1: 120,
          2: 80,
          3: 60,
          4: 80,
          5: 100,
          6: 100,
        },
      },
    },
  ]);

  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <DtyLuckySheet data={data} onChange={onChange} />
    </div>
  );
};

