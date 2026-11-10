import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'machine-types',
  title: 'Machine Types',
  singular: 'Machine Type',
  fields: [
    { name: 'name', label: 'Machine Type', required: true },
    { name: 'description', label: 'Description', multiline: true },
    { name: 'plantDepartmentId', label: 'Plant Department' },
  ],
};

const MachineTypeTable = () => <MasterDataTable config={config} />;

export default MachineTypeTable;
