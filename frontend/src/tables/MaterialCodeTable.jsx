import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'material-codes',
  title: 'Material Codes',
  singular: 'Material Code',
  fields: [
    { name: 'code', label: 'Material Code', required: true },
    { name: 'description', label: 'Description' },
    { name: 'plantDepartmentId', label: 'Plant Department' },
  ],
};

const MaterialCodeTable = () => <MasterDataTable config={config} />;

export default MaterialCodeTable;
