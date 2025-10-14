import React from 'react';
import { Button } from '@/components/ui/button';
import type { Meta, StoryFn } from '@storybook/react';
import '@/styles/globals.css';

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: '按钮变体样式',
      defaultValue: 'default',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: '按钮大小',
      defaultValue: 'default',
    },
    className: {
      control: 'text',
      description: '额外的 CSS 类名',
    },
  },
};

export default meta;

const Template: StoryFn<React.ComponentProps<typeof Button>> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Default Button',
  variant: 'default',
};

export const Destructive = Template.bind({});
Destructive.args = {
  children: 'Destructive Button',
  variant: 'destructive',
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Outline Button',
  variant: 'outline',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Secondary Button',
  variant: 'secondary',
};