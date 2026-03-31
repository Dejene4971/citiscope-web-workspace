import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock analytics data
const analyticsData = {
  weeklyTrend: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    reported: [12, 15, 18, 22, 25, 18, 14],
    resolved: [8, 10, 12, 15, 18, 14, 10],
  },
  monthlyTrend: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    reported: [45, 52, 48, 58],
    resolved: [32, 38, 35, 42],
  },
  categoryDistribution: [
    { category: 'Road', count: 45, percentage: 30, color: '#ff9800' },
    { category: 'Water', count: 38, percentage: 25, color: '#2196f3' },
    { category: 'Electricity', count: 28, percentage: 19, color: '#ffc107' },
    { category: 'Waste', count: 22, percentage: 15, color: '#4caf50' },
    { category: 'Drainage', count: 17, percentage: 11, color: '#9c27b0' },
  ],
  severityDistribution: [
    { severity: 'Critical', count: 12, color: '#f44336' },
    { severity: 'High', count: 18, color: '#ff9800' },
    { severity: 'Medium', count: 35, color: '#ffc107' },
    { severity: 'Low', count: 45, color: '#4caf50' },
  ],
  topWoredas: [
    { name: 'Bole Woreda', issues: 45, resolved: 32, avgTime: '3.2h' },
    { name: 'Kirkos Woreda', issues: 38, resolved: 28, avgTime: '4.1h' },
    { name: 'Yeka Woreda', issues: 32, resolved: 22, avgTime: '5.0h' },
    { name: 'Gulele Woreda', issues: 28, resolved: 18, avgTime: '4.5h' },
    { name: 'Lideta Woreda', issues: 25, resolved: 19, avgTime: '3.8h' },
  ],
  performanceMetrics: {
    avgResolutionTime: '4.2h',
    responseRate: '94%',
    citizenSatisfaction: '87%',
    criticalResponseTime: '1.5h',
  },
};

type ChartType = 'line' | 'bar';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [trendChartType, setTrendChartType] = useState<ChartType>('line');

  const trendData = timeRange === 'week' ? analyticsData.weeklyTrend : analyticsData.monthlyTrend;

  // Line Chart Data
  const lineChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Reported Issues',
        data: trendData.reported,
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ff9800',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Resolved Issues',
        data: trendData.resolved,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4caf50',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Bar Chart Data
  const barChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Reported Issues',
        data: trendData.reported,
        backgroundColor: '#ff9800',
        borderRadius: 8,
        barPercentage: 0.65,
        categoryPercentage: 0.8,
      },
      {
        label: 'Resolved Issues',
        data: trendData.resolved,
        backgroundColor: '#4caf50',
        borderRadius: 8,
        barPercentage: 0.65,
        categoryPercentage: 0.8,
      },
    ],
  };

  // Doughnut Chart Data - Category Distribution
  const categoryChartData = {
    labels: analyticsData.categoryDistribution.map(c => c.category),
    datasets: [
      {
        data: analyticsData.categoryDistribution.map(c => c.count),
        backgroundColor: analyticsData.categoryDistribution.map(c => c.color),
        borderWidth: 0,
        cutout: '60%',
        borderRadius: 8,
        spacing: 2,
      },
    ],
  };

  // Doughnut Chart Data - Severity Distribution
  const severityChartData = {
    labels: analyticsData.severityDistribution.map(s => s.severity),
    datasets: [
      {
        data: analyticsData.severityDistribution.map(s => s.count),
        backgroundColor: analyticsData.severityDistribution.map(s => s.color),
        borderWidth: 0,
        cutout: '60%',
        borderRadius: 8,
        spacing: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { stepSize: 10, font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { font: { size: 11 }, usePointStyle: true, boxWidth: 8 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Performance metrics and infrastructure insights
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select value={timeRange} label="Time Range" onChange={(e) => setTimeRange(e.target.value)}>
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Avg Resolution Time</Typography>
                <AccessTimeIcon color="primary" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>{analyticsData.performanceMetrics.avgResolutionTime}</Typography>
              <Chip label="↓ 12% vs last week" size="small" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Response Rate</Typography>
                <TrendingUpIcon color="success" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>{analyticsData.performanceMetrics.responseRate}</Typography>
              <Chip label="↑ 5% vs last week" size="small" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Citizen Satisfaction</Typography>
                <CheckCircleIcon color="success" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>{analyticsData.performanceMetrics.citizenSatisfaction}</Typography>
              <Chip label="↑ 3% vs last week" size="small" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Critical Response</Typography>
                <WarningIcon color="error" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>{analyticsData.performanceMetrics.criticalResponseTime}</Typography>
              <Chip label="↑ 8% faster" size="small" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Main Trend Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Issue Trends</Typography>
              <ButtonGroup size="small" variant="outlined">
                <Button
                  onClick={() => setTrendChartType('line')}
                  variant={trendChartType === 'line' ? 'contained' : 'outlined'}
                  startIcon={<ShowChartIcon />}
                >
                  Line
                </Button>
                <Button
                  onClick={() => setTrendChartType('bar')}
                  variant={trendChartType === 'bar' ? 'contained' : 'outlined'}
                  startIcon={<BarChartIcon />}
                >
                  Bar
                </Button>
              </ButtonGroup>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 350 }}>
              {trendChartType === 'line' ? (
                <Line data={lineChartData} options={chartOptions} />
              ) : (
                <Bar data={barChartData} options={chartOptions} />
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#ff9800', borderRadius: 2 }} />
                <Typography variant="caption">Reported Issues</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: 2 }} />
                <Typography variant="caption">Resolved Issues</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Category Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Issues by Category
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            </Box>
            <Box sx={{ mt: 2 }}>
              {analyticsData.categoryDistribution.map((cat) => (
                <Box key={cat.category} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: cat.color, borderRadius: 1 }} />
                    <Typography variant="body2">{cat.category}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={500}>
                    {cat.count} ({cat.percentage}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Severity Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Issues by Severity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={severityChartData} options={doughnutOptions} />
            </Box>
            <Box sx={{ mt: 2 }}>
              {analyticsData.severityDistribution.map((sev) => (
                <Box key={sev.severity} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: sev.color, borderRadius: 1 }} />
                    <Typography variant="body2">{sev.severity}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={500}>
                    {sev.count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Top Woredas Performance */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Woredas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {analyticsData.topWoredas.map((woreda, index) => (
                <ListItem key={index} divider={index < analyticsData.topWoredas.length - 1}>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography fontWeight={500}>{woreda.name}</Typography>
                        <Chip label={`Avg: ${woreda.avgTime}`} size="small" variant="outlined" />
                      </Box>
                    }
                    secondary={`${woreda.issues} total issues · ${woreda.resolved} resolved (${Math.round((woreda.resolved / woreda.issues) * 100)}% completion)`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Key Insights */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Key Insights
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><TrendingUpIcon color="success" /></ListItemIcon>
                <ListItemText
                  primary="Resolution time improved by 12%"
                  secondary="Average resolution time decreased from 4.8h to 4.2h"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                <ListItemText
                  primary="Critical alerts increased by 8%"
                  secondary="IoT sensors detected more water pressure anomalies"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                <ListItemText
                  primary="Bole Woreda leads resolution rate"
                  secondary="32 out of 45 issues resolved within 24 hours"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><BarChartIcon color="primary" /></ListItemIcon>
                <ListItemText
                  primary="Peak reporting on Thursdays"
                  secondary="25 reports on average, 30% above daily average"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};