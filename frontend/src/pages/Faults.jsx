import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, IconButton, MenuItem, Snackbar, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { faultsApi, formatDateTime, machinesApi } from '../services/api';
import { errorMessage, hasRole } from '../services/authService';
import { downloadTablePdf } from '../utils/pdfLazy';
import StatusChip from '../components/operations/StatusChip';
import ReportFaultDialog from '../components/operations/ReportFaultDialog';
import FaultStatusDialog from '../components/operations/FaultStatusDialog';
import '../tables/Table.css';

const Faults = () => {
  const canWork = hasRole('admin', 'manager', 'technician');
  const canDelete = hasRole('admin');
  const [faults, setFaults] = useState([]);
  const [machines, setMachines] = useState([]);
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [toUpdate, setToUpdate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const [f, m] = await Promise.all([faultsApi.list(), machinesApi.list()]);
      setFaults(f);
      setMachines(m);
      setError('');
    } catch (e) {
      setError(errorMessage(e, 'Could not load fault reports'));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const machineName = (id) => {
    const m = machines.find((x) => x.id === id);
    return m ? `${m.name} (${m.code})` : `#${id}`;
  };

  const shown = useMemo(() => faults.filter((f) =>
    status === 'all' ? true : status === 'active' ? f.status !== 'Resolved' : f.status === status), [faults, status]);

  const remove = async (f) => {
    if (!window.confirm(`Delete fault report #${f.id}?`)) return;
    try {
      await faultsApi.remove(f.id);
      setFaults((prev) => prev.filter((x) => x.id !== f.id));
    } catch (e) {
      setToast({ severity: 'error', message: errorMessage(e, 'Could not delete') });
    }
  };

  const exportPdf = () => downloadTablePdf({
    title: 'Fault Reports',
    filterText: { active: 'Open + In Progress', all: '' }[status] ?? status,
    rows: shown,
    columns: [
      { header: '#', value: (f) => f.id },
      { header: 'Machine', value: (f) => machineName(f.machineId) },
      { header: 'Priority', value: (f) => f.priority },
      { header: 'Status', value: (f) => f.status },
      { header: 'Description', value: (f) => f.description },
      { header: 'Reported', value: (f) => `${f.reportedByName}, ${formatDateTime(f.reportedAt)}` },
      { header: 'Resolution', value: (f) => (f.resolvedAt ? `${f.resolutionNotes} (${f.resolvedByName}, ${formatDateTime(f.resolvedAt)})` : '') },
    ],
  });

  return (
    <div className="table-main-content">
      <h2 className="page-title">Fault Reports</h2>
      <div className="table-toolbar">
        <TextField size="small" select label="Show" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} sx={{ minWidth: 200 }}>
          <MenuItem value="active">Open and in progress</MenuItem>
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="In Progress">In progress</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </TextField>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="error" startIcon={<PictureAsPdfIcon />} onClick={exportPdf} disabled={!shown.length}>Export PDF</Button>
          <Button variant="contained" color="error" onClick={() => setReportOpen(true)} disabled={!machines.length}>Report Fault</Button>
        </Box>
      </div>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell><TableCell>Machine</TableCell><TableCell>Priority</TableCell><TableCell>Status</TableCell>
            <TableCell>Description</TableCell><TableCell>Reported</TableCell><TableCell>Resolution</TableCell>
            {(canWork || canDelete) && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {shown.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((f) => (
            <TableRow key={f.id}>
              <TableCell>{f.id}</TableCell>
              <TableCell>{machineName(f.machineId)}</TableCell>
              <TableCell><StatusChip value={f.priority} /></TableCell>
              <TableCell><StatusChip value={f.status} /></TableCell>
              <TableCell>{f.description}</TableCell>
              <TableCell>{f.reportedByName}<div className="cell-sub">{formatDateTime(f.reportedAt)}</div></TableCell>
              <TableCell>{f.resolvedAt ? <>{f.resolutionNotes}<div className="cell-sub">{f.resolvedByName}, {formatDateTime(f.resolvedAt)}</div></> : '—'}</TableCell>
              {(canWork || canDelete) && (
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {canWork && <Button size="small" color="error" onClick={() => setToUpdate(f)}>Update</Button>}
                    {canDelete && <Tooltip title="Delete"><IconButton style={{ color: '#be171d' }} onClick={() => remove(f)} aria-label={`Delete fault ${f.id}`}><DeleteIcon /></IconButton></Tooltip>}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
          {shown.length === 0 && (
            <TableRow><TableCell colSpan={8} align="center" className="empty-cell">
              {faults.length === 0 ? 'No faults have been reported.' : 'No fault reports in this view.'}
            </TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={shown.length} rowsPerPage={rowsPerPage} page={page}
        onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />

      <ReportFaultDialog open={reportOpen} machines={machines} onClose={() => setReportOpen(false)}
        onSaved={() => { load(); setToast({ severity: 'success', message: 'Fault reported – technicians and managers have been notified' }); }} />
      <FaultStatusDialog fault={toUpdate} onClose={() => setToUpdate(null)} onSaved={() => { load(); setToast({ severity: 'success', message: 'Fault updated' }); }} />
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </div>
  );
};

export default Faults;
