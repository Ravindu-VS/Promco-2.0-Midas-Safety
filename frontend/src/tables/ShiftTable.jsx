import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'shifts',
  title: 'Shifts',
  singular: 'Shift',
  fields: [
    { name: 'name', label: 'Shift', required: true },
    { name: 'startTime', label: 'Start Time', type: 'time', required: true },
    { name: 'endTime', label: 'End Time', type: 'time', required: true },
    { name: 'plantDepartmentId', label: 'Plant Department' },
  ],
};

const ShiftTable = () => <MasterDataTable config={config} />;

export default ShiftTable;
