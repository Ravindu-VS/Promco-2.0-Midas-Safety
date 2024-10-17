import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
import Topbar from "../components/Topbar"; // Import the Topbar component
import CalendarComponent from "../components/CalendarComponent";
import MachineDataTable from "../components/MachineDataTable";
import './Dashboard.css'; // Import Dashboard styles

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", email: "", role: "" });

  // Fetch user data from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="dashboard-main-content">
      {/* Topbar */}
      <Topbar show={true} />
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Section with Background Image */}
        <div className="welcome-section">
        </div>

        {/* Dashboard Flex Section */}
        <div className="dashboard-section">
          <div className="dashboard-card">
            <h3 className="card-title">Latest Updates</h3>
            <MachineDataTable />
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Calendar</h3>
            <CalendarComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
