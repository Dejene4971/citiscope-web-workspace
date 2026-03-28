export type NotificationType = 'issue_created' | 'issue_updated' | 'alert_triggered' | 'assignment';
export type NotificationSeverity = 'info' | 'warning' | 'critical';

export interface Notification {
  notification_id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  read: boolean;
  created_at: string;
  link?: string;
}
