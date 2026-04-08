import React, { useState, lazy, Suspense, useMemo } from 'react';
import {
  Box, Typography, Grid, Paper, Tabs, Tab,
  Button, Chip, CircularProgress,
} from '@mui/material';
import { Add, Save, Share } from '@mui/icons-material';

import { Widget } from '../../components/dashboard/Widget';
import { WidgetLibrary, WIDGET_CATALOG, type WidgetDefinition } from '../../components/dashboard/WidgetLibrary';
import { GaugeChart } from '../../components/charts/GaugeChart';
import { StackedBarChart } from '../../components/charts/StackedBarChart';
import { FunnelChart } from '../../components/charts/FunnelChart';
import { TreemapChart } from '../../components/charts/TreemapChart';
import { SankeyDiagram } from '../../components/charts/SankeyDiagram';
import { ReportBuilder } from '../../components/reporting/ReportBuilder';
import { MONTHLY_LABELS, REPORTED_MONTHLY, RESOLVED_MONTHLY } from '../../data/mockAnalyticsData';
import { offlineSync } from '../../services/offlineSync';

// Lazy-loaded heavy components
const RiskAssessment    = lazy(() => import('../../components/analytics/RiskAssessment').then(m => ({ default: m.RiskAssessment })));
const MaintenancePredictor = lazy(() => import('../../components/analytics/MaintenancePredictor').then(m => ({ default: m.MaintenancePredictor })));

const LAYOUT_KEY = 'dashboard:layout';

const FUNNEL_DATA = [
  { label: 'Reported',    value: 680, color: '#1976d2' },
  { label: 'Verified',    value: 520, color: '#0288d1' },
  { label: 'Assigned',    value: 410, color: '#0097a7' },
  { label: 'In Progress', value: 310, color: '#00897b' },
  { label: 'Resolved',    value: 240, color: '#2e7d32' },
];

const TREEMAP_DATA = [
  { label: 'Water',       value: 34, color: '#1976d2' },
  { label: 'Road',        value: 28, color: '#ed6c02' },
  { label: 'Electricity', value: 18, color: '#ffc107' },
  { label: 'Sewage',      value: 12, color: '#9c27b0' },
  { label: 'Waste',       value: 8,  color: '#2e7d32' },
];

const SANKEY_FLOWS = [
  { from: 'Reported',  to: 'Verified',    value: 520, color: '#90caf9' },
  { from: 'Reported',  to: 'Rejected',    value: 160, color: '#ef9a9a' },
  { from: 'Verified',  to: 'Resolved',    value: 240, color: '#a5d6a7' },
  { from: 'Verified',  to: 'In Progress', value: 280, color: '#ffe082' },
];

const STACKED_DATASETS = [
  { label: 'Water',       data: [8,10,6,12,9,8,14,13,11,15,13,16], color: '#1976d2' },
  { label: 'Road',        data: [7,8,5,10,8,7,11,10,9,12,11,13],   color: '#ed6c02' },
  { label: 'Electricity', data: [5,6,4,8,6,5,9,8,7,9,8,10],        color: '#ffc107' },
  { label: 'Other',       data: [3,4,3,5,4,3,6,5,4,6,5,7],         color: '#9c27b0' },
];

interface TabPanelProps { children: React.ReactNode; index: number; value: number; }
const TabPanel = ({ children, index, value }: TabPanelProps) => (
  <Box hidden={value !== index} sx={{ pt: 3 }}>{value === index && children}</Box>
);

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
    <CircularProgress size={28} />
  </Box>
);

export const AdvancedDashboard: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [activeWidgets, setActiveWidgets] = useState<string[]>(() => {
    return offlineSync.get<string[]>(LAYOUT_KEY) ?? ['kpi-issues', 'trend-line', 'gauge-resolution'];
  });
  const [saved, setSaved] = useState(false);

  const addWidget = (w: WidgetDefinition) => {
    setActiveWidgets(prev => [...prev, w.id]);
  };

  const removeWidget = (id: string) => {
    setActiveWidgets(prev => prev.filter(w => w !== id));
  };

  const saveLayout = () => {
    offlineSync.set(LAYOUT_KEY, activeWidgets, 7 * 24 * 60 * 60 * 1000); // 7 days
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Advanced Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Customizable · Interactive · Enterprise-grade
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={<Save />} onClick={saveLayout}>
            Save Layout
          </Button>
          {saved && <Chip label="✓ Saved" color="success" size="small" sx={{ alignSelf: 'center' }} />}
          <Button size="small" variant="outlined" startIcon={<Share />}>Share</Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 0 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab label="Overview Charts" />
          <Tab label="Flow Analysis" />
          <Tab label="Custom Dashboard" />
          <Tab label="Reports" />
        </Tabs>
      </Paper>

      {/* Tab 0 — Overview Charts */}
      <TabPanel value={tab} index={0}>
        <Grid container spacing={3}>
          {/* Gauges */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Performance Gauges</Typography>
              <Grid container spacing={2} justifyContent="center">
                {[
                  { label: 'Resolution Rate', value: 84 },
                  { label: 'Response Time',   value: 72 },
                  { label: 'Citizen Satisfaction', value: 78 },
                  { label: 'Resource Efficiency',  value: 65 },
                ].map(g => (
                  <Grid item key={g.label}>
                    <GaugeChart value={g.value} label={g.label} size={140} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Stacked bar */}
          <Grid item xs={12} md={8}>
            <StackedBarChart
              labels={MONTHLY_LABELS}
              datasets={STACKED_DATASETS}
              title="Issues by Category (Monthly)"
              height={280}
            />
          </Grid>

          {/* Treemap */}
          <Grid item xs={12} md={4}>
            <TreemapChart nodes={TREEMAP_DATA} title="Issue Distribution" height={280} />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 1 — Flow Analysis */}
      <TabPanel value={tab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FunnelChart stages={FUNNEL_DATA} title="Issue Resolution Pipeline" />
          </Grid>
          <Grid item xs={12} md={6}>
            <SankeyDiagram flows={SANKEY_FLOWS} title="Issue Flow Diagram" />
          </Grid>
          <Grid item xs={12} md={7}>
            <Suspense fallback={<Loader />}>
              <RiskAssessment />
            </Suspense>
          </Grid>
          <Grid item xs={12} md={5}>
            <Suspense fallback={<Loader />}>
              <MaintenancePredictor />
            </Suspense>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 2 — Custom Dashboard */}
      <TabPanel value={tab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {activeWidgets.map(id => {
                const def = WIDGET_CATALOG.find(w => w.id === id);
                if (!def) return null;
                return (
                  <Grid item xs={12} sm={def.defaultSize === 'small' ? 6 : 12} key={id}>
                    <Widget id={id} title={def.title} onRemove={removeWidget} minHeight={120}>
                      <Typography variant="body2" color="text.secondary">{def.description}</Typography>
                      {id === 'gauge-resolution' && <GaugeChart value={84} label="Resolution Rate" size={120} />}
                      {id === 'kpi-issues' && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Chip label="Active: 124" color="warning" size="small" />
                          <Chip label="Resolved: 89" color="success" size="small" />
                          <Chip label="Critical: 5" color="error" size="small" />
                        </Box>
                      )}
                    </Widget>
                  </Grid>
                );
              })}
              {activeWidgets.length === 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '2px dashed #e0e0e0' }}>
                    <Typography color="text.secondary">No widgets added. Use the library to add widgets.</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <WidgetLibrary activeIds={activeWidgets} onAdd={addWidget} />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 3 — Reports */}
      <TabPanel value={tab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <ReportBuilder />
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Offline Cache Status</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Data cached locally for offline access
              </Typography>
              {[
                { key: 'Issues data',    ttl: '5 min',  status: 'fresh'   },
                { key: 'IoT sensors',    ttl: '1 min',  status: 'fresh'   },
                { key: 'Analytics',      ttl: '15 min', status: 'cached'  },
                { key: 'Dashboard layout', ttl: '7 days', status: 'saved' },
              ].map(item => (
                <Box key={item.key} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #f3f4f6' }}>
                  <Typography variant="body2">{item.key}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={item.ttl} size="small" variant="outlined" />
                    <Chip label={item.status} size="small" color={item.status === 'fresh' ? 'success' : 'info'} />
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};
