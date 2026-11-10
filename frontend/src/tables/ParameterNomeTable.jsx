import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'parameter-norms',
  title: 'Parameter Norms',
  singular: 'Parameter Norm',
  fields: [
    { name: 'parameterId', label: 'Parameter', required: true },
    { name: 'plantDepartmentId', label: 'Plant Department' },
    { name: 'minValue', label: 'Min Value', type: 'number', required: true },
    { name: 'maxValue', label: 'Max Value', type: 'number', required: true },
    { name: 'effectiveFrom', label: 'Effective From', type: 'date' },
  ],
};

const ParameterNomeTable = () => <MasterDataTable config={config} />;

export default ParameterNomeTable;
