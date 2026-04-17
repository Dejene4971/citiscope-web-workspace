import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Button, Avatar, Divider,
  FormControl, InputLabel, Select, MenuItem, Chip,
  Grid, IconButton, Switch, FormControlLabel,
} from '@mui/material';
import { Close, Save, PersonOff } from '@mui/icons-material';
import { orchestrator } from '../../services/workflowOrchestrator';
import { showToast } from '../notifications/ToastNotifications';
import { auditService } from '../../services/auditService';

// ── Types ─────────────────────────────────────────────────────────────────────

export type AdminRole = 'federal_admin' | 'regional_admin' | 'zonal_admin' | 'woreda_admin' | 'technician' | 'viewer';

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: AdminRole;
  adminUnit: string;
  department: string;
  isActive: boolean;
  avatar?: string;
}

interface EditTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSave?: (updated: TeamMember) => void;
}

const ROLE_OPTIONS: { value: AdminRole; label: string; color: string }[] = [
  { value: 'federal_admin',   label: 'Federal Administrator',  color: '#7c3aed' },
  { value: 'regional_admin',  label: 'Regional Administrator', color: '#1d4ed8' },
  { value: 'zonal_admin',     label: 'Zonal Administrator',    color: '#0369a1' },
  { value: 'woreda_admin',    label: 'Woreda Administrator',   color: '#0891b2' },
  { value: 'technician',      label: 'Field Technician',       color: '#059669' },
  { value: 'viewer',          label: 'Read-Only Viewer',       color: '#6b7280' },
];

const ADMIN_UNITS = [
  'Federal — National Level',
  'Addis Ababa City Administration',
  'Oromia Regional State',
  'Amhara Regional State',
  'Tigray Regional State',
  'SNNPR Regional State',
  'Somali Regional State',
  'Afar Regional State',
];

const DEPARTMENTS = [
  'Infrastructure Management',
  'Water & Sanitation',
  'Roads & Transport',
  'Electrical Grid',
  'Waste Management',
  'IoT Operations',
  'Analytics & Reporting',
];

// ── Component ─────────────────────────────────────────────────────────────────

export const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({
  open, onClose, member, onSave,
}) => {
  const [form, setForm] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  // Sync form when member changes
  useEffect(() => {
    if (member) setForm({ ...member });
  }, [member]);

  if (!form) return null;

  const update = <K extends keyof TeamMember>(key: K, value: TeamMember[K]) =>
    setForm(prev => prev ? { ...prev, [key]: value } : null);

  const roleOption = ROLE_OPTIONS.find(r => r.value === form.role);
  const initials = form.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await orchestrator.trigger('user:updated', {
        userId: form.id,
        changes: form,
        updatedAt: new Date().toISOString(),
      });
      auditService.log('UPDATE_STATUS', {
        entityId: form.id,
        entityType: 'user',
        payload: { role: form.role, isActive: form.isActive },
      });
      showToast({ type: 'success', title: 'Member Updated', message: `${form.fullName} has been updated` });
      onSave?.(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirmDeactivate) { setConfirmDeactivate(true); return; }
    update('isActive', false);
    setConfirmDeactivate(false);
    showToast({ type: 'warning', title: 'Account Deactivated', message: `${form.fullName}'s account has been deactivated` });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 52, height: 52, fontWeight: 700, fontSize: '1.1rem',
                bgcolor: roleOption?.color ?? '#6b7280',
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>{form.fullName}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={roleOption?.label ?? form.role}
                  size="small"
                  sx={{ bgcolor: `${roleOption?.color}20`, color: roleOption?.color, fontWeight: 600, fontSize: 11 }}
                />
                <Chip
                  label={form.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={form.isActive ? 'success' : 'default'}
                />
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small"><Close /></IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Personal Info */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Full Name" size="small"
              value={form.fullName}
              onChange={e => update('fullName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Email Address" type="email" size="small"
              value={form.email}
              onChange={e => update('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Phone Number" size="small"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Department" size="small"
              value={form.department}
              onChange={e => update('department', e.target.value)}
              select
            >
              {DEPARTMENTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
          </Grid>

          {/* Role & Access */}
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Role & Access
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select value={form.role} label="Role" onChange={e => update('role', e.target.value as AdminRole)}>
                {ROLE_OPTIONS.map(r => (
                  <MenuItem key={r.value} value={r.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: r.color }} />
                      {r.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Administrative Unit</InputLabel>
              <Select value={form.adminUnit} label="Administrative Unit" onChange={e => update('adminUnit', e.target.value)}>
                {ADMIN_UNITS.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          {/* Account Status */}
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Account Status
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={e => update('isActive', e.target.checked)}
                  color="success"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {form.isActive ? 'Account Active' : 'Account Inactive'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {form.isActive
                      ? 'User can log in and access the system'
                      : 'User is blocked from accessing the system'}
                  </Typography>
                </Box>
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button
          startIcon={<PersonOff />}
          color={confirmDeactivate ? 'error' : 'inherit'}
          variant={confirmDeactivate ? 'contained' : 'outlined'}
          onClick={handleDeactivate}
          size="small"
        >
          {confirmDeactivate ? 'Confirm Deactivate' : 'Deactivate Account'}
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
