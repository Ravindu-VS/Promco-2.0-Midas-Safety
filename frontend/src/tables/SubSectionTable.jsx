import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'sub-sections',
  title: 'Sub Sections',
  singular: 'Sub Section',
  fields: [
    { name: 'name', label: 'Sub Section', required: true },
    { name: 'mainSectionId', label: 'Main Section', required: true },
    { name: 'plantDepartmentId', label: 'Plant Department' },
  ],
};

const SubSectionTable = () => <MasterDataTable config={config} />;

export default SubSectionTable;
