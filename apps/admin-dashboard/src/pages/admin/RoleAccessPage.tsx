import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Grid, Chip, Avatar, Button,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TextField, InputAdornment, IconButton, Tooltip, Tabs, Tab,
  Switch, Divider, FormControl, InputLabel, Select, MenuItem,
  Pagination, List, ListItemButton, ListItemText, Collapse,
  Card, CardContent,
} from '@mui/material';
import {
  Search, Edit, PersonAdd, CheckCircle, Cancel,
  Shield, AdminPanelSettings, SupervisorAccount,
  TrendingUp, HourglassEmpty, Security, Map,
  ExpandLess, ExpandMore, FolderOpen,
} from '@mui/icons-material';
import { EditTeamMemberModal, type TeamMember, type AdminRole } from '../../components/modals/EditTeamMemberModal';
import { showToast } from '../../components/notifications/ToastNotifications';
import { auditService } from '../../services/auditService';

// ── Static data ───────────────────────────────────────────────────────────────

const MOCK_MEMBERS: TeamMember[] = [
  { id: 'U1', fullName: 'Tewodros Gebre',    email: 't.gebre@gov.et',    phone: '+251 911 111 111', role: 'regional_admin', adminUnit: 'Amhara Regional HQ',          department: 'Infrastructure Management', isActive: true  },
  { id: 'U2', fullName: 'Selamawit Alemu',   email: 's.alemu@gov.et',    phone: '+251 922 222 222', role: 'zonal_admin',    adminUnit: 'North Gondar Zone',            department: 'Water & Sanitation',        isActive: true  },
  { id: 'U3', fullName: 'Mulugeta Kassahun', email: 'm.kassahun@gov.et', phone: '+251 933 333 333', role: 'technician',     adminUnit: 'Infrastructure Dept.',         department: 'IoT Operations',            isActive: true  },
  { id: 'U4', fullName: 'Abebe Kebede',      email: 'a.kebede@gov.et',   phone: '+251 944 444 444', role: 'federal_admin',  adminUnit: 'Federal — National Level',     department: 'Infrastructure Management', isActive: true  },
  { id: 'U5', fullName: 'Tigist Haile',      email: 't.haile@gov.et',    phone: '+251 955 555 555', role: 'regional_admin', adminUnit: 'Addis Ababa City Administration', department: 'Water & Sanitation',     isActive: true  },
  { id: 'U6', fullName: 'Yared Tadesse',     email: 'y.tadesse@gov.et',  phone: '+251 966 666 666', role: 'zonal_admin',    adminUnit: 'Oromia Regional State',        department: 'Roads & Transport',         isActive: true  },
  { id: 'U7', fullName: 'Meron Bekele',      email: 'm.bekele@gov.et',   phone: '+251 977 777 777', role: 'woreda_admin',   adminUnit: 'Addis Ababa City Administration', department: 'Waste Management',       isActive: false },
  { id: 'U8', fullName: 'Dawit Girma',       email: 'd.girma@gov.et',    phone: '+251 988 888 888', role: 'technician',     adminUnit: 'Oromia Regional State',        department: 'IoT Operations',            isActive: true  },
  { id: 'U9', fullName: 'Hana Solomon',      email: 'h.solomon@gov.et',  phone: '+251 999 999 999', role: 'viewer',         adminUnit: 'Amhara Regional State',        department: 'Analytics & Reporting',     isActive: true  },
];

type Permission = 'view_dashboard' | 'manage_issues' | 'assign_technicians' | 'view_analytics' | 'manage_iot' | 'system_settings' | 'user_management' | 'export_reports';

const PERMISSIONS: { key: Permission; label: string; description: string }[] = [
  { key: 'view_dashboard',     label: 'View Dashboard',     description: 'Access main dashboard and KPIs'     },
  { key: 'manage_issues',      label: 'Manage Issues',      description: 'Create, update, resolve issues'     },
  { key: 'assign_technicians', label: 'Assign Technicians', description: 'Assign field technicians to issues' },
  { key: 'view_analytics',     label: 'View Analytics',     description: 'Access analytics and reports'       },
  { key: 'manage_iot',         label: 'Manage IoT',         description: 'Configure sensors and alerts'       },
  { key: 'system_settings',    label: 'System Settings',    description: 'Modify system configuration'        },
  { key: 'user_management',    label: 'User Management',    description: 'Add, edit, deactivate users'        },
  { key: 'export_reports',     label: 'Export Reports',     description: 'Download data exports'              },
];

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  federal_admin:  ['view_dashboard','manage_issues','assign_technicians','view_analytics','manage_iot','system_settings','user_management','export_reports'],
  regional_admin: ['view_dashboard','manage_issues','assign_technicians','view_analytics','manage_iot','export_reports'],
  zonal_admin:    ['view_dashboard','manage_issues','assign_technicians','view_analytics','export_reports'],
  woreda_admin:   ['view_dashboard','manage_issues','assign_technicians'],
  technician:     ['view_dashboard','manage_issues'],
  viewer:         ['view_dashboard','view_analytics'],
};

const ROLE_META: Record<AdminRole, { label: string; color: string; icon: React.ReactNode }> = {
  federal_admin:  { label: 'Federal Admin',   color: '#7c3aed', icon: <AdminPanelSettings /> },
  regional_admin: { label: 'Regional Admin',  color: '#1d4ed8', icon: <Shield /> },
  zonal_admin:    { label: 'Zonal Admin',     color: '#0369a1', icon: <Shield /> },
  woreda_admin:   { label: 'Woreda Admin',    color: '#0891b2', icon: <SupervisorAccount /> },
  technician:     { label: 'Technician',      color: '#059669', icon: <SupervisorAccount /> },
  viewer:         { label: 'Viewer',          color: '#6b7280', icon: <SupervisorAccount /> },
};

const ROLE_FILTER_OPTIONS = [
  { value: 'all',            label: 'All Roles'          },
  { value: 'regional_admin', label: 'Regional Directors' },
  { value: 'zonal_admin',    label: 'Zonal Officers'     },
  { value: 'woreda_admin',   label: 'Woreda Leads'       },
  { value: 'technician',     label: 'Technicians'        },
  { value: 'viewer',         label: 'Viewers'            },
];

const TOTAL_USERS = 152;
const PAGE_SIZE   = 3;

// ── Statistics cards data ─────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    title: 'Total Admins',
    value: '1,284',
    subtitle: '+12% this month',
    icon: <AdminPanelSettings sx={{ fontSize: 28 }} />,
    color: '#1d4ed8',
    trend: 'up',
  },
  {
    title: 'Pending Approvals',
    value: '42',
    subtitle: 'Awaiting regional verification',
    icon: <HourglassEmpty sx={{ fontSize: 28 }} />,
    color: '#d97706',
    trend: 'neutral',
  },
  {
    title: 'Security Incidents',
    value: '0',
    subtitle: 'All protocols active',
    icon: <Security sx={{ fontSize: 28 }} />,
    color: '#059669',
    trend: 'good',
  },
  {
    title: 'Amhara View',
    value: '154,709 km²',
    subtitle: 'POP. DENSITY High',
    icon: <Map sx={{ fontSize: 28 }} />,
    color: '#7c3aed',
    trend: 'neutral',
  },
];

// ── Hierarchy tree data ───────────────────────────────────────────────────────

interface HierarchyNode {
  id: string;
  label: string;
  children?: HierarchyNode[];
}

const HIERARCHY: HierarchyNode[] = [
  {
    id: 'federal', label: 'Federal Level',
    children: [
      {
        id: 'amhara', label: 'Amhara Region',
        children: [
          { id: 'n-gondar', label: 'North Gondar Zone' },
          { id: 's-wollo',  label: 'South Wollo Zone'  },
          { id: 'bahir-dar',label: 'Bahir Dar Special' },
        ],
      },
      { id: 'oromia', label: 'Oromia Region' },
      { id: 'tigray', label: 'Tigray Region' },
    ],
  },
  {
    id: 'platform', label: 'Platform Management',
    children: [
      { id: 'infra',   label: 'Infrastructure Nodes' },
      { id: 'intel',   label: 'Intelligence Feed'    },
      { id: 'access',  label: 'Access Control'       },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const HierarchyItem: React.FC<{ node: HierarchyNode; depth?: number; selected: string; onSelect: (id: string) => void }> = ({
  node, depth = 0, selected, onSelect,
}) => {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = !!node.children?.length;
  const isSelected = selected === node.id;

  return (
    <>
      <ListItemButton
        onClick={() => { hasChildren && setOpen(o => !o); onSelect(node.id); }}
        selected={isSelected}
        sx={{
          pl: 2 + depth * 2,
          py: 0.75,
          borderRadius: 1,
          '&.Mui-selected': { bgcolor: 'primary.50', color: 'primary.main' },
        }}
      >
        <FolderOpen sx={{ fontSize: 16, mr: 1, color: isSelected ? 'primary.main' : 'text.secondary' }} />
        <ListItemText
          primary={node.label}
          primaryTypographyProps={{ variant: 'body2', fontWeight: isSelected ? 700 : 400 }}
        />
        {hasChildren && (open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open}>
          {node.children!.map(child => (
            <HierarchyItem key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
          ))}
        </Collapse>
      )}
    </>
  );
};

interface TabPanelProps { children: React.ReactNode; index: number; value: number; }
const TabPanel = ({ children, index, value }: TabPanelProps) => (
  <Box hidden={value !== index} sx={{ pt: 3 }}>{value === index && children}</Box>
);

// ── Main page ─────────────────────────────────────────────────────────────────

export const RoleAccessPage: React.FC = () => {
  const [tab, setTab]               = useState(0);
  const [members, setMembers]       = useState<TeamMember[]>(MOCK_MEMBERS);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [page, setPage]             = useState(1);
  const [selectedNode, setSelectedNode] = useState('federal');

  const filtered = useMemo(() =>
    members.filter(m => {
      const matchSearch = m.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          m.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || m.role === roleFilter;
      return matchSearch && matchRole;
    }), [members, search, roleFilter]);

  // Paginate the filtered list (show PAGE_SIZE per page)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount  = Math.ceil(TOTAL_USERS / PAGE_SIZE);

  const handleSave = (updated: TeamMember) =>
    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));

  const handleToggleActive = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== id) return m;
      const next = { ...m, isActive: !m.isActive };
      auditService.log('UPDATE_STATUS', { entityId: id, entityType: 'user', payload: { isActive: next.isActive } });
      showToast({ type: next.isActive ? 'success' : 'warning', title: next.isActive ? 'Account Activated' : 'Account Deactivated', message: `${m.fullName}'s account status changed` });
      return next;
    }));
  };

  const roleCounts = useMemo(() =>
    (Object.keys(ROLE_META) as AdminRole[]).reduce((acc, role) => {
      acc[role] = members.filter(m => m.role === role).length;
      return acc;
    }, {} as Record<AdminRole, number>), [members]);

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Role & Access Control</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage user roles, permissions, and access levels across the hierarchy
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAdd />} size="small">Invite Member</Button>
      </Box>

      {/* ── 1. Statistics Cards ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {STAT_CARDS.map(card => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={{ borderLeft: `4px solid ${card.color}`, borderRadius: 2 }}>
              <CardContent sx={{ pb: '12px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: card.color, my: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {card.trend === 'up' && <TrendingUp sx={{ fontSize: 14, color: '#22c55e' }} />}
                      <Typography variant="caption" color="text.secondary">{card.subtitle}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ color: card.color, opacity: 0.7 }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Role summary chips ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {(Object.entries(ROLE_META) as [AdminRole, typeof ROLE_META[AdminRole]][]).map(([role, meta]) => (
          <Grid item xs={6} sm={4} md={2} key={role}>
            <Paper
              sx={{
                p: 1.5, borderRadius: 2, cursor: 'pointer', textAlign: 'center',
                border: '1.5px solid',
                borderColor: roleFilter === role ? meta.color : 'divider',
                bgcolor: roleFilter === role ? `${meta.color}10` : 'background.paper',
                transition: 'all 0.15s',
                '&:hover': { borderColor: meta.color },
              }}
              onClick={() => { setRoleFilter(prev => prev === role ? 'all' : role); setPage(1); }}
            >
              <Box sx={{ color: meta.color, mb: 0.5 }}>{meta.icon}</Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: meta.color }}>{roleCounts[role]}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                {meta.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Main content: sidebar + tabs ── */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>

        {/* ── 2. AdminHierarchySidebar ── */}
        <Paper sx={{ width: 240, flexShrink: 0, borderRadius: 2, p: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ px: 1, mb: 1, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>
            Admin Hierarchy
          </Typography>
          <List dense disablePadding>
            {HIERARCHY.map(node => (
              <HierarchyItem key={node.id} node={node} selected={selectedNode} onSelect={setSelectedNode} />
            ))}
          </List>
        </Paper>

        {/* ── Tabs ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ borderRadius: 2 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid #e5e7eb', px: 2 }}>
              <Tab label="User Directory" sx={{ textTransform: 'none' }} />
              <Tab label="Permission Matrix" sx={{ textTransform: 'none' }} />
            </Tabs>

            {/* ── Tab 0: User Directory ── */}
            <TabPanel value={tab} index={0}>
              <Box sx={{ px: 3, pb: 3 }}>

                {/* ── 4. Filter dropdown + search ── */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <TextField
                    size="small" placeholder="Search by name or email…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Filter By</InputLabel>
                    <Select
                      value={roleFilter}
                      label="Filter By"
                      onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
                    >
                      {ROLE_FILTER_OPTIONS.map(o => (
                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* ── 3. User cards ── */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                  {paginated.map(m => {
                    const meta = ROLE_META[m.role];
                    const initials = m.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <Paper
                        key={m.id}
                        variant="outlined"
                        sx={{
                          p: 2, borderRadius: 2, opacity: m.isActive ? 1 : 0.6,
                          display: 'flex', alignItems: 'center', gap: 2,
                          '&:hover': { borderColor: meta.color, boxShadow: 1 },
                          transition: 'all 0.15s',
                        }}
                      >
                        <Avatar sx={{ width: 44, height: 44, bgcolor: meta.color, fontWeight: 700, fontSize: '0.9rem' }}>
                          {initials}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" fontWeight={700}>{m.fullName}</Typography>
                            <Chip
                              label={meta.label}
                              size="small"
                              sx={{ bgcolor: `${meta.color}15`, color: meta.color, fontWeight: 600, fontSize: 10, height: 20 }}
                            />
                            {!m.isActive && <Chip label="Inactive" size="small" color="default" sx={{ height: 20, fontSize: 10 }} />}
                          </Box>
                          <Typography variant="caption" color="text.secondary">{m.email}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            📍 {m.adminUnit}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Switch size="small" checked={m.isActive} onChange={() => handleToggleActive(m.id)} color="success" />
                          <Tooltip title="Edit member">
                            <IconButton size="small" onClick={() => setEditTarget(m)}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>
                    );
                  })}
                  {paginated.length === 0 && (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography color="text.secondary">No members match your search</Typography>
                    </Box>
                  )}
                </Box>

                {/* ── 5. Pagination ── */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Showing {Math.min(paginated.length, PAGE_SIZE)} of {TOTAL_USERS} users in this tier
                  </Typography>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    size="small"
                    color="primary"
                  />
                </Box>
              </Box>
            </TabPanel>

            {/* ── Tab 1: Permission Matrix ── */}
            <TabPanel value={tab} index={1}>
              <Box sx={{ px: 3, pb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Read-only permission matrix. Edit roles in User Directory.
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f9fafb' }}>
                        <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>Permission</TableCell>
                        {(Object.keys(ROLE_META) as AdminRole[]).map(role => (
                          <TableCell key={role} align="center" sx={{ fontWeight: 700, minWidth: 100 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                              <Box sx={{ color: ROLE_META[role].color }}>{ROLE_META[role].icon}</Box>
                              <Typography variant="caption" sx={{ color: ROLE_META[role].color, fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}>
                                {ROLE_META[role].label}
                              </Typography>
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {PERMISSIONS.map(perm => (
                        <TableRow key={perm.key} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{perm.label}</Typography>
                            <Typography variant="caption" color="text.secondary">{perm.description}</Typography>
                          </TableCell>
                          {(Object.keys(ROLE_META) as AdminRole[]).map(role => {
                            const has = ROLE_PERMISSIONS[role].includes(perm.key);
                            return (
                              <TableCell key={role} align="center">
                                {has
                                  ? <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
                                  : <Cancel sx={{ color: '#e5e7eb', fontSize: 20 }} />
                                }
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      </Box>

      {/* Edit Modal */}
      <EditTeamMemberModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        member={editTarget}
        onSave={handleSave}
      />
    </Box>
  );
};
