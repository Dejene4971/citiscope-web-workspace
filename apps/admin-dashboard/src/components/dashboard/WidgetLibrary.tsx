import React from 'react';
import {
  Paper, Typography, Grid, Box, Button, Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';

export interface WidgetDefinition {
  id: string;
  title: string;
  description: string;
  category: 'metrics' | 'charts' | 'maps' | 'alerts';
  defaultSize: 'small' | 'medium' | 'large';
}

export const WIDGET_CATALOG: WidgetDefinition[] = [
  { id: 'kpi-issues',      title: 'Issue KPIs',         description: 'Active, resolved, critical counts',    category: 'metrics', defaultSize: 'small'  },
  { id: 'trend-line',      title: 'Issue Trend',         description: 'Monthly reported vs resolved',         category: 'charts',  defaultSize: 'medium' },
  { id: 'category-donut',  title: 'Category Breakdown',  description: 'Issues by infrastructure category',    category: 'charts',  defaultSize: 'small'  },
  { id: 'risk-table',      title: 'Risk Assessment',     description: 'Risk scores by category',              category: 'metrics', defaultSize: 'medium' },
  { id: 'map-preview',     title: 'Map Overview',        description: 'Issue density map',                    category: 'maps',    defaultSize: 'large'  },
  { id: 'iot-alerts',      title: 'IoT Alerts',          description: 'Active sensor alerts',                 category: 'alerts',  defaultSize: 'medium' },
  { id: 'maintenance',     title: 'Maintenance Alerts',  description: 'Predicted failures',                   category: 'alerts',  defaultSize: 'medium' },
  { id: 'gauge-resolution','title': 'Resolution Rate',   description: 'Gauge showing resolution %',           category: 'metrics', defaultSize: 'small'  },
];

const CATEGORY_COLOR: Record<string, 'primary' | 'success' | 'warning' | 'error'> = {
  metrics: 'primary', charts: 'success', maps: 'warning', alerts: 'error',
};

interface WidgetLibraryProps {
  activeIds: string[];
  onAdd: (widget: WidgetDefinition) => void;
}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ activeIds, onAdd }) => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Typography variant="h6" fontWeight={700} gutterBottom>Widget Library</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Add widgets to your dashboard
    </Typography>
    <Grid container spacing={2}>
      {WIDGET_CATALOG.map(w => {
        const active = activeIds.includes(w.id);
        return (
          <Grid item xs={12} sm={6} md={4} key={w.id}>
            <Box
              sx={{
                p: 2, border: '1px solid', borderColor: active ? 'primary.main' : 'divider',
                borderRadius: 2, bgcolor: active ? 'primary.50' : 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" fontWeight={700}>{w.title}</Typography>
                <Chip label={w.category} size="small" color={CATEGORY_COLOR[w.category]} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {w.description}
              </Typography>
              <Button
                size="small"
                variant={active ? 'outlined' : 'contained'}
                startIcon={<Add />}
                disabled={active}
                onClick={() => onAdd(w)}
                fullWidth
              >
                {active ? 'Added' : 'Add Widget'}
              </Button>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Paper>
);
