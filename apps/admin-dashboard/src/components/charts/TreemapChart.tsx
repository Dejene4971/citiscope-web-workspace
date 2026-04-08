import React, { useMemo } from 'react';
import { Box, Typography, Paper, Tooltip } from '@mui/material';

interface TreemapNode {
  label: string;
  value: number;
  color: string;
  sublabel?: string;
}

interface TreemapChartProps {
  nodes: TreemapNode[];
  title?: string;
  height?: number;
}

/**
 * Simple squarified treemap using CSS flex — no extra deps.
 */
export const TreemapChart: React.FC<TreemapChartProps> = ({ nodes, title, height = 300 }) => {
  const total = useMemo(() => nodes.reduce((s, n) => s + n.value, 0), [nodes]);
  const sorted = useMemo(() => [...nodes].sort((a, b) => b.value - a.value), [nodes]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      {title && <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', height, gap: '2px', overflow: 'hidden', borderRadius: 1 }}>
        {sorted.map(node => {
          const pct = (node.value / total) * 100;
          return (
            <Tooltip key={node.label} title={`${node.label}: ${node.value} (${pct.toFixed(1)}%)`}>
              <Box
                sx={{
                  flexGrow: pct,
                  flexBasis: `${pct}%`,
                  minWidth: 40,
                  bgcolor: node.color,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'default',
                  transition: 'opacity 0.15s',
                  '&:hover': { opacity: 0.85 },
                  p: 0.5,
                  overflow: 'hidden',
                }}
              >
                <Typography variant="caption" color="white" fontWeight={700} noWrap>
                  {node.label}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.85)" noWrap>
                  {node.value}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );
};
