import React, { useState } from 'react';
import {
  Box, Typography, Paper, Slider, TextField, Chip,
  FormControl, InputLabel, Select, MenuItem, Divider,
  Grid, Alert,
} from '@mui/material';
import { WaterDrop, Bolt } from '@mui/icons-material';

interface SensorThreshold {
  id: string;
  name: string;
  location: string;
  icon: React.ReactNode;
  unit: string;
  criticalHigh: number;
  warningHigh: number;
  criticalMin: number;
  criticalMax: number;
  checkFrequency: string;
  priority: 'critical' | 'high' | 'medium';
  note?: string;
}

const INITIAL_THRESHOLDS: SensorThreshold[] = [
  {
    id: 'water-reservoir',
    name: 'Water Reservoir Level',
    location: 'Gible III Dam Monitoring',
    icon: <WaterDrop color="primary" />,
    unit: 'M',
    criticalHigh: 180.5,
    warningHigh: 175.0,
    criticalMin: 150,
    criticalMax: 200,
    checkFrequency: '1',
    priority: 'high',
  },
  {
    id: 'grid-load',
    name: 'Grid Load Variance',
    location: 'Addis Ababa Metropolitan Area',
    icon: <Bolt color="warning" />,
    unit: '%',
    criticalHigh: 92,
    warningHigh: 80,
    criticalMin: 0,
    criticalMax: 100,
    checkFrequency: '60',
    priority: 'critical',
    note: 'Critical priority bypasses quiet hours for SMS dispatch',
  },
];

const PRIORITY_COLOR: Record<string, 'error' | 'warning' | 'info'> = {
  critical: 'error', high: 'warning', medium: 'info',
};

export const AlertThresholdsPanel: React.FC = () => {
  const [thresholds, setThresholds] = useState(INITIAL_THRESHOLDS);

  const update = (id: string, field: keyof SensorThreshold, value: unknown) =>
    setThresholds(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>Alert Thresholds — IoT Sensors</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure sensor alert levels and monitoring frequency
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {thresholds.map(t => (
          <Paper key={t.id} sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {t.icon}
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>{t.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{t.location}</Typography>
                </Box>
              </Box>
              <Chip
                label={t.priority.toUpperCase()}
                size="small"
                color={PRIORITY_COLOR[t.priority]}
                sx={{ fontWeight: 700 }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Critical High ({t.unit})
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={t.criticalHigh}
                    min={t.criticalMin}
                    max={t.criticalMax}
                    step={0.5}
                    onChange={(_, v) => update(t.id, 'criticalHigh', v)}
                    color="error"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    value={t.criticalHigh}
                    onChange={e => update(t.id, 'criticalHigh', parseFloat(e.target.value) || 0)}
                    sx={{ width: 90 }}
                    inputProps={{ step: 0.5 }}
                    type="number"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Warning High ({t.unit})
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={t.warningHigh}
                    min={t.criticalMin}
                    max={t.criticalMax}
                    step={0.5}
                    onChange={(_, v) => update(t.id, 'warningHigh', v)}
                    color="warning"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    value={t.warningHigh}
                    onChange={e => update(t.id, 'warningHigh', parseFloat(e.target.value) || 0)}
                    sx={{ width: 90 }}
                    inputProps={{ step: 0.5 }}
                    type="number"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Check Frequency</InputLabel>
                  <Select
                    value={t.checkFrequency}
                    label="Check Frequency"
                    onChange={e => update(t.id, 'checkFrequency', e.target.value)}
                  >
                    <MenuItem value="1">Real-time (1m)</MenuItem>
                    <MenuItem value="5">Every 5 minutes</MenuItem>
                    <MenuItem value="15">Every 15 minutes</MenuItem>
                    <MenuItem value="60">Hourly (60m)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {t.note && (
              <Alert severity="info" sx={{ mt: 2, py: 0.5 }}>
                <Typography variant="caption">{t.note}</Typography>
              </Alert>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
