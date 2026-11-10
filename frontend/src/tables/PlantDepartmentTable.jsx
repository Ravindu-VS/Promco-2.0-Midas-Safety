import React from 'react';
import MasterDataTable from './MasterDataTable';

const config = {
  table: 'plant-departments',
  title: 'Plant Departments',
  singular: 'Plant Department',
  fields: [
    { name: 'plantCode', label: 'Plant Code' },
    { name: 'plantName', label: 'Plant Name', required: true },
    { name: 'departmentCode', label: 'Department Code' },
    { name: 'departmentName', label: 'Department Name', required: true },
  ],
};

const PlantDepartmentTable = () => <MasterDataTable config={config} />;

export default PlantDepartmentTable;
