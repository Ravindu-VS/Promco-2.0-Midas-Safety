import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CalendarComponent from "../components/CalendarComponent";
import MachineDataTable from "../tables/MachineDataTable";
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [selectedDate, setSelectedDate] = useState(null);
  const [appUsageData, setAppUsageData] = useState([]);
  const [dailyWorkData, setDailyWorkData] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [adminMessage, setAdminMessage] = useState(""); // State for admin message

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Set today's date as the selected date
    const today = new Date();
    setSelectedDate(today);
    // Fetch data based on today's date
    fetchAppUsageData(today);
    fetchDailyWorkData(today);
    generateReportData(today);
  }, []);

  // Handle date selection from the calendar
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Fetch data based on the selected date
    fetchAppUsageData(date);
    fetchDailyWorkData(date);
    generateReportData(date);
  };

  const fetchAppUsageData = (date) => {
    const usageData = [
      { timeSpent: "5 hours", date: date }
    ];
    setAppUsageData(usageData);
  };

  const fetchDailyWorkData = (date) => {
    const workData = [
      { task: "Updated Machine Data", date: date },
      { task: "Generated Report", date: date }
    ];
    setDailyWorkData(workData);
  };

  const generateReportData = (date) => {
    const report = `Report for ${date.toDateString()}`; // Format date to a readable string
    setReportData(report);
  };

  // Function to generate and download the report
  const handleGenerateReport = () => {
    if (!selectedDate) return; // Check if a date is selected

    const reportContent = `Report for ${selectedDate.toDateString()}\n\n` +
                          `App Usage: ${appUsageData.length > 0 ? appUsageData[0].timeSpent : "No Data"}\n` +
                          `Daily Work:\n` +
                          `${dailyWorkData.length > 0 ? dailyWorkData.map(work => `- ${work.task}`).join('\n') : "No Data"}`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report_${selectedDate.toISOString().split('T')[0]}.txt`; // Download filename
    link.click();
    URL.revokeObjectURL(link.href); // Clean up
  };

  // Handle admin message submission
  const handleAdminMessageSubmit = (e) => {
    e.preventDefault();
    if (adminMessage.trim() === "") {
      alert("Please write a message before sending.");
      return;
    }
    // Handle the message sending logic here (e.g., send to API)
    console.log("Message to admin:", adminMessage); // For demonstration purposes
    alert("Your message has been sent to the admin.");
    setAdminMessage(""); // Clear the message after sending
  };

  return (
    <div className="dashboard-main-content">
      {/* Topbar */}
      <Topbar show={true} />

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section"></div>

        {/* Dashboard Flex Section */}
        <div className="dashboard-section">

          {/* Calendar */}
          <div className="dashboard-card">
            <h3 className="card-title">Calendar</h3>
            <CalendarComponent onDateSelect={handleDateSelect} />
          </div>

          {/* Generate Report */}
          <div className="dashboard-card">
            <h3 className="card-title">Generated Report</h3>
            <p>{selectedDate ? reportData : "Select a date to generate the report."}</p>
            <button className="red-button" onClick={handleGenerateReport} disabled={!selectedDate}>
              Generate Report
            </button>
          </div>

          {/* Contact Admin */}
          {user.role !== "admin" && ( // Only show if the user is not an admin
            <div className="dashboard-card">
              <h3 className="card-title">Contact Admin</h3>
              <form onSubmit={handleAdminMessageSubmit}>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows="4"
                  required
                  style={{ width: "100%", resize: "none" }} // Custom styles
                />
                <button type="submit" style={{ marginTop: "10px" }}>Send Message</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
