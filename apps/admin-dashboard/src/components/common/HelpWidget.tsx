import React, { useState } from 'react';
import {
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, List, ListItem, ListItemIcon,
  ListItemText, TextField, Divider, Chip, Accordion,
  AccordionSummary, AccordionDetails,
} from '@mui/material';
import {
  Help, Close, MenuBook, ContactSupport,
  ExpandMore, CheckCircle, Send,
} from '@mui/icons-material';
import { showToast } from '../notifications/ToastNotifications';

const FAQ = [
  { q: 'How do I report a new issue?',         a: 'Navigate to Issues → click "New Issue" and fill in the details.' },
  { q: 'How do I assign a technician?',         a: 'Open an issue detail, then click "Assign Technician" and select from the list.' },
  { q: 'What do the map marker colours mean?',  a: 'Red = Critical, Orange = High, Yellow = Medium, Green = Low severity.' },
  { q: 'How do I export a report?',             a: 'Go to Reports page, select type and date range, then click Generate & Download.' },
  { q: 'How do I view the audit log?',          a: 'Federal admins can access the Activity Log from the sidebar.' },
];

export const HelpWidget: React.FC = () => {
  const [open, setOpen]         = useState(false);
  const [tab, setTab]           = useState<'faq' | 'contact'>('faq');
  const [message, setMessage]   = useState('');
  const [sending, setSending]   = useState(false);

  const sendSupport = async () => {
    if (!message.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    showToast({ type: 'success', title: 'Message Sent', message: 'Support team will respond within 24 hours' });
    setMessage('');
    setSending(false);
    setOpen(false);
  };

  return (
    <>
      <Fab
        size="medium" color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}
        onClick={() => setOpen(true)}
        aria-label="Help"
      >
        <Help />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700}>Help & Support</Typography>
            <Button size="small" onClick={() => setOpen(false)}><Close /></Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label="FAQ" size="small" color={tab === 'faq' ? 'primary' : 'default'} onClick={() => setTab('faq')} clickable />
            <Chip label="Contact Support" size="small" color={tab === 'contact' ? 'primary' : 'default'} onClick={() => setTab('contact')} clickable />
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {tab === 'faq' ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Frequently asked questions about CitiScope
              </Typography>
              {FAQ.map((item, i) => (
                <Accordion key={i} disableGutters elevation={0} sx={{ border: '1px solid #e5e7eb', mb: 1, borderRadius: '8px !important' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" fontWeight={600}>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">{item.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
              <Divider sx={{ my: 2 }} />
              <Button startIcon={<MenuBook />} href="https://docs.citiscope.gov.et" target="_blank" fullWidth variant="outlined">
                View Full Documentation
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Describe your issue and our support team will respond within 24 hours.
              </Typography>
              <TextField
                fullWidth multiline rows={5} label="Your message"
                value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Describe the issue you're experiencing…"
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                📧 support@citiscope.gov.et · 📞 +251 11 123 4567
              </Typography>
            </Box>
          )}
        </DialogContent>

        {tab === 'contact' && (
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" startIcon={<Send />} onClick={sendSupport} disabled={!message.trim() || sending}>
              {sending ? 'Sending…' : 'Send Message'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};
