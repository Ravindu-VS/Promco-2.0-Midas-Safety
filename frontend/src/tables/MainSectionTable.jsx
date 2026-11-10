import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'main-sections',
  title: 'Main Sections',
  singular: 'Main Section',
  fields: [
    { name: 'name', label: 'Main Section', required: true },
    { name: 'description', label: 'Description', multiline: true },
    { name: 'plantDepartmentId', label: 'Plant Department' },
  ],
};

const MainSectionTable = () => <MasterDataTable config={config} />;

export default MainSectionTable;
