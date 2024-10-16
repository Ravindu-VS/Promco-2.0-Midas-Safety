import React from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar
import Topbar from '../components/Topbar'; // Import Topbar
import ParameterTable from '../components/ParameterTable';

const Parameter = () => {
    return (
      <div className="machine flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow">
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <div className="machine-content p-6" style={{ paddingTop: '3rem', paddingLeft: '16rem' }}>
          < ParameterTable/>
        </div>
      </div>
    </div>
    );
};

export default Parameter;
