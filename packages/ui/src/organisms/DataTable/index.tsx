import React from 'react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T extends { [key: string]: unknown }> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

/**
 * Generic sortable data table.
 */
export function DataTable<T extends { [key: string]: unknown }>({
  columns, data, keyField, loading, emptyMessage = 'No data', onRowClick, className,
}: DataTableProps<T>) {
  return (
    <div className={className} style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e5e7eb' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            {columns.map(col => (
              <th
                key={String(col.key)}
                style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>Loading…</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>{emptyMessage}</td></tr>
          ) : (
            data.map(row => (
              <tr
                key={String(row[keyField])}
                onClick={() => onRowClick?.(row)}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  cursor: onRowClick ? 'pointer' : undefined,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (onRowClick) (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
              >
                {columns.map(col => (
                  <td key={String(col.key)} style={{ padding: '10px 16px', color: '#111827' }}>
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
