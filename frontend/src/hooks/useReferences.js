import { useCallback, useEffect, useState } from 'react';
import { masterDataApi, usersApi } from '../services/api';

// Where each reference field gets its options from, and how a record is labelled.
export const REFERENCE_SOURCES = {
  plantDepartmentId: {
    load: () => masterDataApi.list('plant-departments'),
    label: (r) => `${r.plantName} – ${r.departmentName}`,
  },
  machineTypeId: { load: () => masterDataApi.list('machine-types'), label: (r) => r.name },
  mainSectionId: { load: () => masterDataApi.list('main-sections'), label: (r) => r.name },
  subSectionId: { load: () => masterDataApi.list('sub-sections'), label: (r) => r.name },
  materialCodeId: {
    load: () => masterDataApi.list('material-codes'),
    label: (r) => (r.description ? `${r.code} – ${r.description}` : r.code),
  },
  parameterId: {
    load: () => masterDataApi.list('parameters'),
    label: (r) => (r.unit ? `${r.name} (${r.unit})` : r.name),
  },
  toleranceId: { load: () => masterDataApi.list('tolerances'), label: (r) => r.name },
  userId: { load: () => usersApi.lookup(), label: (r) => `${r.username} (${r.role})` },
};

export const isReferenceField = (name) => Object.prototype.hasOwnProperty.call(REFERENCE_SOURCES, name);

/**
 * Loads the records behind the given reference fields.
 * Returns { options: { field: [{ value, label, record }] }, labelFor(field, id), reload, error }.
 */
export default function useReferences(fields) {
  const key = fields.join(',');
  const [options, setOptions] = useState({});
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    const wanted = key ? key.split(',') : [];
    try {
      const entries = await Promise.all(
        wanted.map(async (field) => {
          const source = REFERENCE_SOURCES[field];
          const records = await source.load();
          return [field, records.map((r) => ({ value: r.id, label: source.label(r), record: r }))];
        })
      );
      setOptions(Object.fromEntries(entries));
      setError(null);
    } catch (e) {
      setError(e);
    }
  }, [key]);

  useEffect(() => {
    reload();
  }, [reload]);

  const labelFor = useCallback(
    (field, id) => {
      if (id === null || id === undefined || id === '') return '—';
      const match = (options[field] || []).find((o) => o.value === id);
      return match ? match.label : `#${id} (missing)`;
    },
    [options]
  );

  return { options, labelFor, reload, error };
}
