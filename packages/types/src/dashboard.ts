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

export interface TrendPoint {
  date: string;
  value: number;
}

export interface DashboardChartData {
  issues_over_time: TrendPoint[];
  resolution_rate: TrendPoint[];
  category_breakdown: { label: string; value: number; color: string }[];
}
