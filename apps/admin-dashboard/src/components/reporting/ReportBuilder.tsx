import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
  Description as ReportIcon,
} from '@mui/icons-material';

interface ReportSection {
  id: string;
  title: string;
  type: 'chart' | 'table' | 'summary' | 'metrics';
  dataSource: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel';
}

export const ReportBuilder: React.FC = () => {
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [reportName, setReportName] = useState('');
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<ScheduledReport>>({});

  const steps = ['Select Data Sources', 'Customize Layout', 'Configure Schedule', 'Generate Report'];

  const availableSections: ReportSection[] = [
    { id: 'issues-trend',          title: 'Issues Trend Chart',       type: 'chart',   dataSource: 'issues'     },
    { id: 'category-distribution', title: 'Category Distribution',    type: 'chart',   dataSource: 'categories' },
    { id: 'performance-metrics',   title: 'Performance Metrics',      type: 'metrics', dataSource: 'metrics'    },
    { id: 'top-woredas',           title: 'Top Performing Woredas',   type: 'table',   dataSource: 'woredas'    },
    { id: 'resolution-timeline',   title: 'Resolution Timeline',      type: 'chart',   dataSource: 'timeline'   },
  ];

  const handleAddSection = (section: typeof availableSections[0]) => {
    setSections([...sections, { ...section, id: `${section.id}-${Date.now()}` }]);
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleScheduleReport = () => {
    if (newSchedule.name && newSchedule.frequency && newSchedule.time) {
      setScheduledReports([
        ...scheduledReports,
        {
          id: Date.now().toString(),
          name: newSchedule.name,
          frequency: newSchedule.frequency as any,
          time: newSchedule.time,
          recipients: newSchedule.recipients || [],
          format: newSchedule.format || 'pdf',
        },
      ]);
      setOpenSchedule(false);
      setNewSchedule({});
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* Available Sections Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Available Components</Typography>
            <List>
              {availableSections.map((section) => (
                <ListItem
                  key={section.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleAddSection(section)}>
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon><ReportIcon /></ListItemIcon>
                  <ListItemText primary={section.title} secondary={section.type} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Report Builder Panel */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Report Builder</Typography>
            <TextField
              fullWidth
              label="Report Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            {sections.length === 0 ? (
              <Alert severity="info">Add components to build your report</Alert>
            ) : (
              <List>
                {sections.map((section) => (
                  <ListItem
                    key={section.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveSection(section.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={section.title} secondary={`Type: ${section.type}`} />
                  </ListItem>
                ))}
              </List>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" startIcon={<ScheduleIcon />} onClick={() => setOpenSchedule(true)}>
                Schedule Report
              </Button>
              <Button variant="contained" startIcon={<DownloadIcon />} disabled={sections.length === 0}>
                Generate Report
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Scheduled Reports */}
      {scheduledReports.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Scheduled Reports</Typography>
          <List>
            {scheduledReports.map((report) => (
              <ListItem key={report.id}>
                <ListItemIcon><ScheduleIcon /></ListItemIcon>
                <ListItemText
                  primary={report.name}
                  secondary={`${report.frequency} at ${report.time} · Format: ${report.format.toUpperCase()}`}
                />
                <Chip label="Active" size="small" color="success" />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Schedule Dialog */}
      <Dialog open={openSchedule} onClose={() => setOpenSchedule(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Report</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Report Name"
            value={newSchedule.name || ''}
            onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
            sx={{ mt: 1, mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Frequency</InputLabel>
            <Select
              value={newSchedule.frequency || ''}
              label="Frequency"
              onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value as any })}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Time (24h)"
            type="time"
            value={newSchedule.time || ''}
            onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Format</InputLabel>
            <Select
              value={newSchedule.format || 'pdf'}
              label="Format"
              onChange={(e) => setNewSchedule({ ...newSchedule, format: e.target.value as any })}
            >
              <MenuItem value="pdf">PDF Document</MenuItem>
              <MenuItem value="excel">Excel Spreadsheet</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSchedule(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleScheduleReport}>Schedule</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};