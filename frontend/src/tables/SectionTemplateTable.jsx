import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'section-templates',
  title: 'Section Templates',
  singular: 'Section Template',
  fields: [
    { name: 'mainSectionId', label: 'Main Section', required: true },
    { name: 'subSectionId', label: 'Sub Section' },
    { name: 'machineTypeId', label: 'Machine Type', required: true },
    { name: 'parameterId', label: 'Parameter', required: true },
    { name: 'toleranceId', label: 'Tolerance' },
    { name: 'shortName', label: 'Parameter Short Name' },
    { name: 'threshold', label: 'Threshold', type: 'number' },
    { name: 'equation', label: 'Equation' },
    { name: 'sortNumber', label: 'Sort Number', type: 'number' },
    { name: 'plantDepartmentId', label: 'Plant Department' },
  ],
};

const SectionTemplateTable = () => <MasterDataTable config={config} />;

export default SectionTemplateTable;
