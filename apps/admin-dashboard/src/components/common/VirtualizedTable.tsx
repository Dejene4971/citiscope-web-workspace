import React from 'react';
import {
  Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
} from '@mui/material';
import { VirtualList } from './VirtualList';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: unknown) => string;
}

interface VirtualizedTableProps {
  columns: Column[];
  rows: Record<string, unknown>[];
  rowHeight?: number;
  height?: number;
}

/**
 * High-performance table using VirtualList windowing.
 * Only renders visible rows — handles thousands of items smoothly.
 */
const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  columns,
  rows,
  rowHeight = 52,
  height = 400,
}) => (
  <Paper sx={{ overflow: 'hidden' }}>
    <TableContainer>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>

    {/* Windowed body — only visible rows rendered */}
    <VirtualList
      items={rows}
      itemHeight={rowHeight}
      containerHeight={height}
      renderItem={(row) => (
        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <TableBody>
            <TableRow hover>
              {columns.map(col => (
                <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>
                  {col.format ? col.format(row[col.id]) : String(row[col.id] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      )}
    />
  </Paper>
);

export default VirtualizedTable;
