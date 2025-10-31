import type { Meta, StoryObj } from '@storybook/react';
import SalesFlowWhole from '../components/SalesFlowWhole';

const meta: Meta<typeof SalesFlowWhole> = {
  title: 'ERP Agent/Sales Flow Whole',
  component: SalesFlowWhole,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 默认销售智能体工作流 - 完整的销售流程展示
 * 包含样品销售、销售样销售、大货销售三个业务流程
 */
export const Default: Story = {
  render: () => <SalesFlowWhole />,
};
