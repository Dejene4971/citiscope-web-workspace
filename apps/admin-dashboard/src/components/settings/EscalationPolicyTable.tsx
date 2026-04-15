import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, IconButton, Button,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { Edit, Delete, Add, RestartAlt, Save } from '@mui/icons-material';
import { showToast } from '../notifications/ToastNotifications';

interface EscalationStep {
  id: string;
  step: number;
  delayCondition: string;
  action: string;
  contactGroup: string;
}

const INITIAL_STEPS: EscalationStep[] = [
  { id: 'e1', step: 1, delayCondition: 'Immediate',                    action: 'Push Notification + SMS',    contactGroup: 'Shift Engineers (A)' },
  { id: 'e2', step: 2, delayCondition: 'If unacknowledged for 15m',    action: 'Automated Voice Call',       contactGroup: 'Operations Manager'  },
  { id: 'e3', step: 3, delayCondition: 'If unacknowledged for 60m',    action: 'Global Dashboard Alert',     contactGroup: 'Regional Director Executive' },
];

const ACTION_OPTIONS = [
  'Push Notification + SMS',
  'Automated Voice Call',
  'Global Dashboard Alert',
  'Email Notification',
  'Escalate to Federal',
];

export const EscalationPolicyTable: React.FC = () => {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [editStep, setEditStep] = useState<EscalationStep | null>(null);
  const [saved, setSaved] = useState(false);

  const handleDelete = (id: string) =>
    setSteps(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, step: i + 1 })));

  const handleAdd = () => {
    const newStep: EscalationStep = {
      id: `e${Date.now()}`,
      step: steps.length + 1,
      delayCondition: `If unacknowledged for ${steps.length * 30}m`,
      action: 'Push Notification + SMS',
      contactGroup: 'New Contact Group',
    };
    setSteps(prev => [...prev, newStep]);
    setEditStep(newStep);
  };

  const handleSaveEdit = () => {
    if (!editStep) return;
    setSteps(prev => prev.map(s => s.id === editStep.id ? editStep : s));
    setEditStep(null);
  };

  const handleSave = () => {
    setSaved(true);
    showToast({ type: 'success', title: 'Saved', message: 'Escalation policy updated successfully' });
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSteps(INITIAL_STEPS);
    showToast({ type: 'info', title: 'Reset', message: 'Escalation policy reset to defaults' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Escalation Policy</Typography>
          <Typography variant="body2" color="text.secondary">
            Define automatic escalation steps for unacknowledged alerts
          </Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<Add />} onClick={handleAdd}>
          Add Escalation Tier
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb' }}>
              {['Step', 'Delay Condition', 'Action & Routing', 'Contact Group', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, py: 1.5 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {steps.map(step => (
              <TableRow key={step.id} hover>
                <TableCell>
                  <Chip
                    label={`Step ${String(step.step).padStart(2, '0')}`}
                    size="small"
                    color={step.step === 1 ? 'error' : step.step === 2 ? 'warning' : 'info'}
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{step.delayCondition}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>{step.action}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">{step.contactGroup}</Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => setEditStep(step)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(step.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" startIcon={<RestartAlt />} onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
          Save Configuration
        </Button>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={!!editStep} onClose={() => setEditStep(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Escalation Step</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Delay Condition"
            value={editStep?.delayCondition ?? ''}
            onChange={e => setEditStep(prev => prev ? { ...prev, delayCondition: e.target.value } : null)}
            fullWidth size="small"
          />
          <FormControl fullWidth size="small">
            <InputLabel>Action</InputLabel>
            <Select
              value={editStep?.action ?? ''}
              label="Action"
              onChange={e => setEditStep(prev => prev ? { ...prev, action: e.target.value } : null)}
            >
              {ACTION_OPTIONS.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label="Contact Group"
            value={editStep?.contactGroup ?? ''}
            onChange={e => setEditStep(prev => prev ? { ...prev, contactGroup: e.target.value } : null)}
            fullWidth size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditStep(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
