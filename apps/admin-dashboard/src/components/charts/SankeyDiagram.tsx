import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface SankeyFlow {
  from: string;
  to: string;
  value: number;
  color?: string;
}

interface SankeyDiagramProps {
  flows: SankeyFlow[];
  title?: string;
}

/**
 * Simplified Sankey — SVG flow diagram showing issue status transitions.
 */
export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ flows, title }) => {
  const nodes = Array.from(new Set(flows.flatMap(f => [f.from, f.to])));
  const leftNodes  = Array.from(new Set(flows.map(f => f.from)));
  const rightNodes = Array.from(new Set(flows.map(f => f.to)));
  const maxVal = Math.max(...flows.map(f => f.value));

  const W = 500, H = 260;
  const nodeW = 100, nodeH = 36, gap = 12;

  const leftY  = (i: number) => 20 + i * (nodeH + gap);
  const rightY = (i: number) => 20 + i * (nodeH + gap);

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      {title && <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>}
      <Box sx={{ overflowX: 'auto' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 320 }}>
          {/* Left nodes */}
          {leftNodes.map((n, i) => (
            <g key={`l-${n}`}>
              <rect x={0} y={leftY(i)} width={nodeW} height={nodeH} rx={6} fill="#1976d2" />
              <text x={nodeW / 2} y={leftY(i) + nodeH / 2 + 5} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">{n}</text>
            </g>
          ))}
          {/* Right nodes */}
          {rightNodes.map((n, i) => (
            <g key={`r-${n}`}>
              <rect x={W - nodeW} y={rightY(i)} width={nodeW} height={nodeH} rx={6} fill="#2e7d32" />
              <text x={W - nodeW / 2} y={rightY(i) + nodeH / 2 + 5} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">{n}</text>
            </g>
          ))}
          {/* Flows */}
          {flows.map((f, i) => {
            const li = leftNodes.indexOf(f.from);
            const ri = rightNodes.indexOf(f.to);
            const thickness = Math.max(2, (f.value / maxVal) * 30);
            const x1 = nodeW, y1 = leftY(li) + nodeH / 2;
            const x2 = W - nodeW, y2 = rightY(ri) + nodeH / 2;
            const mx = (x1 + x2) / 2;
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={f.color ?? '#90caf9'}
                strokeWidth={thickness}
                opacity={0.6}
              />
            );
          })}
          {/* Value labels */}
          {flows.map((f, i) => {
            const li = leftNodes.indexOf(f.from);
            const ri = rightNodes.indexOf(f.to);
            const y1 = leftY(li) + nodeH / 2;
            const y2 = rightY(ri) + nodeH / 2;
            return (
              <text key={`v-${i}`} x={W / 2} y={(y1 + y2) / 2} textAnchor="middle" fontSize={10} fill="#555">
                {f.value}
              </text>
            );
          })}
        </svg>
      </Box>
    </Paper>
  );
};
