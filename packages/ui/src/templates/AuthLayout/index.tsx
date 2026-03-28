import React from 'react';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * Centred card layout for login / registration pages.
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    padding: 24,
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '40px 48px',
      width: '100%',
      maxWidth: 440,
      boxShadow: '0 20px 60px rgba(0,0,0,.3)',
    }}>
      {title && <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{title}</h1>}
      {subtitle && <p style={{ margin: '0 0 28px', color: '#6b7280', fontSize: '0.9375rem' }}>{subtitle}</p>}
      {children}
    </div>
  </div>
);
