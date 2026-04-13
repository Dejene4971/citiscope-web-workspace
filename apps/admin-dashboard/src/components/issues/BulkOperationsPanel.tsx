import React, { useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Assignment, Update, Download, Delete } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { updateIssueStatus } from '../../features/issues/issuesSlice';
import { showToast } from '../notifications/ToastNotifications';
import { auditService } from '../../services/auditService';
import type { AppDispatch } from '../../store/store';
import type { Issue } from '@citiscope/types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface BulkOperationsPanelProps {
  selectedIssues: Issue[];
  onClearSelection: () => void;
}

type BulkAction = 'assign' | 'status' | 'export';

const MOCK_TECHNICIANS = [
  { id: 'T1', name: 'Abebe Kebede'   },
  { id: 'T2', name: 'Tigist Haile'   },
  { id: 'T3', name: 'Selam Tesfaye'  },
];

const STATUSES: Issue['status'][] = ['verified', 'assigned', 'in_progress', 'resolved'];

export const BulkOperationsPanel: React.FC<BulkOperationsPanelProps> = ({
  selectedIssues, onClearSelection,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [action, setAction]       = useState<BulkAction | null>(null);
  const [techId, setTechId]       = useState('');
  const [newStatus, setNewStatus] = useState<Issue['status']>('verified');

  if (selectedIssues.length === 0) return null;

  const confirm = async () => {
    if (action === 'export') {
      const ws = XLSX.utils.json_to_sheet(selectedIssues.map(i => ({
        ID: i.issue_id, Title: i.title, Category: i.category,
        Severity: i.severity, Status: i.status, Reported: i.reported_at,
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Issues');
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([buf], { type: 'application/octet-stream' }), `issues_export_${Date.now()}.xlsx`);
      showToast({ type: 'success', title: 'Exported', message: `${selectedIssues.length} issues exported` });
    } else if (action === 'status') {
      selectedIssues.forEach(i => dispatch(updateIssueStatus({ issueId: i.issue_id, status: newStatus })));
      auditService.log('UPDATE_STATUS', { entityType: 'bulk', payload: { count: selectedIssues.length, status: newStatus } });
      showToast({ type: 'success', title: 'Updated', message: `${selectedIssues.length} issues set to ${newStatus}` });
    } else if (action === 'assign') {
      const tech = MOCK_TECHNICIANS.find(t => t.id === techId);
      selectedIssues.forEach(i => dispatch(updateIssueStatus({ issueId: i.issue_id, status: 'assigned' })));
      auditService.log('ASSIGN_TECHNICIAN', { entityType: 'bulk', payload: { count: selectedIssues.length, technicianId: techId } });
      showToast({ type: 'success', title: 'Assigned', message: `${selectedIssues.length} issues assigned to ${tech?.name}` });
    }
    setAction(null);
    onClearSelection();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: 'primary.50', borderRadius: 2, mb: 2, flexWrap: 'wrap' }}>
        <Chip label={`${selectedIssues.length} selected`} color="primary" />
        <Button size="small" startIcon={<Assignment />} onClick={() => setAction('assign')}>Assign</Button>
        <Button size="small" startIcon={<Update />}     onClick={() => setAction('status')}>Update Status</Button>
        <Button size="small" startIcon={<Download />}   onClick={() => { setAction('export'); }}>Export</Button>
        <Button size="small" color="error"              onClick={onClearSelection}>Clear</Button>
      </Box>

      <Dialog open={action === 'assign'} onClose={() => setAction(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Bulk Assign Technician</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Assign {selectedIssues.length} issues to:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Technician</InputLabel>
            <Select value={techId} label="Technician" onChange={e => setTechId(e.target.value)}>
              {MOCK_TECHNICIANS.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAction(null)}>Cancel</Button>
          <Button variant="contained" onClick={confirm} disabled={!techId}>Assign</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={action === 'status'} onClose={() => setAction(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Bulk Update Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update {selectedIssues.length} issues to:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>New Status</InputLabel>
            <Select value={newStatus} label="New Status" onChange={e => setNewStatus(e.target.value as Issue['status'])}>
              {STATUSES.map(s => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAction(null)}>Cancel</Button>
          <Button variant="contained" onClick={confirm}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
