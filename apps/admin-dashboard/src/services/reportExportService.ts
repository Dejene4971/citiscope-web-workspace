import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ReportData {
  title: string;
  date: Date;
  metrics: {
    name: string;
    value: number;
    change: number;
  }[];
  chartData: any[];
  recommendations: string[];
}

export class ReportExportService {
  static exportToExcel(data: any[], filename: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
  
  static exportToCSV(data: any[], filename: string): void {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  }
  
  static generateReport(reportData: ReportData): void {
    const report = {
      title: reportData.title,
      generatedAt: reportData.date.toISOString(),
      metrics: reportData.metrics,
      recommendations: reportData.recommendations,
    };
    
    const worksheet = XLSX.utils.json_to_sheet([report]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Executive Report');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `executive_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
  
  static downloadJSON(data: any, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  }
}