import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'parameter-qualified-values',
  title: 'Parameter Qualified Values',
  singular: 'Qualified Value',
  fields: [
    { name: 'parameterId', label: 'Parameter', required: true },
    { name: 'materialCodeId', label: 'Material Code', required: true },
    { name: 'plantDepartmentId', label: 'Plant Department' },
    { name: 'minValue', label: 'Min Value', type: 'number', required: true },
    { name: 'targetValue', label: 'Target Value', type: 'number', required: true },
    { name: 'maxValue', label: 'Max Value', type: 'number', required: true },
  ],
};

const ParameterQualifiedValueTable = () => <MasterDataTable config={config} />;

export default ParameterQualifiedValueTable;
