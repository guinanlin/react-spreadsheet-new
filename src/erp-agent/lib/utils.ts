/**
 * ERP Agent 销售智能体组件 - 工具函数
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SalesNodeStatus, BusinessType, SalesStatistics } from '../types';

/**
 * 合并 className 的工具函数
 * 结合 clsx 和 tailwind-merge 来正确处理 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 生成唯一 ID
 */
export function generateId(prefix = 'sales'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化时间
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 获取节点状态的中文描述
 */
export function getStatusText(status: SalesNodeStatus): string {
  const statusMap: Record<SalesNodeStatus, string> = {
    pending: '待处理',
    'in-progress': '进行中',
    completed: '已完成',
    blocked: '被阻塞',
  };
  return statusMap[status] || '未知';
}

/**
 * 获取业务板块的中文描述
 */
export function getBusinessTypeText(businessType: BusinessType): string {
  const typeMap: Record<BusinessType, string> = {
    sample: '样衣销售',
    bulk: '大货销售',
  };
  return typeMap[businessType] || '未知';
}

/**
 * 获取节点状态对应的颜色类名
 */
export function getStatusColor(status: SalesNodeStatus): string {
  const colorMap: Record<SalesNodeStatus, string> = {
    pending: 'bg-gray-100 border-gray-300 text-gray-800',
    'in-progress': 'bg-blue-100 border-blue-400 text-blue-800',
    completed: 'bg-green-100 border-green-400 text-green-800',
    blocked: 'bg-red-100 border-red-400 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 border-gray-300 text-gray-800';
}

/**
 * 获取业务板块对应的颜色类名
 */
export function getBusinessTypeColor(businessType: BusinessType): string {
  const colorMap: Record<BusinessType, string> = {
    sample: 'bg-purple-100 border-purple-400 text-purple-800',
    bulk: 'bg-orange-100 border-orange-400 text-orange-800',
  };
  return colorMap[businessType] || 'bg-gray-100 border-gray-300 text-gray-800';
}

/**
 * 计算两个日期之间的天数
 */
export function calculateDaysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化货币金额
 */
export function formatCurrency(amount: number, currency = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号格式
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 生成默认统计数据
 */
export function generateDefaultStatistics(): SalesStatistics {
  return {
    totalOrders: 0,
    sampleOrders: 0,
    bulkOrders: 0,
    completedOrders: 0,
    inProgressOrders: 0,
    totalRevenue: 0,
    sampleRevenue: 0,
    bulkRevenue: 0,
    averageCompletionDays: 0,
  };
}

/**
 * 计算进度百分比
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * 获取优先级颜色
 */
export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  const colorMap = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };
  return colorMap[priority];
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
