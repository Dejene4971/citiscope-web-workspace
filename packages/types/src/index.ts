// Auth Types
export interface AdminUser {
  user_id: string;
  email: string;
  role: 'woreda_admin' | 'zonal_admin' | 'regional_admin' | 'federal_admin';
  admin_unit_id: string;
  permissions: string[];
  full_name: string;
  created_at: string;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Issue Types
export interface Issue {
  issue_id: string;
  title: string;
  description: string;
  category: 'water' | 'road' | 'electricity' | 'sewage' | 'waste';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'assigned' | 'in_progress' | 'resolved';
  location: {
    latitude: number;
    longitude: number;
    woreda_id: string;
    zone_id?: string;
    address?: string;
  };
  reported_by: string;
  reported_at: string;
  assigned_to?: string;
  resolved_at?: string;
  media_urls: string[];
  resolution_notes?: string;
}

// Dashboard Types
export interface DashboardMetrics {
  total_issues: number;
  active_issues: number;
  resolved_issues: number;
  critical_alerts: number;
  avg_resolution_hours: number;
  issues_by_category: Record<string, number>;
  issues_by_status: Record<string, number>;
  issues_trend: number;
  resolved_trend: number;
  alerts_trend: number;
  resolution_trend: number;
}

// IoT Types
export interface IoTAlert {
  sensor_id: string;
  sensor_type: 'water_pressure' | 'vibration' | 'electrical' | 'flood' | 'air_quality';
  status: 'active' | 'inactive' | 'maintenance' | 'faulty';
  latitude: number;
  longitude: number;
  last_update: string;
  metrics: {
    value: number;
    unit: string;
    threshold: number;
    is_critical: boolean;
  };
  location: {
    woreda_id: string;
    address: string;
  };
}