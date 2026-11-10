import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, IconButton, MenuItem, Snackbar, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { formatDateTime, machinesApi, maintenanceApi } from '../services/api';
import { errorMessage, hasRole } from '../services/authService';
import { downloadTablePdf } from '../utils/pdfLazy';
import StatusChip from '../components/operations/StatusChip';
import MaintenanceDialog from '../components/operations/MaintenanceDialog';
import '../tables/Table.css';

const Maintenance = () => {
  const canWork = hasRole('admin', 'manager', 'technician');
  const canDelete = hasRole('admin', 'manager');
  const [records, setRecords] = useState([]);
  const [machines, setMachines] = useState([]);
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState({ open: false, record: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const [r, m] = await Promise.all([maintenanceApi.list(), machinesApi.list()]);
      setRecords(r);
      setMachines(m);
      setError('');
    } catch (e) {
      setError(errorMessage(e, 'Could not load maintenance records'));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const machineName = (id) => {
    const m = machines.find((x) => x.id === id);
    return m ? `${m.name} (${m.code})` : `#${id}`;
  };

  const shown = useMemo(() => records.filter((r) =>
    status === 'all' ? true : status === 'active' ? ['Scheduled', 'In Progress'].includes(r.status) : r.status === status), [records, status]);

  const remove = async (r) => {
    if (!window.confirm(`Delete maintenance record #${r.id}?`)) return;
    try {
      await maintenanceApi.remove(r.id);
      load();
    } catch (e) {
      setToast({ severity: 'error', message: errorMessage(e, 'Could not delete') });
    }
  };

  const exportPdf = () => downloadTablePdf({
    title: 'Maintenance',
    filterText: { active: 'Scheduled + In Progress', all: '' }[status] ?? status,
    rows: shown,
    columns: [
      { header: '#', value: (r) => r.id },
      { header: 'Date', value: (r) => r.scheduledDate },
      { header: 'Machine', value: (r) => machineName(r.machineId) },
      { header: 'Type', value: (r) => r.maintenanceType },
      { header: 'Status', value: (r) => r.status },
      { header: 'Work', value: (r) => r.description },
      { header: 'Technician', value: (r) => r.technicianName },
      { header: 'Completed', value: (r) => (r.completedAt ? formatDateTime(r.completedAt) : '') },
    ],
  });

  return (
    <div className="table-main-content">
      <h2 className="page-title">Maintenance</h2>
      <div className="table-toolbar">
        <TextField size="small" select label="Show" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} sx={{ minWidth: 200 }}>
          <MenuItem value="active">Scheduled and in progress</MenuItem>
          <MenuItem value="Scheduled">Scheduled</MenuItem>
          <MenuItem value="In Progress">In progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </TextField>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="error" startIcon={<PictureAsPdfIcon />} onClick={exportPdf} disabled={!shown.length}>Export PDF</Button>
          {canWork && <Button variant="contained" color="error" onClick={() => setDialog({ open: true, record: null })} disabled={!machines.length}>Schedule Maintenance</Button>}
        </Box>
      </div>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell><TableCell>Date</TableCell><TableCell>Machine</TableCell><TableCell>Type</TableCell>
            <TableCell>Status</TableCell><TableCell>Work</TableCell><TableCell>Technician</TableCell>
            {(canWork || canDelete) && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {shown.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.scheduledDate}</TableCell>
              <TableCell>{machineName(r.machineId)}</TableCell>
              <TableCell>{r.maintenanceType}{r.faultId && <div className="cell-sub">for fault #{r.faultId}</div>}</TableCell>
              <TableCell><StatusChip value={r.status} />{r.completedAt && <div className="cell-sub">{formatDateTime(r.completedAt)}</div>}</TableCell>
              <TableCell>{r.description}{r.notes && <div className="cell-sub">{r.notes}</div>}</TableCell>
              <TableCell>{r.technicianName || '—'}</TableCell>
              {(canWork || canDelete) && (
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {canWork && <Button size="small" color="error" onClick={() => setDialog({ open: true, record: r })}>Update</Button>}
                    {canDelete && <Tooltip title="Delete"><IconButton style={{ color: '#be171d' }} onClick={() => remove(r)} aria-label={`Delete maintenance ${r.id}`}><DeleteIcon /></IconButton></Tooltip>}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
          {shown.length === 0 && (
            <TableRow><TableCell colSpan={8} align="center" className="empty-cell">
              {records.length === 0 ? 'No maintenance has been scheduled.' : 'No maintenance records in this view.'}
            </TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={shown.length} rowsPerPage={rowsPerPage} page={page}
        onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />

      <MaintenanceDialog open={dialog.open} record={dialog.record} machines={machines}
        onClose={() => setDialog({ open: false, record: null })}
        onSaved={() => { load(); setToast({ severity: 'success', message: 'Maintenance saved' }); }} />
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </div>
  );
};

export default Maintenance;
