import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  colors?: string[];
  title?: string;
}

const DEFAULT_COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#9c27b0'];

/** Doughnut chart for proportional breakdowns. */
export const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, data, colors, title }) => (
  <Doughnut
    data={{
      labels,
      datasets: [{ data, backgroundColor: colors ?? DEFAULT_COLORS, borderWidth: 2 }],
    }}
    options={{
      responsive: true,
      plugins: { legend: { position: 'right' }, title: { display: !!title, text: title } },
    }}
  />
);
