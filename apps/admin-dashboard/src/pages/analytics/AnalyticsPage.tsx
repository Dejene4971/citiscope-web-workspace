import React from 'react';
import { LineChart, BarChart, DoughnutChart } from '@citiscope/charts';

const mockLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const mockTrend = [12, 19, 8, 24, 17, 30];
const mockResolved = [8, 14, 6, 20, 15, 27];

export const AnalyticsPage: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
    <h2 style={{ margin: 0 }}>Analytics</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Issues Over Time</h3>
        <LineChart
          labels={mockLabels}
          datasets={[
            { label: 'Reported', data: mockTrend, color: '#1976d2' },
            { label: 'Resolved', data: mockResolved, color: '#2e7d32' },
          ]}
        />
      </div>
      <div style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>By Category</h3>
        <DoughnutChart
          labels={['Water', 'Road', 'Electricity', 'Sewage', 'Waste']}
          data={[34, 28, 18, 12, 8]}
        />
      </div>
      <div style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)', gridColumn: '1 / -1' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Monthly Breakdown</h3>
        <BarChart
          labels={mockLabels}
          datasets={[{ label: 'Issues', data: mockTrend, color: '#1976d2' }]}
        />
      </div>
    </div>
  </div>
);
