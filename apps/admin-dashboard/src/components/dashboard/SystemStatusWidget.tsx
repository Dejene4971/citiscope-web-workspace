import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Chip, Grid, LinearProgress, Tooltip } from '@mui/material';
import { CheckCircle, Warning, Error, Sync } from '@mui/icons-material';
import { systemHealthMonitor } from '../../services/systemHealthMonitor';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface StatusRow { label: string; value: string | number; status: 'ok' | 'warn' | 'error'; }

const STATUS_ICON = {
  ok:    <CheckCircle fontSize="small" color="success" />,
  warn:  <Warning     fontSize="small" color="warning" />,
  error: <Error       fontSize="small" color="error"   />,
};

export const SystemStatusWidget: React.FC = React.memo(() => {
  const unreadCount = useSelector((s: RootState) => s.ui.unreadCount);
  const [lastSync]  = useState(new Date().toLocaleTimeString());
  const [latency, setLatency] = useState<number | null>(null);
  const [wsStatus, setWsStatus] = useState<'ok' | 'warn' | 'error'>('ok');

  useEffect(() => {
    // Register a simple API latency check
    systemHealthMonitor.registerCheck('api', async () => {
      const t = Date.now();
      try { await fetch('/api/health', { signal: AbortSignal.timeout(3000) }); setLatency(Date.now() - t); return true; }
      catch { setLatency(null); return false; }
    }, 5000);

    const unsub = systemHealthMonitor.subscribe(checks => {
      const api = checks.get('api');
      if (api) setLatency(api.latency);
    });
    return unsub;
  }, []);

  const overall = systemHealthMonitor.getOverallStatus();

  const rows: StatusRow[] = [
    { label: 'System Health',   value: overall,                          status: overall === 'healthy' ? 'ok' : overall === 'degraded' ? 'warn' : 'error' },
    { label: 'API Latency',     value: latency != null ? `${latency}ms` : 'N/A', status: latency == null ? 'error' : latency < 300 ? 'ok' : latency < 800 ? 'warn' : 'error' },
    { label: 'Active Alerts',   value: unreadCount,                      status: unreadCount === 0 ? 'ok' : unreadCount < 5 ? 'warn' : 'error' },
    { label: 'Last Sync',       value: lastSync,                         status: 'ok' },
    { label: 'WebSocket',       value: 'Connected',                      status: wsStatus },
  ];

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>System Status</Typography>
        <Chip
          label={overall}
          size="small"
          color={overall === 'healthy' ? 'success' : overall === 'degraded' ? 'warning' : 'error'}
          icon={<Sync fontSize="small" />}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {rows.map(row => (
          <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {STATUS_ICON[row.status]}
              <Typography variant="body2">{row.label}</Typography>
            </Box>
            <Typography variant="body2" fontWeight={600} color={
              row.status === 'ok' ? 'success.main' : row.status === 'warn' ? 'warning.main' : 'error.main'
            }>
              {row.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
});

SystemStatusWidget.displayName = 'SystemStatusWidget';
