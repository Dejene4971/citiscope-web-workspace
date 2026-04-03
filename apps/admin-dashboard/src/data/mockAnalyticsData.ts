// ── Time series ───────────────────────────────────────────────────────────────
export const MONTHLY_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const WEEKLY_LABELS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HOURLY_LABELS  = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

// Actual reported issues per month
export const REPORTED_MONTHLY  = [45, 52, 38, 61, 55, 48, 70, 65, 58, 72, 68, 80];
export const RESOLVED_MONTHLY  = [40, 48, 35, 55, 50, 44, 63, 60, 54, 68, 62, 74];

// ML forecast (next 3 months appended)
export const FORECAST_LABELS   = [...MONTHLY_LABELS, 'Jan+1', 'Feb+1', 'Mar+1'];
export const FORECAST_ACTUAL   = [...REPORTED_MONTHLY, null, null, null];
export const FORECAST_PREDICTED = [null, null, null, null, null, null, null, null, null, null, null, 80, 85, 91, 88];

// Anomaly data points (index → value pairs that are outliers)
export const ANOMALY_POINTS = [
  { month: 3, value: 61, reason: 'Heavy rainfall season' },
  { month: 6, value: 70, reason: 'Infrastructure aging spike' },
  { month: 11, value: 80, reason: 'Year-end surge' },
];

// Issue density by woreda (for heatmap)
export const WOREDA_DENSITY = [
  { id: 'W-001', name: 'Bole',     lat: 9.011, lng: 38.746, count: 34, risk: 'high'     },
  { id: 'W-002', name: 'Kirkos',   lat: 9.033, lng: 38.765, count: 28, risk: 'high'     },
  { id: 'W-003', name: 'Kazanchis',lat: 9.045, lng: 38.712, count: 18, risk: 'medium'   },
  { id: 'W-004', name: 'Merkato',  lat: 9.008, lng: 38.754, count: 12, risk: 'medium'   },
  { id: 'W-005', name: 'Piassa',   lat: 9.022, lng: 38.733, count: 8,  risk: 'low'      },
  { id: 'W-006', name: 'CMC',      lat: 9.055, lng: 38.780, count: 5,  risk: 'low'      },
];

// KPI performance scores (0-100) for radar chart
export const KPI_LABELS = ['Resolution Rate', 'Response Time', 'Citizen Satisfaction', 'Resource Efficiency', 'Preventive Actions', 'Data Coverage'];
export const KPI_CURRENT  = [84, 72, 78, 65, 55, 90];
export const KPI_TARGET   = [90, 85, 85, 80, 75, 95];

// Risk scores by category
export const RISK_DATA = [
  { category: 'Water',       score: 78, trend: +5,  issues: 34, predicted: 38 },
  { category: 'Road',        score: 65, trend: -3,  issues: 28, predicted: 26 },
  { category: 'Electricity', score: 82, trend: +8,  issues: 18, predicted: 22 },
  { category: 'Sewage',      score: 71, trend: +2,  issues: 12, predicted: 13 },
  { category: 'Waste',       score: 45, trend: -8,  issues: 8,  predicted: 7  },
];

// Resource allocation recommendations
export const RESOURCE_RECOMMENDATIONS = [
  { woreda: 'Bole',      technicians: 4, priority: 'critical', reason: 'High water pipe failure rate' },
  { woreda: 'Kirkos',    technicians: 3, priority: 'high',     reason: 'Road deterioration trend' },
  { woreda: 'Kazanchis', technicians: 2, priority: 'medium',   reason: 'Electrical grid aging' },
  { woreda: 'Merkato',   technicians: 2, priority: 'medium',   reason: 'Waste accumulation pattern' },
];

// Maintenance predictions
export const MAINTENANCE_PREDICTIONS = [
  { asset: 'Water Main – Bole Rd',    daysUntilFailure: 12, confidence: 87, action: 'Immediate inspection' },
  { asset: 'Power Grid – Kazanchis',  daysUntilFailure: 28, confidence: 74, action: 'Schedule maintenance' },
  { asset: 'Sewer Line – Piassa',     daysUntilFailure: 45, confidence: 68, action: 'Monitor closely'      },
  { asset: 'Road Surface – CMC',      daysUntilFailure: 60, confidence: 61, action: 'Plan resurfacing'     },
];
