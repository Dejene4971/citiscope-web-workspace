import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface FunnelStage {
  label: string;
  value: number;
  color: string;
}

interface FunnelChartProps {
  stages: FunnelStage[];
  title?: string;
}

/**
 * Pure SVG funnel — shows issue resolution pipeline drop-off.
 */
export const FunnelChart: React.FC<FunnelChartProps> = ({ stages, title }) => {
  const max = Math.max(...stages.map(s => s.value));
  const barH = 44;
  const gap = 6;
  const totalH = stages.length * (barH + gap);

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      {title && <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>}
      <svg width="100%" height={totalH} viewBox={`0 0 400 ${totalH}`}>
        {stages.map((s, i) => {
          const w = (s.value / max) * 360;
          const x = (400 - w) / 2;
          const y = i * (barH + gap);
          const pct = max > 0 ? Math.round((s.value / stages[0].value) * 100) : 0;
          return (
            <g key={s.label}>
              <rect x={x} y={y} width={w} height={barH} rx={6} fill={s.color} opacity={0.85} />
              <text x={200} y={y + barH / 2 + 5} textAnchor="middle" fill="#fff" fontSize={13} fontWeight="bold">
                {s.label}: {s.value.toLocaleString()} ({pct}%)
              </text>
            </g>
          );
        })}
      </svg>
    </Paper>
  );
};
