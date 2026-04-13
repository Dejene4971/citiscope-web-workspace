// components/modals/TechnicianAssignmentModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { assignTechnician } from '../../features/issues/issuesSlice';
import { showToast } from '../notifications/ToastNotifications';

interface Technician {
  id: string;
  name: string;
  role: string;
  avatar: string;
  available: boolean;
  skills: string[];
}

interface TechnicianAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  issueId: string;
  issueTitle: string;
  issueLocation: string;
}

export const TechnicianAssignmentModal: React.FC<TechnicianAssignmentModalProps> = ({
  open,
  onClose,
  issueId,
  issueTitle,
  issueLocation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock technicians data - replace with API call
  const technicians: Technician[] = [
    { id: '1', name: 'Abebe Kebede', role: 'Senior Technician', avatar: 'AK', available: true, skills: ['Water', 'Pipes'] },
    { id: '2', name: 'Tigist Haile', role: 'Field Engineer', avatar: 'TH', available: true, skills: ['Electrical', 'Power'] },
    { id: '3', name: 'Mekonnen Alemu', role: 'Maintenance Lead', avatar: 'MA', available: false, skills: ['Roads', 'Drainage'] },
    { id: '4', name: 'Selam Tesfaye', role: 'Technician', avatar: 'ST', available: true, skills: ['Waste', 'Cleaning'] },
  ];

  const handleAssign = async () => {
    if (!selectedTechnician) {
      showToast({ type: 'warning', title: 'Selection Required', message: 'Please select a technician' });
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(assignTechnician({ issueId, technicianId: selectedTechnician }));
      showToast({ type: 'success', title: 'Assigned', message: 'Technician assigned successfully' });
      onClose();
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to assign technician' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTech = technicians.find(t => t.id === selectedTechnician);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Assign Technician</Typography>
        <Typography variant="body2" color="text.secondary">
          Issue: {issueTitle} • Location: {issueLocation}
        </Typography>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Technician Selection */}
          <FormControl fullWidth>
            <InputLabel>Select Technician</InputLabel>
            <Select
              value={selectedTechnician}
              label="Select Technician"
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              {technicians.map((tech) => (
                <MenuItem key={tech.id} value={tech.id} disabled={!tech.available}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Avatar sx={{ width: 32, height: 32 }}>{tech.avatar}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">{tech.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{tech.role}</Typography>
                    </Box>
                    {!tech.available && <Chip label="Unavailable" size="small" color="error" />}
                    {tech.available && <Chip label="Available" size="small" color="success" />}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selected Technician Details */}
          {selectedTech && (
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Technician Skills</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedTech.skills.map((skill) => (
                  <Chip key={skill} label={skill} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}

          {/* Assignment Note */}
          <TextField
            label="Assignment Note (Optional)"
            multiline
            rows={3}
            value={assignmentNote}
            onChange={(e) => setAssignmentNote(e.target.value)}
            placeholder="Add instructions or notes for the technician..."
            fullWidth
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleAssign} 
          disabled={!selectedTechnician || isLoading}
        >
          {isLoading ? 'Assigning...' : 'Assign Technician'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};