/** Administrative hierarchy roles */
export type AdminRole =
  | 'woreda_admin'
  | 'zonal_admin'
  | 'regional_admin'
  | 'federal_admin';

export interface AdminUser {
  user_id: string;
  email: string;
  role: AdminRole;
  admin_unit_id: string;
  permissions: string[];
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AdminUser;
  token: string;
  expires_at: string;
}
