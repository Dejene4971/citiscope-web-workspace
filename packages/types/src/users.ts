export type UserRole = 'citizen' | 'technician' | 'woreda_admin' | 'zonal_admin' | 'regional_admin' | 'federal_admin';

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  admin_unit_id?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Technician extends User {
  role: 'technician';
  specializations: string[];
  assigned_woreda_id: string;
  active_assignments: number;
}
