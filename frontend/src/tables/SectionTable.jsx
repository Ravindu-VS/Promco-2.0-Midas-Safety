import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'sections',
  title: 'Sections',
  singular: 'Section',
  fields: [
    { name: 'mainSectionId', label: 'Main Section', required: true },
    { name: 'subSectionId', label: 'Sub Section' },
    { name: 'machineTypeId', label: 'Machine Type', required: true },
    { name: 'parameterId', label: 'Parameter (toleranced)', required: true },
    { name: 'shortName', label: 'Parameter Short Name' },
    { name: 'threshold', label: 'Threshold', type: 'number' },
    { name: 'equation', label: 'Equation' },
    { name: 'sortNumber', label: 'Sort Number', type: 'number' },
    { name: 'plantDepartmentId', label: 'Plant Department' },
  ],
};

const SectionTable = () => <MasterDataTable config={config} />;

export default SectionTable;
