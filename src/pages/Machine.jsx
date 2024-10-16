import React from "react";
import MachineTable from "../components/MachineTable";
import Sidebar from '../components/Sidebar'; // Import Sidebar
import Topbar from '../components/Topbar'; // Import Topbar

const Machine = () => {
  return (
    <div className="machine flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow">
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <div className="machine-content p-6" style={{ paddingTop: '3rem', paddingLeft: '16rem' }}>
          <MachineTable />
        </div>
      </div>
    </div>
  );
};

export default Machine;
