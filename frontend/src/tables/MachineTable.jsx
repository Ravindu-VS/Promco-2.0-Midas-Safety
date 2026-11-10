import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Snackbar,
  Tab, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Tabs, TextField, Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { faultsApi, formatDateTime, machinesApi, maintenanceApi } from '../services/api';
import { errorMessage, hasRole } from '../services/authService';
import useReferences from '../hooks/useReferences';
import { downloadTablePdf } from '../utils/pdfLazy';
import StatusChip from '../components/operations/StatusChip';
import ReportFaultDialog from '../components/operations/ReportFaultDialog';
import FaultStatusDialog from '../components/operations/FaultStatusDialog';
import MaintenanceDialog from '../components/operations/MaintenanceDialog';
import './Table.css';

const STATUSES = ['Operational', 'Under Maintenance', 'Faulty', 'Inactive'];
const REF_FIELDS = ['machineTypeId', 'mainSectionId', 'subSectionId', 'plantDepartmentId'];
const EMPTY = {
  name: '', code: '', machineTypeId: '', mainSectionId: '', subSectionId: '', plantDepartmentId: '', sapResource: '',
  serialNumber: '', manufacturer: '', modelNumber: '', manufactureYear: '', installDate: '', status: 'Operational',
};

const MachineDetail = ({ machine, onClose, onChanged, labelFor }) => {
  const [tab, setTab] = useState(0);
  const [faults, setFaults] = useState([]);
  const [records, setRecords] = useState([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [faultToUpdate, setFaultToUpdate] = useState(null);
  const [maintenanceDialog, setMaintenanceDialog] = useState({ open: false, record: null });
  const canWork = hasRole('admin', 'manager', 'technician');

  const load = useCallback(async () => {
    if (!machine) return;
    const [f, m] = await Promise.all([faultsApi.list({ machineId: machine.id }), maintenanceApi.list({ machineId: machine.id })]);
    setFaults(f);
    setRecords(m);
  }, [machine]);

  useEffect(() => {
    setTab(0);
    load().catch(() => {});
  }, [load]);

  const changed = () => {
    load();
    onChanged();
  };

  if (!machine) return null;
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {machine.name} <span className="cell-sub">({machine.code})</span> <StatusChip value={machine.status} />
      </DialogTitle>
      <DialogContent>
        <div className="detail-grid">
          <div><b>Type:</b> {labelFor('machineTypeId', machine.machineTypeId)}</div>
          <div><b>Section:</b> {labelFor('mainSectionId', machine.mainSectionId)}{machine.subSectionId ? ` / ${labelFor('subSectionId', machine.subSectionId)}` : ''}</div>
          <div><b>Plant department:</b> {labelFor('plantDepartmentId', machine.plantDepartmentId)}</div>
          <div><b>SAP resource:</b> {machine.sapResource || '—'}</div>
          <div><b>Manufacturer / model:</b> {[machine.manufacturer, machine.modelNumber].filter(Boolean).join(' ') || '—'}</div>
          <div><b>Serial number:</b> {machine.serialNumber || '—'}</div>
          <div><b>Year / installed:</b> {machine.manufactureYear || '—'} / {machine.installDate || '—'}</div>
        </div>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="inherit" sx={{ mt: 2 }}
          TabIndicatorProps={{ style: { backgroundColor: '#be171d' } }}>
          <Tab label={`Faults (${faults.length})`} />
          <Tab label={`Maintenance (${records.length})`} />
        </Tabs>
        {tab === 0 && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ mb: 1 }}><Button size="small" variant="contained" color="error" onClick={() => setReportOpen(true)}>Report Fault</Button></Box>
            <Table size="small">
              <TableHead><TableRow><TableCell>#</TableCell><TableCell>Priority</TableCell><TableCell>Status</TableCell><TableCell>Description</TableCell><TableCell>Reported</TableCell>{canWork && <TableCell />}</TableRow></TableHead>
              <TableBody>
                {faults.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{f.id}</TableCell>
                    <TableCell><StatusChip value={f.priority} /></TableCell>
                    <TableCell><StatusChip value={f.status} /></TableCell>
                    <TableCell>{f.description}{f.resolutionNotes && <div className="cell-sub">Resolution: {f.resolutionNotes}</div>}</TableCell>
                    <TableCell>{f.reportedByName}<div className="cell-sub">{formatDateTime(f.reportedAt)}</div></TableCell>
                    {canWork && <TableCell><Button size="small" onClick={() => setFaultToUpdate(f)}>Update</Button></TableCell>}
                  </TableRow>
                ))}
                {faults.length === 0 && <TableRow><TableCell colSpan={6} align="center" className="empty-cell">No faults reported for this machine.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ mt: 1 }}>
            {canWork && (
              <Box sx={{ mb: 1 }}>
                <Button size="small" variant="contained" color="error"
                  onClick={() => setMaintenanceDialog({ open: true, record: null })}>Schedule Maintenance</Button>
              </Box>
            )}
            <Table size="small">
              <TableHead><TableRow><TableCell>#</TableCell><TableCell>Date</TableCell><TableCell>Type</TableCell><TableCell>Status</TableCell><TableCell>Work</TableCell><TableCell>Technician</TableCell>{canWork && <TableCell />}</TableRow></TableHead>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.scheduledDate}</TableCell>
                    <TableCell>{r.maintenanceType}</TableCell>
                    <TableCell><StatusChip value={r.status} /></TableCell>
                    <TableCell>{r.description}{r.notes && <div className="cell-sub">{r.notes}</div>}</TableCell>
                    <TableCell>{r.technicianName || '—'}</TableCell>
                    {canWork && <TableCell><Button size="small" onClick={() => setMaintenanceDialog({ open: true, record: r })}>Update</Button></TableCell>}
                  </TableRow>
                ))}
                {records.length === 0 && <TableRow><TableCell colSpan={7} align="center" className="empty-cell">No maintenance recorded for this machine.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Box>
        )}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>

      <ReportFaultDialog open={reportOpen} machine={machine} onClose={() => setReportOpen(false)} onSaved={changed} />
      <FaultStatusDialog fault={faultToUpdate} onClose={() => setFaultToUpdate(null)} onSaved={changed} />
      <MaintenanceDialog open={maintenanceDialog.open} record={maintenanceDialog.record} machine={machine}
        onClose={() => setMaintenanceDialog({ open: false, record: null })} onSaved={changed} />
    </Dialog>
  );
};

const MachineTable = () => {
  const canEdit = hasRole('admin', 'manager');
  const canDelete = hasRole('admin');
  const { options, labelFor, reload: reloadRefs } = useReferences(REF_FIELDS);

  const [machines, setMachines] = useState([]);
  const [openFaults, setOpenFaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialog, setDialog] = useState({ open: false, editing: null });
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [detailId, setDetailId] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const [m, f] = await Promise.all([machinesApi.list(), faultsApi.list()]);
      setMachines(m);
      setOpenFaults(f.filter((x) => x.status !== 'Resolved'));
      setLoadError('');
    } catch (e) {
      setLoadError(errorMessage(e, 'Could not load machines'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCount = (id) => openFaults.filter((f) => f.machineId === id).length;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return machines.filter((m) =>
      (!statusFilter || m.status === statusFilter) &&
      (!term || [m.name, m.code, m.sapResource, m.serialNumber, labelFor('machineTypeId', m.machineTypeId)]
        .some((v) => (v || '').toLowerCase().includes(term)))
    );
  }, [machines, search, statusFilter, labelFor]);

  const openAdd = () => {
    reloadRefs();
    setForm(EMPTY);
    setFormError('');
    setDialog({ open: true, editing: null });
  };

  const openEdit = (m) => {
    reloadRefs();
    setForm(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, m[k] ?? ''])));
    setFormError('');
    setDialog({ open: true, editing: m });
  };

  const save = async () => {
    if (!form.name.trim() || !form.code.trim()) return setFormError('Name and code are required');
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v]));
    if (payload.manufactureYear) payload.manufactureYear = Number(payload.manufactureYear);
    try {
      if (dialog.editing) {
        const saved = await machinesApi.update(dialog.editing.id, payload);
        setMachines((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
        setToast({ severity: 'success', message: 'Machine updated' });
      } else {
        const created = await machinesApi.create(payload);
        setMachines((prev) => [...prev, created]);
        setToast({ severity: 'success', message: 'Machine added' });
      }
      setDialog({ open: false, editing: null });
    } catch (e) {
      setFormError(errorMessage(e, 'Could not save the machine'));
    }
  };

  const remove = async (m) => {
    const faults = openFaults.filter((f) => f.machineId === m.id).length;
    if (!window.confirm(`Delete ${m.name} (${m.code})? Its fault reports and maintenance history will also be deleted.${faults ? ` It has ${faults} open fault(s).` : ''}`)) return;
    try {
      await machinesApi.remove(m.id);
      setMachines((prev) => prev.filter((x) => x.id !== m.id));
      setToast({ severity: 'success', message: 'Machine deleted' });
    } catch (e) {
      setToast({ severity: 'error', message: errorMessage(e, 'Could not delete') });
    }
  };

  const exportPdf = () => downloadTablePdf({
    title: 'Machines',
    filterText: [search.trim(), statusFilter].filter(Boolean).join(', '),
    rows: filtered,
    columns: [
      { header: 'Code', value: (m) => m.code },
      { header: 'Name', value: (m) => m.name },
      { header: 'Type', value: (m) => labelFor('machineTypeId', m.machineTypeId) },
      { header: 'Section', value: (m) => labelFor('mainSectionId', m.mainSectionId) },
      { header: 'Plant department', value: (m) => labelFor('plantDepartmentId', m.plantDepartmentId) },
      { header: 'SAP resource', value: (m) => m.sapResource },
      { header: 'Status', value: (m) => m.status },
      { header: 'Open faults', value: (m) => openCount(m.id) },
    ],
  });

  const field = (name, label, props = {}) => (
    <TextField key={name} label={label} fullWidth margin="dense" value={form[name] ?? ''}
      onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))} {...props} />
  );
  const refSelect = (name, label) => (
    <TextField key={name} select label={label} fullWidth margin="dense"
      value={(options[name] || []).some((o) => o.value === form[name]) ? form[name] : ''}
      onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}>
      <MenuItem value="">— None —</MenuItem>
      {(options[name] || []).map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
    </TextField>
  );

  const detailMachine = machines.find((m) => m.id === detailId) || null;

  return (
    <div className="table-main-content">
      <h2 className="page-title">Machines</h2>
      <div className="table-toolbar">
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <TextField size="small" label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="table-search" />
          <TextField size="small" select label="Status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} sx={{ minWidth: 170 }}>
            <MenuItem value="">All statuses</MenuItem>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="error" startIcon={<PictureAsPdfIcon />} onClick={exportPdf} disabled={!filtered.length}>Export PDF</Button>
          {canEdit && <Button variant="contained" color="error" onClick={openAdd}>Add Machine</Button>}
        </Box>
      </div>

      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell>Section</TableCell>
            <TableCell>SAP Resource</TableCell><TableCell>Status</TableCell><TableCell>Open faults</TableCell><TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.code}</TableCell>
              <TableCell>{m.name}</TableCell>
              <TableCell>{labelFor('machineTypeId', m.machineTypeId)}</TableCell>
              <TableCell>{labelFor('mainSectionId', m.mainSectionId)}</TableCell>
              <TableCell>{m.sapResource || '—'}</TableCell>
              <TableCell><StatusChip value={m.status} /></TableCell>
              <TableCell>{openCount(m.id)}</TableCell>
              <TableCell>
                <Box display="flex">
                  <Tooltip title="Details, faults & maintenance"><IconButton style={{ color: '#be171d' }} onClick={() => setDetailId(m.id)} aria-label={`View ${m.name}`}><VisibilityIcon /></IconButton></Tooltip>
                  {canEdit && <Tooltip title="Edit"><IconButton style={{ color: '#be171d' }} onClick={() => openEdit(m)} aria-label={`Edit ${m.name}`}><EditIcon /></IconButton></Tooltip>}
                  {canDelete && <Tooltip title="Delete"><IconButton style={{ color: '#be171d' }} onClick={() => remove(m)} aria-label={`Delete ${m.name}`}><DeleteIcon /></IconButton></Tooltip>}
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {!loading && filtered.length === 0 && (
            <TableRow><TableCell colSpan={8} align="center" className="empty-cell">
              {machines.length === 0 ? `No machines registered yet.${canEdit ? ' Use "Add Machine" to register one.' : ''}` : 'No machines match the filter.'}
            </TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filtered.length} rowsPerPage={rowsPerPage} page={page}
        onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, editing: null })} fullWidth maxWidth="sm">
        <DialogTitle>{dialog.editing ? `Edit ${dialog.editing.name}` : 'Add Machine'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 1 }}>{formError}</Alert>}
          {field('name', 'Machine name', { required: true })}
          {field('code', 'Machine code', { required: true, helperText: 'Unique, e.g. KN-01' })}
          {refSelect('machineTypeId', 'Machine type')}
          {refSelect('mainSectionId', 'Main section')}
          {refSelect('subSectionId', 'Sub section')}
          {refSelect('plantDepartmentId', 'Plant department')}
          {field('sapResource', 'SAP resource')}
          {field('manufacturer', 'Manufacturer')}
          {field('modelNumber', 'Model number')}
          {field('serialNumber', 'Serial number')}
          {field('manufactureYear', 'Manufacture year', { type: 'number' })}
          {field('installDate', 'Install date', { type: 'date', InputLabelProps: { shrink: true } })}
          <TextField select label="Status" fullWidth margin="dense" value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, editing: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={save}>{dialog.editing ? 'Save Changes' : 'Add Machine'}</Button>
        </DialogActions>
      </Dialog>

      <MachineDetail machine={detailMachine} labelFor={labelFor} onClose={() => setDetailId(null)} onChanged={load} />

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </div>
  );
};

export default MachineTable;
