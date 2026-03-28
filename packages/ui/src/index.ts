// Theme
export { theme, citiscopeColors, citiscopeTypography } from './theme/theme';
export { ThemeProvider } from './theme/ThemeProvider';

// Atoms
export { Button } from './atoms/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './atoms/Button';

export { Input } from './atoms/Input';
export type { InputProps } from './atoms/Input';

export { Badge } from './atoms/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './atoms/Badge';

// Molecules
export { StatCard } from './molecules/StatCard';
export type { StatCardProps } from './molecules/StatCard';

export { SearchBar } from './molecules/SearchBar';
export type { SearchBarProps } from './molecules/SearchBar';

// Organisms
export { Sidebar } from './organisms/Sidebar';
export type { SidebarProps, SidebarItem } from './organisms/Sidebar';

export { DataTable } from './organisms/DataTable';
export type { DataTableProps, Column } from './organisms/DataTable';

// Templates
export { DashboardLayout } from './templates/DashboardLayout';
export type { DashboardLayoutProps } from './templates/DashboardLayout';

export { AuthLayout } from './templates/AuthLayout';
export type { AuthLayoutProps } from './templates/AuthLayout';

// Utils
export * from './utils/formatters';
export * from './utils/validators';
export * from './utils/constants';

// Legacy MUI-based components (backward compatibility)
export { LoadingSpinner } from './components/LoadingSpinner';
export type { LoadingSpinnerProps } from './components/LoadingSpinner';
export { Card } from './components/Card';
export type { CardProps } from './components/Card';
// StatCard legacy — exported under MuiStatCard to avoid collision with molecule
export { StatCard as MuiStatCard } from './components/StatCard';
export type { StatCardProps as MuiStatCardProps } from './components/StatCard';
