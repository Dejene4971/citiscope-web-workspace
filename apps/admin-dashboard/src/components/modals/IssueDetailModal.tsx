import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, Grid, Divider,
} from '@mui/material';
import {
  LocationOn, Schedule, Person, Category,
} from '@mui/icons-material';
import { closeModal } from '../../features/ui/uiSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { orchestrator } from '../../services/workflowOrchestrator';

const SEV_COLOR: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  critical: 'error', high: 'warning', medium: 'info', low: 'success',
};
const STA_COLOR: Record<string, 'error' | 'warning' | 'info' | 'success' | 'default'> = {
  pending: 'warning', verified: 'info', assigned: 'info', in_progress: 'warning', resolved: 'success',
};

export const IssueDetailModal: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeModal, selectedIssueId } = useSelector((s: RootState) => s.ui);
  const issue = useSelector((s: RootState) =>
    s.issues.items.find(i => i.issue_id === selectedIssueId) ?? s.issues.selected
  );
  const user = useSelector((s: RootState) => s.auth.user);

  const open = activeModal === 'issue-detail' && !!issue;

  const handleClose = () => dispatch(closeModal());

  const handleResolve = async () => {
    if (!issue) return;
    const prev = issue.status;
    // In a real app dispatch an updateIssue action here
    await orchestrator.trigger('issue:status_changed', {
      issue: { ...issue, status: 'resolved' },
      previousStatus: prev,
      userId: (user as any)?.user_id,
    });
    handleClose();
  };

  if (!issue) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>{issue.title}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={issue.severity} size="small" color={SEV_COLOR[issue.severity]} />
            <Chip label={issue.status.replace('_', ' ')} size="small" color={STA_COLOR[issue.status]} />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {issue.description}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Category fontSize="small" color="action" />
              <Typography variant="body2"><strong>Category:</strong> {issue.category}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2"><strong>Reported by:</strong> {issue.reported_by}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2">
                <strong>Location:</strong> {issue.location.address ?? `${issue.location.latitude.toFixed(4)}, ${issue.location.longitude.toFixed(4)}`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule fontSize="small" color="action" />
              <Typography variant="body2">
                <strong>Reported:</strong> {new Date(issue.reported_at).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          {issue.upvotes > 0 && (
            <Grid item xs={6}>
              <Typography variant="body2"><strong>👍 Upvotes:</strong> {issue.upvotes}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {issue.status !== 'resolved' && (
          <Button variant="contained" color="success" onClick={handleResolve}>
            Mark Resolved
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

IssueDetailModal.displayName = 'IssueDetailModal';
