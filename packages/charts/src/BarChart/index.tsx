import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color?: string }[];
  title?: string;
  horizontal?: boolean;
}

/** Bar chart for category comparisons. */
export const BarChart: React.FC<BarChartProps> = ({ labels, datasets, title, horizontal }) => (
  <Bar
    data={{
      labels,
      datasets: datasets.map(d => ({
        label: d.label,
        data: d.data,
        backgroundColor: d.color ?? '#1976d2',
      })),
    }}
    options={{
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      plugins: { legend: { position: 'top' }, title: { display: !!title, text: title } },
    }}
  />
);
