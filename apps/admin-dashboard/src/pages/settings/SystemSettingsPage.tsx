import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { Tune, Policy, IntegrationInstructions, Language } from '@mui/icons-material';
import { AlertThresholdsPanel }   from '../../components/settings/AlertThresholdsPanel';
import { EscalationPolicyTable }  from '../../components/settings/EscalationPolicyTable';
import { SystemIntegrationsPanel } from '../../components/settings/SystemIntegrationsPanel';
import { LocalizationPanel }      from '../../components/settings/LocalizationPanel';

interface TabPanelProps { children: React.ReactNode; index: number; value: number; }
const TabPanel = ({ children, index, value }: TabPanelProps) => (
  <Box hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

const TABS = [
  { label: 'Alert Thresholds',  icon: <Tune fontSize="small" />                },
  { label: 'Escalation Policy', icon: <Policy fontSize="small" />              },
  { label: 'Integrations',      icon: <IntegrationInstructions fontSize="small" /> },
  { label: 'Localization',      icon: <Language fontSize="small" />            },
];

export const SystemSettingsPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>System Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure alert thresholds, escalation policies, integrations, and localization
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: '1px solid #e5e7eb', px: 2 }}
        >
          {TABS.map((t, i) => (
            <Tab
              key={t.label}
              label={t.label}
              icon={t.icon}
              iconPosition="start"
              sx={{ minHeight: 52, textTransform: 'none', fontWeight: tab === i ? 700 : 400 }}
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tab} index={0}><AlertThresholdsPanel /></TabPanel>
          <TabPanel value={tab} index={1}><EscalationPolicyTable /></TabPanel>
          <TabPanel value={tab} index={2}><SystemIntegrationsPanel /></TabPanel>
          <TabPanel value={tab} index={3}><LocalizationPanel /></TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};
