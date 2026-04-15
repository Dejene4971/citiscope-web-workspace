import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  Layers as LayersIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import { MapView } from '../../components/map/MapView';
import { RootState } from '../../store/store';
import { toggleLayer } from '../../features/map/mapSlice';
import { orchestrator } from '../../services/workflowOrchestrator';
import { mockMarkers, mockBoundaries } from '../../data/mockMapData';

export const MapViewPage: React.FC = () => {
  const dispatch = useDispatch();
  const { markers, boundaries, viewState } = useSelector((state: RootState) => state.map);

  useEffect(() => {
    // Publish through orchestrator — no direct slice imports needed
    orchestrator.trigger('map:load_data', { markers: mockMarkers, boundaries: mockBoundaries });
  }, []);

  const getSeverityCount = (severity: string) => {
    return markers.filter(m => m.severity === severity).length;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Geospatial Map View
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Visualize infrastructure issues and IoT sensor alerts across administrative boundaries
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Map Container */}
        <Box sx={{ flex: 3 }}>
          <Paper elevation={2} sx={{ p: 1, borderRadius: 2 }}>
            <MapView height="600px" />
          </Paper>
        </Box>

        {/* Side Panel */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LayersIcon /> Map Controls
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Visibility Layers
            </Typography>
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={viewState.visibleLayers.issues}
                    onChange={() => dispatch(toggleLayer('issues'))}
                    color="primary"
                  />
                }
                label="Issues"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={viewState.visibleLayers.sensors}
                    onChange={() => dispatch(toggleLayer('sensors'))}
                    color="primary"
                  />
                }
                label="IoT Sensors"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={viewState.visibleLayers.boundaries}
                    onChange={() => dispatch(toggleLayer('boundaries'))}
                    color="primary"
                  />
                }
                label="Administrative Boundaries"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Issue Summary
            </Typography>
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip label="Critical" size="small" color="error" />
                <Typography variant="body2">{getSeverityCount('critical')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip label="High" size="small" color="warning" />
                <Typography variant="body2">{getSeverityCount('high')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip label="Medium" size="small" color="info" />
                <Typography variant="body2">{getSeverityCount('medium')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip label="Low" size="small" color="success" />
                <Typography variant="body2">{getSeverityCount('low')}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              IoT Sensors Active
            </Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {markers.filter(m => m.type === 'sensor').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {markers.filter(m => m.type === 'sensor' && m.severity === 'critical').length} critical alerts
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};