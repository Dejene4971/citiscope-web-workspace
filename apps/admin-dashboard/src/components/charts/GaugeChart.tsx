import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';

interface GaugeChartProps {
  value: number;       // 0–100
  label: string;
  size?: number;
  thresholds?: { warning: number; critical: number };
}

/**
 * SVG arc gauge — no external dependency, zero re-render risk.
 */
export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  label,
  size = 160,
  thresholds = { warning: 60, critical: 80 },
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const color = clamped >= thresholds.critical ? '#f44336'
    : clamped >= thresholds.warning ? '#ff9800'
    : '#4caf50';

  const r = size * 0.38;
  const cx = size / 2;
  const cy = size * 0.58;
  const startAngle = -210;
  const endAngle = 30;
  const totalArc = endAngle - startAngle;
  const fillArc = (clamped / 100) * totalArc;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (start: number, end: number, stroke: string, width: number) => {
    const s = { x: cx + r * Math.cos(toRad(start)), y: cy + r * Math.sin(toRad(start)) };
    const e = { x: cx + r * Math.cos(toRad(end)),   y: cy + r * Math.sin(toRad(end))   };
    const large = end - start > 180 ? 1 : 0;
    return (
      <path
        d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 0.75}>
        {arcPath(startAngle, endAngle, '#e0e0e0', 12)}
        {arcPath(startAngle, startAngle + fillArc, color, 12)}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={size * 0.18} fontWeight="bold" fill={color}>
          {clamped}%
        </text>
      </svg>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
    </Box>
  );
};
