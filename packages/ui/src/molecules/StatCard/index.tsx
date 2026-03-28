import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  /** Percentage change, positive = up, negative = down */
  trend?: number;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

/**
 * Dashboard metric card showing a KPI value with optional trend indicator.
 */
export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, color = '#1976d2', className }) => {
  const trendColor = trend === undefined ? undefined : trend >= 0 ? '#2e7d32' : '#d32f2f';
  const trendSymbol = trend === undefined ? null : trend >= 0 ? '↑' : '↓';

  return (
    <div
      className={className}
      style={{
        background: '#fff',
        borderRadius: 10,
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,.08)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        borderLeft: `4px solid ${color}`,
      }}
    >
      {icon && (
        <span style={{ fontSize: 28, color, lineHeight: 1 }}>{icon}</span>
      )}
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', fontWeight: 500 }}>{title}</p>
        <p style={{ margin: '4px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>{value}</p>
        {trend !== undefined && (
          <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: trendColor, fontWeight: 600 }}>
            {trendSymbol} {Math.abs(trend)}% vs last period
          </p>
        )}
      </div>
    </div>
  );
};
