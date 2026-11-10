import React, { useEffect, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { faultsApi, maintenanceApi, toLocalDateString, usersApi } from '../../services/api';
import { errorMessage } from '../../services/authService';

const TYPES = ['Preventive', 'Corrective', 'Inspection'];
const STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

/**
 * Schedule (record == null) or edit maintenance.
 * Pass `machine` to fix the machine, or `machines` to pick one when scheduling.
 */
const MaintenanceDialog = ({ open, onClose, onSaved, record, machine, machines = [] }) => {
  const [form, setForm] = useState({});
  const [technicians, setTechnicians] = useState([]);
  const [faults, setFaults] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    setForm(record
      ? {
          machineId: record.machineId, maintenanceType: record.maintenanceType, description: record.description,
          scheduledDate: record.scheduledDate, technicianId: record.technicianId ?? '', faultId: record.faultId ?? '',
          status: record.status, notes: record.notes || '',
        }
      : {
          machineId: machine?.id ?? '', maintenanceType: 'Preventive', description: '',
          scheduledDate: toLocalDateString(new Date()), technicianId: '', faultId: '', status: 'Scheduled', notes: '',
        });
    usersApi.lookup().then((users) => setTechnicians(users.filter((u) => u.role === 'technician'))).catch(() => setTechnicians([]));
  }, [open, record, machine]);

  useEffect(() => {
    if (!open || !form.machineId) {
      setFaults([]);
      return;
    }
    faultsApi.list({ machineId: form.machineId })
      .then((list) => setFaults(list.filter((f) => f.status !== 'Resolved' || f.id === form.faultId)))
      .catch(() => setFaults([]));
  }, [open, form.machineId, form.faultId]);

  const set = (name) => (e) => setForm((prev) => ({ ...prev, [name]: e.target.value }));

  const submit = async () => {
    if (!form.machineId) return setError('Choose the machine');
    if (!form.description?.trim()) return setError('Describe the work to be done');
    if (!form.scheduledDate) return setError('Choose a date');
    const payload = {
      maintenanceType: form.maintenanceType,
      description: form.description,
      scheduledDate: form.scheduledDate,
      technicianId: form.technicianId === '' ? 0 : form.technicianId,
      faultId: form.faultId === '' ? 0 : form.faultId,
      notes: form.notes,
    };
    setSaving(true);
    try {
      const saved = record
        ? await maintenanceApi.update(record.id, { ...payload, status: form.status })
        : await maintenanceApi.schedule(form.machineId, payload);
      onSaved(saved);
      onClose();
    } catch (e) {
      setError(errorMessage(e, 'Could not save maintenance'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{record ? `Maintenance #${record.id}` : `Schedule maintenance${machine ? ` – ${machine.name}` : ''}`}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
        {!machine && !record && (
          <TextField select label="Machine" required fullWidth margin="dense" onChange={set('machineId')}
            value={machines.some((m) => m.id === form.machineId) ? form.machineId : ''}>
            {machines.map((m) => <MenuItem key={m.id} value={m.id}>{m.name} ({m.code})</MenuItem>)}
          </TextField>
        )}
        <TextField select label="Type" fullWidth margin="dense" value={form.maintenanceType ?? ''} onChange={set('maintenanceType')}>
          {TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField label="Work to be done" required fullWidth margin="dense" multiline minRows={2}
          value={form.description ?? ''} onChange={set('description')} />
        <TextField label="Date" type="date" required fullWidth margin="dense" InputLabelProps={{ shrink: true }}
          value={form.scheduledDate ?? ''} onChange={set('scheduledDate')} />
        <TextField select label="Technician" fullWidth margin="dense" onChange={set('technicianId')}
          value={technicians.some((t) => t.id === form.technicianId) ? form.technicianId : ''}
          helperText={technicians.length === 0 ? 'No users with the technician role yet' : ' '}>
          <MenuItem value="">— Unassigned —</MenuItem>
          {technicians.map((t) => <MenuItem key={t.id} value={t.id}>{t.username}</MenuItem>)}
        </TextField>
        <TextField select label="Related fault" fullWidth margin="dense" onChange={set('faultId')}
          value={faults.some((f) => f.id === form.faultId) ? form.faultId : ''}>
          <MenuItem value="">— None —</MenuItem>
          {faults.map((f) => <MenuItem key={f.id} value={f.id}>#{f.id} {f.priority}: {f.description.slice(0, 60)}</MenuItem>)}
        </TextField>
        {record && (
          <TextField select label="Status" fullWidth margin="dense" value={form.status ?? ''} onChange={set('status')}>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        )}
        <TextField label="Notes" fullWidth margin="dense" multiline minRows={2} value={form.notes ?? ''} onChange={set('notes')} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={submit} disabled={saving}>
          {record ? 'Save' : 'Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaintenanceDialog;
