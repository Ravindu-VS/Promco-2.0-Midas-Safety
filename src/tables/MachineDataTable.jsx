import React, { useState, useEffect } from 'react';
import './MachineDataTable.css'; // Import the CSS file

const MachineDataTable = () => {
    const [machineData, setMachineData] = useState([
        { machine: 'M1', amount: 100, errors: 2 },
        { machine: 'M2', amount: 200, errors: 1 },
        { machine: 'M3', amount: 150, errors: 3 },
        { machine: 'M4', amount: 250, errors: 0 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedData = machineData.map((data) => ({
                ...data,
                amount: data.amount + Math.floor(Math.random() * 50),
                errors: Math.floor(Math.random() * 5),
            }));

            setMachineData(updatedData);
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, [machineData]);

    return (
        <div className="machine-data-table-container">
            <table className="machine-data-table">
                <thead>
                    <tr>
                        <th className="header">Machine</th>
                        <th className="header">Amount</th>
                        <th className="header">Errors</th>
                    </tr>
                </thead>
                <tbody>
                    {machineData.map((row, index) => (
                        <tr key={index}>
                            <td className="cell">{row.machine}</td>
                            <td className="cell">{row.amount}</td>
                            <td className="cell">{row.errors}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MachineDataTable;
