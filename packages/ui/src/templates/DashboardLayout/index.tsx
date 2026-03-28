import React from 'react';

export interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Two-column layout: fixed sidebar + scrollable main content area.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebar, header, children }) => (
  <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
    {sidebar}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {header && (
        <header style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 24px', background: '#fff', flexShrink: 0 }}>
          {header}
        </header>
      )}
      <main style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#f8fafc' }}>
        {children}
      </main>
    </div>
  </div>
);
