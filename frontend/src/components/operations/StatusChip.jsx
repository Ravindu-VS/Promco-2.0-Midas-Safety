import React from 'react';
import { Chip } from '@mui/material';

const COLORS = {
  Operational: 'success',
  'Under Maintenance': 'warning',
  Faulty: 'error',
  Inactive: 'default',
  Open: 'error',
  'In Progress': 'warning',
  Resolved: 'success',
  Scheduled: 'info',
  Completed: 'success',
  Cancelled: 'default',
  Low: 'default',
  Medium: 'info',
  High: 'warning',
  Critical: 'error',
};

const StatusChip = ({ value }) => (
  <Chip size="small" label={value || '—'} color={COLORS[value] || 'default'} variant={value === 'Low' ? 'outlined' : 'filled'} />
);

export default StatusChip;
