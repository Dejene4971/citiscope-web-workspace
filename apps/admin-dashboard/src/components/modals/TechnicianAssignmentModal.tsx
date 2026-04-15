import React, { useState, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, InputAdornment, Chip,
  Avatar, Button, Divider, Badge,
} from '@mui/material';
import {
  Search, LocationOn, CheckCircle, Cancel, Engineering,
} from '@mui/icons-material';
import { orchestrator } from '../../services/workflowOrchestrator';
import { showToast } from '../notifications/ToastNotifications';
import { auditService } from '../../services/auditService';

interface Technician {
  id: string;
  name: string;
  specialty: string;
  distanceKm: number;
  available: boolean;
  activeTasks: number;
  avatar: string;
}

const TECHNICIANS: Technician[] = [
  { id: 'T1', name: 'Abebe Tolosa',   specialty: 'Pipe Specialist',  distanceKm: 1.2, available: true,  activeTasks: 0, avatar: 'AT' },
  { id: 'T2', name: 'Hana Solomon',   specialty: 'Hydro Engineer',   distanceKm: 3.8, available: false, activeTasks: 2, avatar: 'HS' },
  { id: 'T3', name: 'Yared Tadesse',  specialty: 'General Utility',  distanceKm: 4.1, available: false, activeTasks: 1, avatar: 'YT' },
  { id: 'T4', name: 'Meron Bekele',   specialty: 'Electrical Tech',  distanceKm: 2.3, available: true,  activeTasks: 0, avatar: 'MB' },
  { id: 'T5', name: 'Dawit Girma',    specialty: 'Civil Engineer',   distanceKm: 5.0, available: true,  activeTasks: 0, avatar: 'DG' },
];

interface TechnicianAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  issueId?: string;
  issueTitle?: string;
}

export const TechnicianAssignmentModal: React.FC<TechnicianAssignmentModalProps> = ({
  open, onClose,
  issueId = 'ID-7492',
  issueTitle = 'Water Pipe Burst - Kirkos Area',
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const filtered = useMemo(() =>
    TECHNICIANS.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialty.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const handleConfirm = async () => {
    if (!selected) return;
    const tech = TECHNICIANS.find(t => t.id === selected)!;
    setConfirming(true);
    try {
      // Publish assignment:created event through the orchestrator
      await orchestrator.trigger('assignment:created', {
        issueId,
        issueTitle,
        technicianId: selected,
        technicianName: tech.name,
        technicianSpecialty: tech.specialty,
        assignedAt: new Date().toISOString(),
      });

      // Also trigger the existing issue:assigned workflow so Redux + audit stay in sync
      await orchestrator.trigger('issue:assigned', {
        issue: { issue_id: issueId, title: issueTitle } as any,
        technicianId: selected,
      });

      auditService.log('ASSIGN_TECHNICIAN', {
        entityId: issueId,
        entityType: 'issue',
        payload: { technicianId: selected, technicianName: tech.name },
      });

      showToast({
        type: 'success',
        title: 'Technician Assigned',
        message: `${tech.name} assigned to ${issueTitle}`,
      });

      handleClose();
    } finally {
      setConfirming(false);
    }
  };

  const handleClose = () => {
    setSearch('');
    setSelected(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>Assign Technician</Typography>
        <Typography variant="body2" color="text.secondary">
          {issueId}: {issueTitle}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth size="small" placeholder="Search by name or skill…"
          value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filtered.map(tech => {
            const isSelected = selected === tech.id;
            return (
              <Box
                key={tech.id}
                onClick={() => tech.available && setSelected(tech.id)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  p: 1.5, borderRadius: 2, cursor: tech.available ? 'pointer' : 'not-allowed',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? 'primary.50' : tech.available ? 'background.paper' : '#f9fafb',
                  opacity: tech.available ? 1 : 0.65,
                  transition: 'all 0.15s',
                  '&:hover': tech.available ? { borderColor: 'primary.main', bgcolor: 'primary.50' } : {},
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box sx={{
                      width: 10, height: 10, borderRadius: '50%',
                      bgcolor: tech.available ? '#4caf50' : '#ff9800',
                      border: '1.5px solid white',
                    }} />
                  }
                >
                  <Avatar sx={{ bgcolor: isSelected ? 'primary.main' : '#e2e8f0', color: isSelected ? 'white' : '#475569', fontWeight: 700 }}>
                    {tech.avatar}
                  </Avatar>
                </Badge>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600}>{tech.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Engineering sx={{ fontSize: 12, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{tech.specialty}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{tech.distanceKm} km</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={tech.available ? 'AVAILABLE' : 'BUSY'}
                      size="small"
                      color={tech.available ? 'success' : 'warning'}
                      sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      {tech.activeTasks} active task{tech.activeTasks !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
          {filtered.length === 0 && (
            <Typography color="text.secondary" textAlign="center" py={3}>No technicians match your search</Typography>
          )}
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button startIcon={<Cancel />} onClick={handleClose} color="inherit">Cancel</Button>
        <Button
          variant="contained" startIcon={<CheckCircle />}
          onClick={handleConfirm}
          disabled={!selected || confirming}
        >
          {confirming ? 'Assigning…' : 'Confirm Assignment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
