import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  Button,
  Pagination,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ResolvedIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Mock data for issues
const mockIssues = [
  {
    id: 'ISS-001',
    title: 'Burst Water Pipe',
    category: 'Water',
    severity: 'critical',
    status: 'pending',
    location: 'Bole Woreda, Addis Ababa',
    reportedAt: '2024-03-31T08:00:00Z',
    assignedTo: 'Unassigned',
  },
  {
    id: 'ISS-002',
    title: 'Large Pothole',
    category: 'Road',
    severity: 'high',
    status: 'verified',
    location: 'Kirkos Woreda, Addis Ababa',
    reportedAt: '2024-03-30T14:30:00Z',
    assignedTo: 'Tech Team A',
  },
  {
    id: 'ISS-003',
    title: 'Street Light Outage',
    category: 'Electricity',
    severity: 'medium',
    status: 'assigned',
    location: 'Yeka Woreda, Addis Ababa',
    reportedAt: '2024-03-29T18:00:00Z',
    assignedTo: 'Tech Team B',
  },
  {
    id: 'ISS-004',
    title: 'Trash Accumulation',
    category: 'Waste',
    severity: 'low',
    status: 'in_progress',
    location: 'Lideta Woreda, Addis Ababa',
    reportedAt: '2024-03-28T09:15:00Z',
    assignedTo: 'Tech Team C',
  },
  {
    id: 'ISS-005',
    title: 'Sewage Overflow',
    category: 'Drainage',
    severity: 'critical',
    status: 'resolved',
    location: 'Gulele Woreda, Addis Ababa',
    reportedAt: '2024-03-27T11:00:00Z',
    assignedTo: 'Tech Team A',
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'success';
    default: return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'verified': return 'info';
    case 'assigned': return 'primary';
    case 'in_progress': return 'secondary';
    case 'resolved': return 'success';
    default: return 'default';
  }
};

export const IssuesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [page, setPage] = useState(1);

  const stats = {
    total: mockIssues.length,
    pending: mockIssues.filter(i => i.status === 'pending').length,
    inProgress: mockIssues.filter(i => i.status === 'in_progress').length,
    resolved: mockIssues.filter(i => i.status === 'resolved').length,
    critical: mockIssues.filter(i => i.severity === 'critical').length,
  };

  return (
    <Box>
      {/* Page Header */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        Issue Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View and manage all reported infrastructure issues across administrative units
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Issues</Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '3px solid #ff9800' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Pending</Typography>
              <Typography variant="h4" color="warning.main">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '3px solid #2196f3' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">In Progress</Typography>
              <Typography variant="h4" color="info.main">{stats.inProgress}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '3px solid #4caf50' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Resolved</Typography>
              <Typography variant="h4" color="success.main">{stats.resolved}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '3px solid #f44336' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Critical</Typography>
              <Typography variant="h4" color="error.main">{stats.critical}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Severity</InputLabel>
              <Select
                value={severityFilter}
                label="Severity"
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <MenuItem value="all">All Severity</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="outlined" startIcon={<FilterIcon />} fullWidth>
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Issues Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockIssues.map((issue) => (
              <TableRow key={issue.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {issue.id}
                  </Typography>
                </TableCell>
                <TableCell>{issue.title}</TableCell>
                <TableCell>
                  <Chip label={issue.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={issue.severity.toUpperCase()}
                    size="small"
                    color={getSeverityColor(issue.severity) as any}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={issue.status.replace('_', ' ').toUpperCase()}
                    size="small"
                    color={getStatusColor(issue.status) as any}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                    {issue.location}
                  </Typography>
                </TableCell>
                <TableCell>{issue.assignedTo}</TableCell>
                <TableCell>
                  <IconButton size="small" title="View Details">
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title="Edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={5} page={page} onChange={(e, v) => setPage(v)} color="primary" />
      </Box>
    </Box>
  );
};