import React, { useEffect, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { faultsApi } from '../../services/api';
import { errorMessage } from '../../services/authService';

const STATUSES = ['Open', 'In Progress', 'Resolved'];

const FaultStatusDialog = ({ fault, onClose, onSaved }) => {
  const [status, setStatus] = useState('Open');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (fault) {
      setStatus(fault.status === 'Open' ? 'In Progress' : fault.status);
      setNotes(fault.resolutionNotes || '');
      setError('');
    }
  }, [fault]);

  const submit = async () => {
    if (status === 'Resolved' && !notes.trim()) return setError('Describe how the fault was resolved');
    setSaving(true);
    try {
      onSaved(await faultsApi.setStatus(fault.id, { status, resolutionNotes: notes }));
      onClose();
    } catch (e) {
      setError(errorMessage(e, 'Could not update the fault'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!fault} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update fault #{fault?.id}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
        <p className="dialog-note">{fault?.description}</p>
        <TextField select label="Status" fullWidth margin="dense" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField label={status === 'Resolved' ? 'Resolution notes (required)' : 'Notes'} fullWidth margin="dense"
          multiline minRows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={submit} disabled={saving}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FaultStatusDialog;
