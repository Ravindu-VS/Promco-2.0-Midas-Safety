import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'plant-dept-users',
  title: 'Plant Department Users',
  singular: 'Assignment',
  fields: [
    { name: 'userId', label: 'User', required: true },
    { name: 'plantDepartmentId', label: 'Plant Department', required: true },
  ],
};

const PlantDeptAbpUserTable = () => <MasterDataTable config={config} />;

export default PlantDeptAbpUserTable;
