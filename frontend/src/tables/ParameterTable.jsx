import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'parameters',
  title: 'Parameters',
  singular: 'Parameter',
  fields: [
    { name: 'name', label: 'Parameter', required: true },
    { name: 'shortName', label: 'Short Name' },
    { name: 'unit', label: 'Unit (e.g. °C, m/min)' },
    { name: 'description', label: 'Description', multiline: true },
    { name: 'plantDepartmentId', label: 'Plant Department' },
  ],
};

const ParameterTable = () => <MasterDataTable config={config} />;

export default ParameterTable;
