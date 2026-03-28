import React from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeId?: string;
  collapsed?: boolean;
  logo?: React.ReactNode;
  onItemClick?: (item: SidebarItem) => void;
}

/**
 * Collapsible navigation sidebar.
 */
export const Sidebar: React.FC<SidebarProps> = ({ items, activeId, collapsed = false, logo, onItemClick }) => (
  <nav
    aria-label="Main navigation"
    style={{
      width: collapsed ? 64 : 240,
      background: '#1e293b',
      color: '#f1f5f9',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      overflow: 'hidden',
    }}
  >
    {logo && (
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #334155' }}>{logo}</div>
    )}
    <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0', flex: 1 }}>
      {items.map(item => {
        const isActive = item.id === activeId;
        return (
          <li key={item.id}>
            <button
              onClick={() => { item.onClick?.(); onItemClick?.(item); }}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '10px 16px',
                background: isActive ? '#334155' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}
            >
              {item.icon && <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>}
              {!collapsed && item.label}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);
