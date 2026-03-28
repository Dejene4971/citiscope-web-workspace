export type IssueCategory = 'water' | 'road' | 'electricity' | 'sewage' | 'waste';
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'pending' | 'verified' | 'assigned' | 'in_progress' | 'resolved';

export interface IssueLocation {
  latitude: number;
  longitude: number;
  woreda_id: string;
  zone_id?: string;
  region_id?: string;
  address?: string;
}

export interface Issue {
  issue_id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  location: IssueLocation;
  reported_by: string;
  reported_at: string;
  assigned_to?: string;
  resolved_at?: string;
  media_urls: string[];
  resolution_notes?: string;
  upvotes: number;
}

export interface IssueFilters {
  status?: IssueStatus[];
  category?: IssueCategory[];
  severity?: IssueSeverity[];
  woreda_id?: string;
  zone_id?: string;
  region_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface PaginatedIssues {
  data: Issue[];
  total: number;
  page: number;
  per_page: number;
}
