export interface TimeSeriesData {
  date: string;
  actual: number;
  forecast?: number;
  confidenceUpper?: number;
  confidenceLower?: number;
}

export interface AnomalyResult {
  index: number;
  value: number;
  zScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskScore {
  category: string;
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  trend: 'improving' | 'stable' | 'worsening';
}

export class PredictiveAnalyticsService {
  // Time Series Forecasting using Exponential Smoothing
  static forecastTimeSeries(
    historicalData: number[],
    periods: number = 7,
    alpha: number = 0.3
  ): number[] {
    const forecast: number[] = [];
    let lastForecast = historicalData[historicalData.length - 1];
    
    for (let i = 0; i < periods; i++) {
      const actual = historicalData[historicalData.length - periods + i] || lastForecast;
      const newForecast = alpha * actual + (1 - alpha) * lastForecast;
      forecast.push(newForecast);
      lastForecast = newForecast;
    }
    
    return forecast;
  }
  
  // Anomaly Detection using Z-Score with Adaptive Threshold
  static detectAnomalies(
    data: number[],
    threshold: number = 2.5
  ): AnomalyResult[] {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    const anomalies: AnomalyResult[] = [];
    
    data.forEach((value, index) => {
      const zScore = Math.abs((value - mean) / stdDev);
      if (zScore > threshold) {
        let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
        if (zScore > 4) severity = 'critical';
        else if (zScore > 3.5) severity = 'high';
        else if (zScore > 3) severity = 'medium';
        
        anomalies.push({ index, value, zScore, severity });
      }
    });
    
    return anomalies;
  }
  
  // Risk Scoring Algorithm
  static calculateRiskScore(
    frequency: number,
    severity: number,
    impact: number,
    trend: 'increasing' | 'decreasing' | 'stable'
  ): RiskScore {
    const baseScore = (frequency * 0.3 + severity * 0.4 + impact * 0.3);
    const trendMultiplier = trend === 'increasing' ? 1.2 : trend === 'decreasing' ? 0.85 : 1;
    const score = Math.min(100, baseScore * trendMultiplier);
    
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score > 80) level = 'critical';
    else if (score > 60) level = 'high';
    else if (score > 30) level = 'medium';
    
    return {
      category: '',
      score,
      level,
      trend: trend === 'increasing' ? 'worsening' : trend === 'decreasing' ? 'improving' : 'stable',
    };
  }
  
  // Seasonality Detection
  static detectSeasonality(data: number[]): {
    daily: number[];
    weekly: number[];
    monthly: number[];
  } {
    const daily = data.slice(-7);
    const weekly = [];
    for (let i = 0; i < Math.min(4, Math.floor(data.length / 7)); i++) {
      const weekStart = data.length - (i + 1) * 7;
      const weekAvg = data.slice(weekStart, weekStart + 7).reduce((a, b) => a + b, 0) / 7;
      weekly.push(weekAvg);
    }
    
    const monthly = [];
    for (let i = 0; i < Math.min(3, Math.floor(data.length / 30)); i++) {
      const monthStart = data.length - (i + 1) * 30;
      const monthAvg = data.slice(monthStart, monthStart + 30).reduce((a, b) => a + b, 0) / 30;
      monthly.push(monthAvg);
    }
    
    return { daily, weekly, monthly };
  }
  
  // Resource Optimization Recommendation
  static optimizeResourceAllocation(
    woredaData: Array<{ name: string; issues: number; resolutionTime: number; criticalCount: number }>
  ): Array<{ woreda: string; recommendedResources: number; priority: number; expectedImprovement: number }> {
    const totalIssues = woredaData.reduce((sum, w) => sum + w.issues, 0);
    
    return woredaData
      .map(w => {
        const weight = (w.issues / totalIssues) * 0.4 +
                      (w.criticalCount / w.issues) * 0.4 +
                      (1 - w.resolutionTime / 24) * 0.2;
        const recommendedResources = Math.ceil(weight * 10);
        
        return {
          woreda: w.name,
          recommendedResources,
          priority: Math.ceil(weight * 100),
          expectedImprovement: Math.min(30, weight * 50),
        };
      })
      .sort((a, b) => b.priority - a.priority);
  }
}