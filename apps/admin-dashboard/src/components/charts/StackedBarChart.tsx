import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography, Box } from '@mui/material';

interface Dataset {
  label: string;
  data: number[];
  color: string;
}

interface StackedBarChartProps {
  labels: string[];
  datasets: Dataset[];
  title?: string;
  height?: number;
}

// Static options — no inline object creation
const makeOptions = (title?: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 400 } as const,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: !!title, text: title },
  },
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, beginAtZero: true },
  },
});

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  labels, datasets, title, height = 300,
}) => {
  const options = React.useMemo(() => makeOptions(title), [title]);
  const data = React.useMemo(() => ({
    labels,
    datasets: datasets.map(d => ({
      label: d.label,
      data: d.data,
      backgroundColor: d.color,
      borderRadius: 3,
    })),
  }), [labels, datasets]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      {title && <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>}
      <Box sx={{ height }}>
        <Bar data={data} options={options} />
      </Box>
    </Paper>
  );
};
