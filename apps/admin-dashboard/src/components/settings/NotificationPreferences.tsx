import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Switch, FormControlLabel,
  Divider, Button, Alert, Grid,
} from '@mui/material';
import { Save } from '@mui/icons-material';

interface Prefs {
  emailAlerts: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  criticalOnly: boolean;
  issueUpdates: boolean;
  iotAlerts: boolean;
  weeklyDigest: boolean;
}

const STORAGE_KEY = 'citiscope:notif_prefs';

const DEFAULTS: Prefs = {
  emailAlerts: true,
  pushNotifications: true,
  smsAlerts: false,
  criticalOnly: false,
  issueUpdates: true,
  iotAlerts: true,
  weeklyDigest: false,
};

export const NotificationPreferences: React.FC = () => {
  const [prefs, setPrefs] = useState<Prefs>(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }; }
    catch { return DEFAULTS; }
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof Prefs) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }));

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const CHANNELS = [
    { key: 'emailAlerts',       label: 'Email Alerts',        desc: 'Receive alerts via email'              },
    { key: 'pushNotifications', label: 'Push Notifications',  desc: 'Browser push notifications'            },
    { key: 'smsAlerts',         label: 'SMS Alerts',          desc: 'Text message for critical events'      },
  ] as const;

  const FILTERS = [
    { key: 'criticalOnly',  label: 'Critical Alerts Only', desc: 'Suppress non-critical notifications'  },
    { key: 'issueUpdates',  label: 'Issue Status Updates', desc: 'Notify on every status change'        },
    { key: 'iotAlerts',     label: 'IoT Sensor Alerts',    desc: 'Alerts from sensor network'           },
    { key: 'weeklyDigest',  label: 'Weekly Digest',        desc: 'Summary email every Monday'           },
  ] as const;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>Notification Preferences</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Control how and when you receive notifications
      </Typography>

      <Typography variant="subtitle2" gutterBottom>Delivery Channels</Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {CHANNELS.map(c => (
          <Grid item xs={12} key={c.key}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>{c.label}</Typography>
                <Typography variant="caption" color="text.secondary">{c.desc}</Typography>
              </Box>
              <Switch checked={prefs[c.key]} onChange={() => toggle(c.key)} />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle2" gutterBottom>Filters</Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {FILTERS.map(f => (
          <Grid item xs={12} key={f.key}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>{f.label}</Typography>
                <Typography variant="caption" color="text.secondary">{f.desc}</Typography>
              </Box>
              <Switch checked={prefs[f.key]} onChange={() => toggle(f.key)} />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" startIcon={<Save />} onClick={save} fullWidth>
        Save Preferences
      </Button>
      {saved && <Alert severity="success" sx={{ mt: 2 }}>Preferences saved</Alert>}
    </Paper>
  );
};
