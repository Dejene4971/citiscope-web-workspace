import React from 'react';
import { Paper, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Close, DragIndicator, Fullscreen } from '@mui/icons-material';

export interface WidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onRemove?: (id: string) => void;
  onExpand?: (id: string) => void;
  draggable?: boolean;
  minHeight?: number;
}

/**
 * Reusable dashboard widget shell with drag handle, expand, and remove controls.
 */
export const Widget: React.FC<WidgetProps> = ({
  id, title, children, onRemove, onExpand, draggable = true, minHeight = 200,
}) => (
  <Paper
    sx={{ borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
    elevation={2}
  >
    <Box
      sx={{
        display: 'flex', alignItems: 'center', px: 2, py: 1,
        borderBottom: '1px solid', borderColor: 'divider',
        bgcolor: '#fafafa', cursor: draggable ? 'grab' : 'default',
      }}
    >
      {draggable && <DragIndicator fontSize="small" sx={{ color: 'text.disabled', mr: 1 }} />}
      <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>{title}</Typography>
      {onExpand && (
        <Tooltip title="Expand">
          <IconButton size="small" onClick={() => onExpand(id)}><Fullscreen fontSize="small" /></IconButton>
        </Tooltip>
      )}
      {onRemove && (
        <Tooltip title="Remove">
          <IconButton size="small" onClick={() => onRemove(id)}><Close fontSize="small" /></IconButton>
        </Tooltip>
      )}
    </Box>
    <Box sx={{ flex: 1, p: 2, minHeight, overflow: 'auto' }}>{children}</Box>
  </Paper>
);
