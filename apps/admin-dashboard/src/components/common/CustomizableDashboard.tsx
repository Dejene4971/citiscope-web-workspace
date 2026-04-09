import React, { useState } from 'react';
import { Paper, Box, IconButton, Typography, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Add as AddIcon, Delete as DeleteIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  title: string;
}

interface CustomizableDashboardProps {
  initialWidgets?: Widget[];
  onSave?: (widgets: Widget[]) => void;
}

const availableWidgets = [
  { type: 'metrics',    title: 'Performance Metrics',   defaultSize: { w: 2, h: 2 } },
  { type: 'chart-line', title: 'Issue Trends',           defaultSize: { w: 4, h: 3 } },
  { type: 'chart-pie',  title: 'Category Distribution',  defaultSize: { w: 3, h: 3 } },
  { type: 'map',        title: 'Issue Map',              defaultSize: { w: 6, h: 4 } },
  { type: 'table',      title: 'Recent Issues',          defaultSize: { w: 4, h: 3 } },
  { type: 'alerts',     title: 'Active Alerts',          defaultSize: { w: 3, h: 2 } },
];

export const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  initialWidgets = [],
  onSave,
}) => {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const addWidget = (widgetType: typeof availableWidgets[0]) => {
    const newWidget: Widget = {
      i: `${widgetType.type}-${Date.now()}`,
      x: (widgets.length % 12) * 2,
      y: Infinity,
      w: widgetType.defaultSize.w,
      h: widgetType.defaultSize.h,
      type: widgetType.type,
      title: widgetType.title,
    };
    setWidgets(prev => [...prev, newWidget]);
    setDrawerOpen(false);
  };

  const removeWidget = (id: string) =>
    setWidgets(prev => prev.filter(w => w.i !== id));

  const handleLayoutChange = (layout: { i: string; x: number; y: number; w: number; h: number }[]) => {
    setWidgets(prev => prev.map(widget => {
      const item = layout.find(l => l.i === widget.i);
      return item ? { ...widget, x: item.x, y: item.y, w: item.w, h: item.h } : widget;
    }));
  };

  const handleSave = () => {
    onSave?.(widgets);
    setIsEditing(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Customizable Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDrawerOpen(true)}>
            Add Widget
          </Button>
          {!isEditing ? (
            <Button variant="outlined" onClick={() => setIsEditing(true)}>Customize Layout</Button>
          ) : (
            <>
              <Button variant="outlined" color="error" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>Save Layout</Button>
            </>
          )}
        </Box>
      </Box>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: widgets }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={150}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditing}
        isResizable={isEditing}
        draggableHandle=".drag-handle"
      >
        {widgets.map(widget => (
          <div key={widget.i} data-grid={{ x: widget.x, y: widget.y, w: widget.w, h: widget.h }}>
            <Paper
              sx={{
                height: '100%', overflow: 'auto', position: 'relative',
                '&:hover .drag-handle': { opacity: 1 },
              }}
            >
              {isEditing && (
                <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4, zIndex: 1 }} onClick={() => removeWidget(widget.i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
              {isEditing && (
                <Box className="drag-handle" sx={{ position: 'absolute', top: 4, left: 4, cursor: 'move', opacity: 0, transition: 'opacity 0.2s' }}>
                  <DragIcon />
                </Box>
              )}
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>{widget.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 40px)' }}>
                  <Typography variant="body2" color="text.secondary">{widget.type.toUpperCase()} Widget</Typography>
                </Box>
              </Box>
            </Paper>
          </div>
        ))}
      </ResponsiveGridLayout>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>Add Widget</Typography>
          <List>
            {availableWidgets.map(widget => (
              <ListItem
                key={widget.type}
                onClick={() => addWidget(widget)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemText primary={widget.title} secondary={`${widget.defaultSize.w}×${widget.defaultSize.h} grid units`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};
