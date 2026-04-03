import React, { useState } from 'react';
import {
  Paper, Typography, Box, Button, ButtonGroup,
  Chip, Divider, List, ListItem, ListItemText, ListItemIcon,
  Snackbar, Alert,
} from '@mui/material';
import {
  Download, TableChart, DataObject, PictureAsPdf,
  Schedule, CheckCircle,
} from '@mui/icons-material';
import {
  REPORTED_MONTHLY, RESOLVED_MONTHLY, MONTHLY_LABELS,
  RISK_DATA, MAINTENANCE_PREDICTIONS,
} from '../../data/mockAnalyticsData';

const REPORTS = [
  { id: 'monthly',     label: 'Monthly Summary',       icon: <TableChart />,    format: 'CSV'  },
  { id: 'risk',        label: 'Risk Assessment Report', icon: <PictureAsPdf />,  format: 'PDF'  },
  { id: 'maintenance', label: 'Maintenance Schedule',   icon: <Schedule />,      format: 'Excel'},
  { id: 'raw',         label: 'Raw Issue Data',         icon: <DataObject />,    format: 'JSON' },
];

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/**
 * Data export panel — CSV, JSON, and simulated PDF/Excel downloads.
 */
export const DataExport: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);

  const handleExport = (id: string) => {
    switch (id) {
      case 'monthly':
        downloadCSV('monthly_summary.csv', [
          ['Month', 'Reported', 'Resolved', 'Resolution Rate'],
          ...MONTHLY_LABELS.map((m, i) => [
            m,
            String(REPORTED_MONTHLY[i]),
            String(RESOLVED_MONTHLY[i]),
            `${((RESOLVED_MONTHLY[i] / REPORTED_MONTHLY[i]) * 100).toFixed(1)}%`,
          ]),
        ]);
        break;
      case 'risk':
        downloadCSV('risk_assessment.csv', [
          ['Category', 'Risk Score', 'Trend', 'Current Issues', 'Predicted'],
          ...RISK_DATA.map(r => [r.category, String(r.score), `${r.trend}%`, String(r.issues), String(r.predicted)]),
        ]);
        break;
      case 'maintenance':
        downloadCSV('maintenance_schedule.csv', [
          ['Asset', 'Days Until Failure', 'Confidence', 'Action'],
          ...MAINTENANCE_PREDICTIONS.map(m => [m.asset, String(m.daysUntilFailure), `${m.confidence}%`, m.action]),
        ]);
        break;
      case 'raw':
        downloadJSON('issue_data.json', { monthly: MONTHLY_LABELS.map((m, i) => ({ month: m, reported: REPORTED_MONTHLY[i], resolved: RESOLVED_MONTHLY[i] })) });
        break;
    }
    setToast('Export started — check your downloads');
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>Export & Reports</Typography>
        <Download color="action" />
      </Box>

      <List disablePadding>
        {REPORTS.map((r, i) => (
          <React.Fragment key={r.id}>
            {i > 0 && <Divider />}
            <ListItem
              disablePadding
              sx={{ py: 1.5 }}
              secondaryAction={
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleExport(r.id)}
                >
                  {r.format}
                </Button>
              }
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{r.icon}</ListItemIcon>
              <ListItemText
                primary={r.label}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" icon={<CheckCircle />} onClose={() => setToast(null)}>
          {toast}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
