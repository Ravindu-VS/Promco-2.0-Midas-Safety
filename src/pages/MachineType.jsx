import React from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar
import Topbar from '../components/Topbar'; // Import Topbar
import MachineTable from '../components/MachineTable'; // Import the MachineTable component

const MachineType = () => {
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex-grow">
                {/* Topbar */}
                <Topbar />

                {/* Main Content */}
                <div className="home-content p-6" style={{ paddingTop: '3rem', paddingLeft: '16rem' }}>
                  
                        <MachineTable />
                    
                </div>
            </div>
        </div>
    );
};

export default MachineType;
