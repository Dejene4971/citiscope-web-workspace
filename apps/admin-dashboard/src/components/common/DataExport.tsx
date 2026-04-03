import React from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Code as JsonIcon,
  TextSnippet as CsvIcon,
} from '@mui/icons-material';
import { ReportExportService } from '../../services/reportExportService';

interface DataExportProps {
  data: any[];
  filename: string;
  buttonText?: string;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
}

export const DataExport: React.FC<DataExportProps> = ({
  data,
  filename,
  buttonText = 'Export',
  variant = 'outlined',
  size = 'small',
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportExcel = () => {
    ReportExportService.exportToExcel(data, filename);
    handleClose();
  };

  const handleExportCSV = () => {
    ReportExportService.exportToCSV(data, filename);
    handleClose();
  };

  const handleExportJSON = () => {
    ReportExportService.downloadJSON(data, filename);
    handleClose();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={<DownloadIcon />}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon><ExcelIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export as Excel (.xlsx)</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon><CsvIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportJSON}>
          <ListItemIcon><JsonIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export as JSON</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemIcon><PdfIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export as PDF (Coming Soon)</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};