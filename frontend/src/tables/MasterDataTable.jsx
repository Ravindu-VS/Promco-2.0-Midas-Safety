import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem,
  Snackbar, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { masterDataApi, formatDateTime } from '../services/api';
import { errorMessage, hasRole } from '../services/authService';
import useReferences, { isReferenceField } from '../hooks/useReferences';
import { downloadTablePdf } from '../utils/pdfLazy';
import './Table.css';

/**
 * Generic CRUD table for one master data table, persisted through /api/masterdata/{table}.
 * config: { table, title, singular, fields: [{ name, label, type?: 'text'|'number'|'time'|'date', required?, multiline? }] }
 * Fields whose name is a known reference (plantDepartmentId, parameterId, ...) become dropdowns.
 */
const MasterDataTable = ({ config }) => {
  const { table, title, singular, fields } = config;
  const canEdit = hasRole('admin', 'manager');

  const refFields = useMemo(() => fields.map((f) => f.name).filter(isReferenceField), [fields]);
  const { options, labelFor, reload: reloadRefs } = useReferences(refFields);

  const emptyForm = useMemo(() => Object.fromEntries(fields.map((f) => [f.name, ''])), [fields]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialog, setDialog] = useState({ open: false, editing: null });
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await masterDataApi.list(table));
      setLoadError('');
    } catch (e) {
      setLoadError(errorMessage(e, `Could not load ${title.toLowerCase()}`));
    } finally {
      setLoading(false);
    }
  }, [table, title]);

  useEffect(() => {
    load();
  }, [load]);

  const display = useCallback(
    (row, field) => {
      const value = row[field.name];
      if (isReferenceField(field.name)) return labelFor(field.name, value);
      if (value === null || value === undefined || value === '') return '—';
      return String(value);
    },
    [labelFor]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      fields.some((f) => display(row, f).toLowerCase().includes(term)) || String(row.id).includes(term)
    );
  }, [rows, search, fields, display]);

  const openAdd = () => {
    reloadRefs();
    setForm(emptyForm);
    setFormError('');
    setDialog({ open: true, editing: null });
  };

  const openEdit = (row) => {
    reloadRefs();
    setForm(Object.fromEntries(fields.map((f) => [f.name, row[f.name] ?? ''])));
    setFormError('');
    setDialog({ open: true, editing: row });
  };

  const closeDialog = () => setDialog({ open: false, editing: null });

  const handleSave = async () => {
    const missing = fields.find((f) => f.required && String(form[f.name] ?? '').trim() === '');
    if (missing) {
      setFormError(`${missing.label} is required`);
      return;
    }
    setSaving(true);
    try {
      if (dialog.editing) {
        const saved = await masterDataApi.update(table, dialog.editing.id, form);
        setRows((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
        setToast({ severity: 'success', message: `${singular} updated` });
      } else {
        const created = await masterDataApi.create(table, form);
        setRows((prev) => [...prev, created]);
        setToast({ severity: 'success', message: `${singular} added` });
      }
      closeDialog();
    } catch (e) {
      setFormError(errorMessage(e, 'Could not save'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete this ${singular.toLowerCase()} (#${row.id})? This cannot be undone.`)) return;
    try {
      await masterDataApi.remove(table, row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setToast({ severity: 'success', message: `${singular} deleted` });
    } catch (e) {
      setToast({ severity: 'error', message: errorMessage(e, 'Could not delete') });
    }
  };

  const exportPdf = () =>
    downloadTablePdf({
      title,
      filterText: search.trim(),
      rows: filtered,
      columns: [
        { header: 'ID', value: (r) => r.id },
        ...fields.map((f) => ({ header: f.label, value: (r) => display(r, f) })),
        { header: 'Created by', value: (r) => r.createdByName },
        { header: 'Last modified', value: (r) => formatDateTime(r.modifiedAt || r.createdAt) },
      ],
    });

  const renderInput = (field) => {
    const common = {
      label: field.label,
      required: !!field.required,
      fullWidth: true,
      margin: 'dense',
      value: form[field.name] ?? '',
      onChange: (e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value })),
    };
    if (isReferenceField(field.name)) {
      const opts = options[field.name] || [];
      return (
        <TextField key={field.name} {...common} select
          value={opts.some((o) => o.value === form[field.name]) ? form[field.name] : ''}
          helperText={opts.length === 0 ? 'No records yet – add them in the related table first' : ' '}>
          {!field.required && <MenuItem value="">— None —</MenuItem>}
          {opts.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
      );
    }
    return (
      <TextField
        key={field.name}
        {...common}
        type={field.type === 'number' ? 'number' : field.type || 'text'}
        multiline={!!field.multiline}
        minRows={field.multiline ? 2 : undefined}
        InputLabelProps={['time', 'date'].includes(field.type) ? { shrink: true } : undefined}
        inputProps={field.type === 'number' ? { step: 'any' } : undefined}
      />
    );
  };

  return (
    <div className="table-main-content">
      <h2 className="page-title">{title}</h2>

      <div className="table-toolbar">
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="table-search"
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="error" startIcon={<PictureAsPdfIcon />} onClick={exportPdf} disabled={!filtered.length}>
            Export PDF
          </Button>
          {canEdit && (
            <Button variant="contained" color="error" onClick={openAdd}>
              Add {singular}
            </Button>
          )}
        </Box>
      </div>

      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            {fields.map((f) => (
              <TableCell key={f.name}>{f.label}</TableCell>
            ))}
            <TableCell>Created by</TableCell>
            <TableCell>Last modified</TableCell>
            {canEdit && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              {fields.map((f) => (
                <TableCell key={f.name}>{display(row, f)}</TableCell>
              ))}
              <TableCell>{row.createdByName || '—'}</TableCell>
              <TableCell>
                {formatDateTime(row.modifiedAt || row.createdAt)}
                {row.modifiedByName && <div className="cell-sub">by {row.modifiedByName}</div>}
              </TableCell>
              {canEdit && (
                <TableCell>
                  <Box display="flex">
                    <Tooltip title="Edit">
                      <IconButton style={{ color: '#be171d' }} onClick={() => openEdit(row)} aria-label={`Edit ${singular} ${row.id}`}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton style={{ color: '#be171d' }} onClick={() => handleDelete(row)} aria-label={`Delete ${singular} ${row.id}`}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
          {!loading && filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={fields.length + 4} align="center" className="empty-cell">
                {rows.length === 0
                  ? `No ${title.toLowerCase()} yet.${canEdit ? ` Use "Add ${singular}" to create one.` : ''}`
                  : 'No records match your search.'}
              </TableCell>
            </TableRow>
          )}
          {loading && (
            <TableRow>
              <TableCell colSpan={fields.length + 4} align="center" className="empty-cell">Loading…</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={Math.min(page, Math.max(0, Math.ceil(filtered.length / rowsPerPage) - 1))}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <Dialog open={dialog.open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dialog.editing ? `Edit ${singular} #${dialog.editing.id}` : `Add ${singular}`}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 1 }}>{formError}</Alert>}
          {fields.map(renderInput)}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : dialog.editing ? 'Save Changes' : `Add ${singular}`}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </div>
  );
};

export default MasterDataTable;
