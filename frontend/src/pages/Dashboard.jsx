import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import CalendarComponent from "../components/CalendarComponent";
import StatusChip from "../components/operations/StatusChip";
import { activityApi, faultsApi, formatDateTime, machinesApi, maintenanceApi, messagesApi, reportsApi, toLocalDateString } from "../services/api";
import { errorMessage, getCurrentUser } from "../services/authService";
import { downloadDailyReportPdf } from "../utils/pdfLazy";
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const STATUS_COLORS = {
  Operational: '#2e7d32',
  'Under Maintenance': '#ed6c02',
  Faulty: '#be171d',
  Inactive: '#9e9e9e',
};

const Dashboard = () => {
  const user = getCurrentUser() || {};
  const isAdmin = user.role === 'admin';
  const seesEveryone = ['admin', 'manager'].includes(user.role);

  const [machines, setMachines] = useState([]);
  const [openFaults, setOpenFaults] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [activity, setActivity] = useState([]);
  const [openMessages, setOpenMessages] = useState(0);
  const [loadError, setLoadError] = useState('');

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [message, setMessage] = useState('');
  const [messageStatus, setMessageStatus] = useState(null);

  const loadOverview = useCallback(async () => {
    try {
      const today = toLocalDateString(new Date());
      const [m, f, maint, act, msgs] = await Promise.all([
        machinesApi.list(),
        faultsApi.list(),
        maintenanceApi.list(),
        activityApi.list({ date: today, limit: 8 }),
        messagesApi.list(),
      ]);
      setMachines(m);
      setOpenFaults(f.filter((x) => x.status !== 'Resolved'));
      setUpcoming(
        maint
          .filter((r) => ['Scheduled', 'In Progress'].includes(r.status))
          .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
          .slice(0, 5)
      );
      setActivity(act);
      setOpenMessages(msgs.filter((x) => x.status !== 'Resolved').length);
      setLoadError('');
    } catch (e) {
      setLoadError(errorMessage(e, 'Could not load the dashboard'));
    }
  }, []);

  const loadReport = useCallback(async (date) => {
    setReportLoading(true);
    setReportError('');
    try {
      setReport(await reportsApi.daily(toLocalDateString(date)));
    } catch (e) {
      setReport(null);
      setReportError(errorMessage(e, 'Could not load the report'));
    } finally {
      setReportLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
    loadReport(new Date());
  }, [loadOverview, loadReport]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    loadReport(date);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Fetch fresh data so the PDF reflects the moment it is generated
      const fresh = await reportsApi.daily(toLocalDateString(selectedDate));
      setReport(fresh);
      await downloadDailyReportPdf(fresh);
    } catch (e) {
      setReportError(errorMessage(e, 'Could not generate the PDF'));
    } finally {
      setDownloading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setMessageStatus({ severity: 'error', text: 'Please write a message before sending.' });
      return;
    }
    try {
      await messagesApi.send({ body: message });
      setMessage('');
      setMessageStatus({ severity: 'success', text: 'Sent. The admins have been notified – replies appear in Messages.' });
    } catch (err) {
      setMessageStatus({ severity: 'error', text: errorMessage(err, 'Could not send the message') });
    }
  };

  const statusCounts = Object.keys(STATUS_COLORS).map((s) => machines.filter((m) => m.status === s).length);
  const machineName = (id) => machines.find((m) => m.id === id)?.name || `#${id}`;
  const s = report?.summary;

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-content">
        <div
          className="welcome-section"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/welcome.png)` }}
          role="img"
          aria-label={`Welcome, ${user.username || ''}`}
        />

        {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

        <div className="dashboard-section">
          {/* Machines */}
          <div className="dashboard-card">
            <h3 className="card-title">Machines</h3>
            {machines.length === 0 ? (
              <p className="card-empty">
                No machines registered yet. <Link to="/machine" className="card-link">Go to Machines</Link>
              </p>
            ) : (
              <>
                <div className="chart-box">
                  <Doughnut
                    data={{
                      labels: Object.keys(STATUS_COLORS),
                      datasets: [{ data: statusCounts, backgroundColor: Object.values(STATUS_COLORS), borderWidth: 0 }],
                    }}
                    options={{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }, maintainAspectRatio: false }}
                  />
                </div>
                <p className="card-footnote">{machines.length} machine(s) registered · <Link to="/machine" className="card-link">View all</Link></p>
              </>
            )}
          </div>

          {/* Open faults */}
          <div className="dashboard-card">
            <h3 className="card-title">Open Faults <span className="card-count">{openFaults.length}</span></h3>
            {openFaults.length === 0 ? (
              <p className="card-empty">No open fault reports.</p>
            ) : (
              <ul className="card-list">
                {openFaults.slice(0, 5).map((f) => (
                  <li key={f.id}>
                    <StatusChip value={f.priority} /> <b>{machineName(f.machineId)}</b>: {f.description}
                    <div className="card-meta">{f.status} · reported by {f.reportedByName}, {formatDateTime(f.reportedAt)}</div>
                  </li>
                ))}
              </ul>
            )}
            <p className="card-footnote"><Link to="/faults" className="card-link">All fault reports</Link></p>
          </div>

          {/* Upcoming maintenance */}
          <div className="dashboard-card">
            <h3 className="card-title">Upcoming Maintenance</h3>
            {upcoming.length === 0 ? (
              <p className="card-empty">Nothing scheduled.</p>
            ) : (
              <ul className="card-list">
                {upcoming.map((r) => (
                  <li key={r.id}>
                    <b>{r.scheduledDate}</b> · {machineName(r.machineId)} – {r.maintenanceType}
                    <div className="card-meta">{r.status}{r.technicianName ? ` · ${r.technicianName}` : ' · unassigned'}</div>
                  </li>
                ))}
              </ul>
            )}
            <p className="card-footnote"><Link to="/maintenance" className="card-link">All maintenance</Link></p>
          </div>

          {/* Daily report */}
          <div className="dashboard-card report-card">
            <h3 className="card-title">Daily Report</h3>
            <CalendarComponent onDateSelect={handleDateSelect} />
            {reportError && <Alert severity="error" sx={{ mt: 1 }}>{reportError}</Alert>}
            {reportLoading && <p className="card-empty">Loading…</p>}
            {s && !reportLoading && (
              <table className="report-summary">
                <tbody>
                  <tr><td>Faults reported</td><td>{s.faultsReported}</td></tr>
                  <tr><td>Faults resolved</td><td>{s.faultsResolved}</td></tr>
                  <tr><td>Maintenance scheduled</td><td>{s.maintenanceScheduled}</td></tr>
                  <tr><td>Maintenance completed</td><td>{s.maintenanceCompleted}</td></tr>
                  <tr><td>Recorded actions ({report.activityScope})</td><td>{s.activityCount}</td></tr>
                </tbody>
              </table>
            )}
            <button className="red-button" onClick={handleDownload} disabled={downloading || reportLoading}>
              {downloading ? 'Generating…' : 'Download PDF Report'}
            </button>
          </div>

          {/* Activity */}
          <div className="dashboard-card">
            <h3 className="card-title">{seesEveryone ? "Today's Activity" : 'Your Activity Today'}</h3>
            {activity.length === 0 ? (
              <p className="card-empty">No activity recorded today.</p>
            ) : (
              <ul className="card-list">
                {activity.map((a) => (
                  <li key={a.id}>
                    {a.summary}
                    <div className="card-meta">{seesEveryone ? `${a.username} · ` : ''}{new Date(a.timestamp).toLocaleTimeString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Messages */}
          <div className="dashboard-card">
            {isAdmin ? (
              <>
                <h3 className="card-title">Messages <span className="card-count">{openMessages}</span></h3>
                <p className="card-empty">
                  {openMessages === 0 ? 'No unanswered messages.' : `${openMessages} message(s) waiting for a reply.`}
                </p>
                <p className="card-footnote"><Link to="/messages" className="card-link">Open inbox</Link></p>
              </>
            ) : (
              <>
                <h3 className="card-title">Contact Admin</h3>
                <form onSubmit={sendMessage}>
                  <textarea
                    className="admin-message-input"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setMessageStatus(null);
                    }}
                    placeholder="Write your message here..."
                    rows="4"
                    maxLength={2000}
                  />
                  <button type="submit" className="red-button" style={{ marginTop: "10px" }}>Send Message</button>
                </form>
                {messageStatus && <Alert severity={messageStatus.severity} sx={{ mt: 1 }}>{messageStatus.text}</Alert>}
                <p className="card-footnote">
                  {openMessages > 0 ? `${openMessages} awaiting a reply · ` : ''}<Link to="/messages" className="card-link">Your messages</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
