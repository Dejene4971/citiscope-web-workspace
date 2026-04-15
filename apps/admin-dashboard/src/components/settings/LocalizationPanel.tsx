import React, { useState } from 'react';
import {
  Box, Typography, Paper, FormControl, InputLabel,
  Select, MenuItem, Button, Divider, Grid, Chip,
} from '@mui/material';
import { Save, RestartAlt, Language, Schedule, CalendarMonth, LocationOn } from '@mui/icons-material';
import { showToast } from '../notifications/ToastNotifications';

interface LocalizationConfig {
  language: string;
  timezone: string;
  dateFormat: string;
  region: string;
}

const DEFAULTS: LocalizationConfig = {
  language: 'en-US',
  timezone: 'EAT',
  dateFormat: 'gregorian',
  region: 'federal',
};

export const LocalizationPanel: React.FC = () => {
  const [config, setConfig] = useState<LocalizationConfig>(DEFAULTS);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const update = (key: keyof LocalizationConfig, value: string) =>
    setConfig(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setLastSaved(new Date());
    showToast({ type: 'success', title: 'Settings Saved', message: 'Localization settings updated successfully' });
  };

  const handleReset = () => {
    setConfig(DEFAULTS);
    showToast({ type: 'info', title: 'Reset', message: 'Localization settings reset to defaults' });
  };

  const SETTINGS = [
    {
      key: 'language' as const,
      label: 'Interface Language',
      icon: <Language fontSize="small" color="action" />,
      options: [
        { value: 'en-US', label: 'English (US) — Default' },
        { value: 'am',    label: 'Amharic (አማርኛ)' },
        { value: 'om',    label: 'Oromo (Afaan Oromoo)' },
        { value: 'ar',    label: 'Arabic (العربية)' },
      ],
    },
    {
      key: 'timezone' as const,
      label: 'Timezone',
      icon: <Schedule fontSize="small" color="action" />,
      options: [
        { value: 'EAT',  label: 'East Africa Time (EAT) — UTC+3' },
        { value: 'UTC',  label: 'UTC' },
        { value: 'CET',  label: 'Central European Time (CET) — UTC+1' },
      ],
    },
    {
      key: 'dateFormat' as const,
      label: 'Date Format',
      icon: <CalendarMonth fontSize="small" color="action" />,
      options: [
        { value: 'gregorian',  label: 'Gregorian Calendar' },
        { value: 'ethiopian',  label: 'Ethiopian Calendar (ዘመን)' },
      ],
    },
    {
      key: 'region' as const,
      label: 'Region',
      icon: <LocationOn fontSize="small" color="action" />,
      options: [
        { value: 'federal',  label: 'Federal — National Level' },
        { value: 'addis',    label: 'Addis Ababa City Administration' },
        { value: 'oromia',   label: 'Oromia Regional State' },
        { value: 'amhara',   label: 'Amhara Regional State' },
        { value: 'tigray',   label: 'Tigray Regional State' },
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>Localization</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure language, timezone, and regional preferences
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb', mb: 3 }}>
        <Grid container spacing={3}>
          {SETTINGS.map(s => (
            <Grid item xs={12} sm={6} key={s.key}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {s.icon}
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {s.label}
                </Typography>
              </Box>
              <FormControl fullWidth size="small">
                <Select value={config[s.key]} onChange={e => update(s.key, e.target.value)}>
                  {s.options.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {lastSaved
            ? `Last saved: ${lastSaved.toLocaleString()} by Admin`
            : 'No unsaved changes'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RestartAlt />} onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
            Update System Settings
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
