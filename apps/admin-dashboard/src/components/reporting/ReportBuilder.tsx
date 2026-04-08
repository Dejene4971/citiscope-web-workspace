import React, { useState } from 'react';
import {
  Paper, Typography, Box, Grid, FormControlLabel, Checkbox,
  TextField, Button, Chip, Divider, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { Download, Preview } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MONTHLY_LABELS, REPORTED_MONTHLY, RESOLVED_MONTHLY, RISK_DATA } from '../../data/mockAnalyticsData';

const SECTIONS = [
  { id: 'summary',     label: 'Executive Summary'    },
  { id: 'issues',      label: 'Issue Statistics'     },
  { id: 'risk',        label: 'Risk Assessment'      },
  { id: 'maintenance', label: 'Maintenance Schedule' },
  { id: 'resources',   label: 'Resource Allocation'  },
];

const FORMATS = ['Excel (.xlsx)', 'CSV (.csv)', 'JSON (.json)'];

export const ReportBuilder: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(['summary', 'issues']);
  const [format, setFormat] = useState('Excel (.xlsx)');
  const [title, setTitle] = useState('CitiScope Infrastructure Report');
  const [generated, setGenerated] = useState(false);

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const generate = () => {
    const rows: Record<string, unknown>[] = [];

    if (selected.includes('summary')) {
      rows.push({ Section: 'Summary', Metric: 'Total Reported', Value: REPORTED_MONTHLY.reduce((a, b) => a + b, 0) });
      rows.push({ Section: 'Summary', Metric: 'Total Resolved', Value: RESOLVED_MONTHLY.reduce((a, b) => a + b, 0) });
    }
    if (selected.includes('issues')) {
      MONTHLY_LABELS.forEach((m, i) => rows.push({ Section: 'Issues', Month: m, Reported: REPORTED_MONTHLY[i], Resolved: RESOLVED_MONTHLY[i] }));
    }
    if (selected.includes('risk')) {
      RISK_DATA.forEach(r => rows.push({ Section: 'Risk', Category: r.category, Score: r.score, Trend: `${r.trend}%` }));
    }

    if (format.startsWith('Excel')) {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${title.replace(/\s+/g, '_')}.xlsx`);
    } else if (format.startsWith('CSV')) {
      const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n');
      saveAs(new Blob([csv], { type: 'text/csv' }), `${title.replace(/\s+/g, '_')}.csv`);
    } else {
      saveAs(new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' }), `${title.replace(/\s+/g, '_')}.json`);
    }
    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>Report Builder</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select sections and export format to generate a custom report
      </Typography>

      <TextField
        fullWidth label="Report Title" value={title}
        onChange={e => setTitle(e.target.value)} size="small" sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>Include Sections</Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {SECTIONS.map(s => (
          <Grid item xs={12} sm={6} key={s.id}>
            <FormControlLabel
              control={<Checkbox size="small" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />}
              label={s.label}
            />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 2 }} />

      <FormControl size="small" fullWidth sx={{ mb: 3 }}>
        <InputLabel>Export Format</InputLabel>
        <Select value={format} label="Export Format" onChange={e => setFormat(e.target.value)}>
          {FORMATS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<Download />} onClick={generate} disabled={selected.length === 0}>
          Generate Report
        </Button>
        {generated && <Chip label="✓ Downloaded" color="success" size="small" sx={{ alignSelf: 'center' }} />}
      </Box>
    </Paper>
  );
};
