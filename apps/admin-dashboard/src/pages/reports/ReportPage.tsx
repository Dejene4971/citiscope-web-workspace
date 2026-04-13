import React, { useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, FormControl, InputLabel,
  Select, MenuItem, Chip, Divider, Alert, CircularProgress,
  TextField, Switch, FormControlLabel,
} from '@mui/material';
import { Download, Schedule, Preview } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { auditService } from '../../services/auditService';
import { MONTHLY_LABELS, REPORTED_MONTHLY, RESOLVED_MONTHLY, RISK_DATA, MAINTENANCE_PREDICTIONS } from '../../data/mockAnalyticsData';

type ReportType   = 'issues' | 'iot' | 'performance' | 'combined';
type ReportFormat = 'excel' | 'csv' | 'json';

const REPORT_TYPES: { value: ReportType; label: string; description: string }[] = [
  { value: 'issues',      label: 'Issues Report',       description: 'All reported issues with status and resolution data' },
  { value: 'iot',         label: 'IoT Sensors Report',  description: 'Sensor readings, alerts, and maintenance history' },
  { value: 'performance', label: 'Performance Report',  description: 'KPIs, resolution rates, and resource utilization' },
  { value: 'combined',    label: 'Combined Report',     description: 'Full system overview across all modules' },
];

function buildReportData(type: ReportType, from: string, to: string) {
  const meta = { reportType: type, generatedAt: new Date().toISOString(), dateFrom: from, dateTo: to };
  switch (type) {
    case 'issues':
      return MONTHLY_LABELS.map((m, i) => ({ ...meta, month: m, reported: REPORTED_MONTHLY[i], resolved: RESOLVED_MONTHLY[i] }));
    case 'iot':
      return MAINTENANCE_PREDICTIONS.map(p => ({ ...meta, asset: p.asset, daysUntilFailure: p.daysUntilFailure, confidence: p.confidence, action: p.action }));
    case 'performance':
      return RISK_DATA.map(r => ({ ...meta, category: r.category, riskScore: r.score, trend: r.trend, currentIssues: r.issues, predicted: r.predicted }));
    case 'combined':
      return [
        ...MONTHLY_LABELS.map((m, i) => ({ ...meta, section: 'issues', month: m, reported: REPORTED_MONTHLY[i], resolved: RESOLVED_MONTHLY[i] })),
        ...RISK_DATA.map(r => ({ ...meta, section: 'risk', category: r.category, score: r.score })),
      ];
  }
}

export const ReportPage: React.FC = () => {
  const [reportType, setReportType]   = useState<ReportType>('issues');
  const [format, setFormat]           = useState<ReportFormat>('excel');
  const [dateFrom, setDateFrom]       = useState('2026-01-01');
  const [dateTo, setDateTo]           = useState(new Date().toISOString().split('T')[0]);
  const [schedule, setSchedule]       = useState(false);
  const [scheduleEmail, setScheduleEmail] = useState('');
  const [generating, setGenerating]   = useState(false);
  const [done, setDone]               = useState(false);

  const selectedDef = REPORT_TYPES.find(r => r.value === reportType)!;

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 600)); // simulate processing
    const data = buildReportData(reportType, dateFrom, dateTo);
    const filename = `citiscope_${reportType}_${dateFrom}_${dateTo}`;

    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${filename}.xlsx`);
    } else if (format === 'csv') {
      const csv = [Object.keys(data[0]).join(','), ...data.map(r => Object.values(r).join(','))].join('\n');
      saveAs(new Blob([csv], { type: 'text/csv' }), `${filename}.csv`);
    } else {
      saveAs(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `${filename}.json`);
    }

    auditService.log('CREATE_ISSUE', { entityType: 'report', payload: { type: reportType, format, dateFrom, dateTo } });
    setGenerating(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Report Generation</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Generate and export infrastructure reports in multiple formats
      </Typography>

      <Grid container spacing={3}>
        {/* Config panel */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Report Configuration</Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Report Type</InputLabel>
              <Select value={reportType} label="Report Type" onChange={e => setReportType(e.target.value as ReportType)}>
                {REPORT_TYPES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
              </Select>
            </FormControl>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Date From" type="date" value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Date To" type="date" value={dateTo}
                  onChange={e => setDateTo(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Export Format</InputLabel>
              <Select value={format} label="Export Format" onChange={e => setFormat(e.target.value as ReportFormat)}>
                <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                <MenuItem value="csv">CSV (.csv)</MenuItem>
                <MenuItem value="json">JSON (.json)</MenuItem>
              </Select>
            </FormControl>

            <Divider sx={{ mb: 2 }} />

            <FormControlLabel
              control={<Switch checked={schedule} onChange={e => setSchedule(e.target.checked)} />}
              label="Schedule recurring delivery"
              sx={{ mb: schedule ? 2 : 0 }}
            />
            {schedule && (
              <TextField fullWidth size="small" label="Delivery Email" type="email"
                value={scheduleEmail} onChange={e => setScheduleEmail(e.target.value)}
                placeholder="admin@citiscope.gov.et" />
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" startIcon={generating ? <CircularProgress size={16} color="inherit" /> : <Download />}
                onClick={handleGenerate} disabled={generating} fullWidth>
                {generating ? 'Generating…' : 'Generate & Download'}
              </Button>
            </Box>
            {done && <Alert severity="success" sx={{ mt: 2 }}>Report downloaded successfully</Alert>}
          </Paper>
        </Grid>

        {/* Preview panel */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Preview</Typography>
              <Chip label={selectedDef.label} color="primary" size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedDef.description}</Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {Object.keys(buildReportData(reportType, dateFrom, dateTo)[0]).slice(0, 6).map(k => (
                      <th key={k} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buildReportData(reportType, dateFrom, dateTo).slice(0, 6).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      {Object.values(row).slice(0, 6).map((v, j) => (
                        <td key={j} style={{ padding: '8px 12px', color: '#374151' }}>{String(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Showing first 6 rows of preview · Full report contains all data for selected date range
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
