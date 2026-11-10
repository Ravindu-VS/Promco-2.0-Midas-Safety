import React, { useEffect, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { faultsApi } from '../../services/api';
import { errorMessage } from '../../services/authService';

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

/** Report a fault. Pass `machine` to fix the machine, or `machines` to let the user pick one. */
const ReportFaultDialog = ({ open, onClose, onSaved, machine, machines = [] }) => {
  const [machineId, setMachineId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMachineId(machine?.id ?? '');
      setPriority('Medium');
      setDescription('');
      setError('');
    }
  }, [open, machine]);

  const submit = async () => {
    if (!machineId) return setError('Choose the machine');
    if (description.trim().length < 5) return setError('Please describe the fault (at least 5 characters)');
    setSaving(true);
    try {
      const fault = await faultsApi.report(machineId, { priority, description });
      onSaved(fault);
      onClose();
    } catch (e) {
      setError(errorMessage(e, 'Could not report the fault'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Report a fault{machine ? ` – ${machine.name}` : ''}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
        {!machine && (
          <TextField select label="Machine" required fullWidth margin="dense" value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            helperText={machines.length === 0 ? 'No machines registered yet' : ' '}>
            {machines.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name} ({m.code})</MenuItem>
            ))}
          </TextField>
        )}
        <TextField select label="Priority" fullWidth margin="dense" value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
        <TextField label="What is wrong?" required fullWidth margin="dense" multiline minRows={3}
          value={description} onChange={(e) => setDescription(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={submit} disabled={saving}>
          {saving ? 'Sending…' : 'Report Fault'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportFaultDialog;
