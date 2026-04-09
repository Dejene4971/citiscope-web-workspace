import React, { useState } from 'react';
import {
  Paper, Box, IconButton, Typography, Button,
  Drawer, List, ListItem, ListItemText, Grid,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, DragIndicator as DragIcon } from '@mui/icons-material';

interface Widget {
  i: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
}

interface CustomizableDashboardProps {
  initialWidgets?: Widget[];
  onSave?: (widgets: Widget[]) => void;
}

const AVAILABLE_WIDGETS = [
  { type: 'metrics',    title: 'Performance Metrics',  size: 'small'  as const },
  { type: 'chart-line', title: 'Issue Trends',          size: 'medium' as const },
  { type: 'chart-pie',  title: 'Category Distribution', size: 'small'  as const },
  { type: 'map',        title: 'Issue Map',             size: 'large'  as const },
  { type: 'table',      title: 'Recent Issues',         size: 'medium' as const },
  { type: 'alerts',     title: 'Active Alerts',         size: 'small'  as const },
];

const SIZE_COLS: Record<string, number> = { small: 3, medium: 6, large: 12 };

export const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  initialWidgets = [],
  onSave,
}) => {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const addWidget = (def: typeof AVAILABLE_WIDGETS[0]) => {
    setWidgets(prev => [...prev, { i: `${def.type}-${Date.now()}`, type: def.type, title: def.title, size: def.size }]);
    setDrawerOpen(false);
  };

  const removeWidget = (id: string) =>
    setWidgets(prev => prev.filter(w => w.i !== id));

  // Simple drag-and-drop reorder
  const handleDragStart = (id: string) => setDragging(id);
  const handleDragOver  = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOver(id); };
  const handleDrop      = (targetId: string) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    setWidgets(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(w => w.i === dragging);
      const toIdx   = arr.findIndex(w => w.i === targetId);
      const [item]  = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
      return arr;
    });
    setDragging(null);
    setDragOver(null);
  };

  const handleSave = () => { onSave?.(widgets); setIsEditing(false); };

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

      <Grid container spacing={2}>
        {widgets.map(widget => (
          <Grid
            item
            xs={12}
            sm={SIZE_COLS[widget.size]}
            key={widget.i}
            draggable={isEditing}
            onDragStart={() => handleDragStart(widget.i)}
            onDragOver={e => handleDragOver(e, widget.i)}
            onDrop={() => handleDrop(widget.i)}
            onDragEnd={() => { setDragging(null); setDragOver(null); }}
          >
            <Paper
              elevation={dragOver === widget.i ? 4 : 1}
              sx={{
                p: 2, minHeight: 160, position: 'relative',
                border: dragOver === widget.i ? '2px dashed #1976d2' : '2px solid transparent',
                opacity: dragging === widget.i ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
            >
              {isEditing && (
                <Box sx={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 0.5 }}>
                  <DragIcon sx={{ color: 'text.disabled', cursor: 'grab', fontSize: 18 }} />
                  <IconButton size="small" onClick={() => removeWidget(widget.i)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>{widget.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                <Typography variant="body2" color="text.secondary">{widget.type.toUpperCase()} content</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}

        {widgets.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', border: '2px dashed #e0e0e0', borderRadius: 2 }}>
              <Typography color="text.secondary">No widgets yet. Click "Add Widget" to get started.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" gutterBottom>Add Widget</Typography>
          <List>
            {AVAILABLE_WIDGETS.map(w => (
              <ListItem
                key={w.type}
                onClick={() => addWidget(w)}
                sx={{ cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemText primary={w.title} secondary={`Size: ${w.size}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};
