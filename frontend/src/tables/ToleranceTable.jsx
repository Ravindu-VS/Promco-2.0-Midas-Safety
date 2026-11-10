import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'tolerances',
  title: 'Tolerances',
  singular: 'Tolerance',
  fields: [
    { name: 'name', label: 'Name', required: true },
    { name: 'type', label: 'Type (e.g. Absolute, Percentage)', required: true },
    { name: 'plantDepartmentId', label: 'Plant Department' },
  ],
};

const ToleranceTable = () => <MasterDataTable config={config} />;

export default ToleranceTable;
