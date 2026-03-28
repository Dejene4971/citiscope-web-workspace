import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'warning', 'success'],
      description: 'Semantic color variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Variants ──────────────────────────────────────────────────────────────────

export const Primary: Story = { args: { variant: 'primary', children: 'Primary' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete Issue' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Escalate' } };
export const Success: Story = { args: { variant: 'success', children: 'Resolve' } };

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Small: Story = { args: { size: 'small', children: 'Small' } };
export const Medium: Story = { args: { size: 'medium', children: 'Medium' } };
export const Large: Story = { args: { size: 'large', children: 'Large' } };

// ── States ────────────────────────────────────────────────────────────────────

export const Loading: Story = { args: { loading: true, children: 'Saving…' } };
export const Disabled: Story = { args: { disabled: true, children: 'Disabled' } };
export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Full Width' },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};

// ── Icons ─────────────────────────────────────────────────────────────────────

export const WithStartIcon: Story = {
  args: {
    startIcon: <span>📍</span>,
    children: 'View on Map',
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: <span>→</span>,
    children: 'Next Step',
  },
};

export const WithBothIcons: Story = {
  args: {
    startIcon: <span>🔍</span>,
    endIcon: <span>↗</span>,
    children: 'Search Issues',
  },
};

// ── All Variants ──────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="success">Success</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};
