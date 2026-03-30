import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Chip, Grid,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TextField, InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { fetchStart, fetchSuccess, selectIssue } from '../../features/issues/issuesSlice';
import type { RootState, AppDispatch } from '../../store/store';
import type { Issue } from '@citiscope/types';

const MOCK_ISSUES: Issue[] = [
  { issue_id: '1', title: 'Burst Water Pipe on Bole Road',    description: 'Major water leak causing flooding',      category: 'water',       severity: 'critical', status: 'pending',     location: { latitude: 9.011, longitude: 38.746, woreda_id: 'W-001' }, reported_by: 'citizen-1', reported_at: '2026-03-25T10:00:00Z', media_urls: [], upvotes: 12 },
  { issue_id: '2', title: 'Large Pothole near Meskel Square', description: 'Deep pothole causing traffic issues',    category: 'road',        severity: 'high',     status: 'in_progress', location: { latitude: 9.033, longitude: 38.765, woreda_id: 'W-002' }, reported_by: 'citizen-2', reported_at: '2026-03-26T09:30:00Z', media_urls: [], upvotes: 8  },
  { issue_id: '3', title: 'Street Light Outage – Kazanchis',  description: 'Multiple street lights not working',    category: 'electricity', severity: 'medium',   status: 'assigned',    location: { latitude: 9.045, longitude: 38.712, woreda_id: 'W-003' }, reported_by: 'citizen-3', reported_at: '2026-03-27T18:00:00Z', media_urls: [], upvotes: 5  },
  { issue_id: '4', title: 'Sewage Overflow – Piassa',         description: 'Sewage overflow on main street',        category: 'sewage',      severity: 'high',     status: 'verified',    location: { latitude: 9.022, longitude: 38.733, woreda_id: 'W-001' }, reported_by: 'citizen-4', reported_at: '2026-03-27T14:00:00Z', media_urls: [], upvotes: 20 },
  { issue_id: '5', title: 'Uncollected Waste – Merkato',      description: 'Waste collection overdue by 3 days',    category: 'waste',       severity: 'low',      status: 'pending',     location: { latitude: 9.008, longitude: 38.754, woreda_id: 'W-004' }, reported_by: 'citizen-5', reported_at: '2026-03-28T08:00:00Z', media_urls: [], upvotes: 3  },
  { issue_id: '6', title: 'Road Crack – CMC Road',            description: 'Structural crack spreading across lane', category: 'road',       severity: 'medium',   status: 'resolved',    location: { latitude: 9.055, longitude: 38.780, woreda_id: 'W-002' }, reported_by: 'citizen-6', reported_at: '2026-03-24T11:00:00Z', media_urls: [], upvotes: 7  },
];

const SEV_COLOR: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  critical: 'error', high: 'warning', medium: 'info', low: 'success',
};
const STA_COLOR: Record<string, 'error' | 'warning' | 'info' | 'success' | 'default'> = {
  pending: 'warning', verified: 'info', assigned: 'info', in_progress: 'warning', resolved: 'success',
};

export const IssuesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((s: RootState) => s.issues);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchStart());
    setTimeout(() => {
      dispatch(fetchSuccess({ data: MOCK_ISSUES, total: MOCK_ISSUES.length, page: 1, per_page: 20 }));
    }, 300);
  }, [dispatch]);

  const filtered = search
    ? items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Issues</Typography>
          <Typography variant="body2" color="text.secondary">{items.length} total issues</Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Search issues…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ width: 260 }}
        />
      </Box>

      {/* Severity summary */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {Object.entries(SEV_COLOR).map(([sev, color]) => (
          <Chip key={sev} size="small" color={color}
            label={`${sev}: ${items.filter(i => i.severity === sev).length}`} />
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#f9fafb' }}>
              {['Title', 'Category', 'Severity', 'Status', 'Reported', '👍'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Loading…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No issues found</TableCell></TableRow>
            ) : filtered.map(issue => (
              <TableRow
                key={issue.issue_id}
                hover
                onClick={() => dispatch(selectIssue(issue))}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ maxWidth: 240 }}>{issue.title}</TableCell>
                <TableCell><Chip label={issue.category} size="small" variant="outlined" /></TableCell>
                <TableCell><Chip label={issue.severity} size="small" color={SEV_COLOR[issue.severity]} /></TableCell>
                <TableCell><Chip label={issue.status.replace('_', ' ')} size="small" color={STA_COLOR[issue.status]} /></TableCell>
                <TableCell>{new Date(issue.reported_at).toLocaleDateString()}</TableCell>
                <TableCell>{issue.upvotes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
