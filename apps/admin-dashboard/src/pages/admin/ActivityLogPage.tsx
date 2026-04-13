import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Chip, TextField,
  InputAdornment, FormControl, InputLabel, Select, MenuItem,
  Button, Alert,
} from '@mui/material';
import { Search, Download } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { auditService, type AuditAction } from '../../services/auditService';
import type { RootState } from '../../store/store';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ACTION_COLOR: Record<string, 'error' | 'warning' | 'success' | 'info' | 'default'> = {
  CREATE_ISSUE:        'success',
  UPDATE_STATUS:       'info',
  ASSIGN_TECHNICIAN:   'info',
  RESOLVE_ISSUE:       'success',
  IOT_ALERT_RECEIVED:  'warning',
  USER_LOGIN:          'default',
  USER_LOGOUT:         'default',
  MAP_MARKER_SELECTED: 'default',
};

export const ActivityLogPage: React.FC = () => {
  const user    = useSelector((s: RootState) => s.auth.user);
  const userData = (user as any)?.user ?? user;
  const role    = userData?.role ?? 'woreda_admin';

  const [search, setSearch]       = useState('');
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');
  const [dateFrom, setDateFrom]   = useState('');

  const entries = auditService.getAll();

  const filtered = useMemo(() => entries.filter(e => {
    if (actionFilter !== 'all' && e.action !== actionFilter) return false;
    if (dateFrom && e.timestamp < dateFrom) return false;
    if (search && !JSON.stringify(e).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [entries, actionFilter, dateFrom, search]);

  const exportLog = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(e => ({
      ID: e.id, Action: e.action, EntityID: e.entityId ?? '',
      EntityType: e.entityType ?? '', UserID: e.userId ?? '',
      Timestamp: e.timestamp, Payload: JSON.stringify(e.payload ?? {}),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Log');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `audit_log_${Date.now()}.xlsx`);
  };

  if (role !== 'federal_admin') {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Access denied. Activity log is restricted to Federal Administrators.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Activity Log</Typography>
          <Typography variant="body2" color="text.secondary">{filtered.length} entries</Typography>
        </Box>
        <Button variant="outlined" startIcon={<Download />} onClick={exportLog}>Export</Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ width: 240 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Action Type</InputLabel>
          <Select value={actionFilter} label="Action Type" onChange={e => setActionFilter(e.target.value as AuditAction | 'all')}>
            <MenuItem value="all">All Actions</MenuItem>
            {(['CREATE_ISSUE','UPDATE_STATUS','ASSIGN_TECHNICIAN','RESOLVE_ISSUE','IOT_ALERT_RECEIVED','USER_LOGIN','USER_LOGOUT'] as AuditAction[]).map(a => (
              <MenuItem key={a} value={a}>{a.replace(/_/g, ' ')}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField size="small" label="From Date" type="date" value={dateFrom}
          onChange={e => setDateFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb' }}>
              {['Timestamp', 'Action', 'Entity', 'User', 'Details'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No entries found</TableCell></TableRow>
            ) : filtered.slice(0, 200).map(e => (
              <TableRow key={e.id} hover>
                <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 12 }}>{new Date(e.timestamp).toLocaleString()}</TableCell>
                <TableCell><Chip label={e.action.replace(/_/g, ' ')} size="small" color={ACTION_COLOR[e.action] ?? 'default'} /></TableCell>
                <TableCell sx={{ fontSize: 12 }}>{e.entityId ?? '—'} {e.entityType ? `(${e.entityType})` : ''}</TableCell>
                <TableCell sx={{ fontSize: 12 }}>{e.userId ?? '—'}</TableCell>
                <TableCell sx={{ fontSize: 11, color: 'text.secondary', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.payload ? JSON.stringify(e.payload) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
