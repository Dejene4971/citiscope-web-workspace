import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface LineChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color?: string }[];
  title?: string;
  height?: number;
}

/** Trend line chart for time-series data. */
export const LineChart: React.FC<LineChartProps> = ({ labels, datasets, title, height = 300 }) => (
  <Line
    height={height}
    data={{
      labels,
      datasets: datasets.map(d => ({
        label: d.label,
        data: d.data,
        borderColor: d.color ?? '#1976d2',
        backgroundColor: `${d.color ?? '#1976d2'}22`,
        fill: true,
        tension: 0.4,
      })),
    }}
    options={{
      responsive: true,
      plugins: { legend: { position: 'top' }, title: { display: !!title, text: title } },
    }}
  />
);
