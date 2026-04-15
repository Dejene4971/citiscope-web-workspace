import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Chip,
  IconButton, InputAdornment, Divider, Grid, Alert,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Refresh, CheckCircle,
  Link, Send, Sms,
} from '@mui/icons-material';
import { showToast } from '../notifications/ToastNotifications';

export const SystemIntegrationsPanel: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('sk-ethio-7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c');
  const [webhookUri, setWebhookUri] = useState('https://api.civicintl.net/v1/webhooks/sensor-updates');
  const [testing, setTesting] = useState(false);

  const handleRegenerate = () => {
    const newKey = `sk-ethio-${Math.random().toString(36).slice(2, 18)}`;
    setApiKey(newKey);
    showToast({ type: 'warning', title: 'API Key Regenerated', message: 'Save the new key — it will not be shown again' });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    await new Promise(r => setTimeout(r, 1200));
    setTesting(false);
    showToast({ type: 'success', title: 'Connection Successful', message: 'GOV Integration endpoint is reachable' });
  };

  const maskedKey = showApiKey ? apiKey : `${apiKey.slice(0, 8)}${'•'.repeat(24)}${apiKey.slice(-4)}`;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>System Integrations</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage external service connections and API credentials
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Ethio-Telecom Gateway */}
        <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Sms color="primary" />
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>Ethio-Telecom Gateway</Typography>
                <Typography variant="caption" color="text.secondary">SMS & Voice Service Provider</Typography>
              </Box>
            </Box>
            <Chip
              icon={<CheckCircle sx={{ fontSize: 14 }} />}
              label="Connected"
              color="success"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            API KEY (READ/WRITE)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              fullWidth size="small"
              value={maskedKey}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowApiKey(v => !v)}>
                      {showApiKey ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { fontFamily: 'monospace', fontSize: 13 },
              }}
            />
            <Button variant="outlined" size="small" startIcon={<Refresh />} onClick={handleRegenerate} sx={{ whiteSpace: 'nowrap' }}>
              Regenerate
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Last sync: {new Date(Date.now() - 120000).toLocaleTimeString()}
          </Typography>
        </Paper>

        {/* GOV Integration */}
        <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Link color="secondary" />
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>GOV Integration</Typography>
                <Typography variant="caption" color="text.secondary">ETHIO CIVIC SERVICE PROVIDER</Typography>
              </Box>
            </Box>
            <Chip
              icon={<CheckCircle sx={{ fontSize: 14 }} />}
              label="Connected"
              color="success"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Webhook Endpoint URI
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth size="small"
              value={webhookUri}
              onChange={e => setWebhookUri(e.target.value)}
              InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
            />
            <Button variant="outlined" size="small" sx={{ whiteSpace: 'nowrap' }}>
              Update
            </Button>
            <Button
              variant="contained" size="small"
              startIcon={<Send />}
              onClick={handleTestConnection}
              disabled={testing}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {testing ? 'Testing…' : 'Test Connection'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
