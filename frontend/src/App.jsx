import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import './styles/tailwind.css';
import ThemeToggleButton from './components/ThemeToggleButton';
import Login from './pages/Login';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MasterData from './pages/MasterData';
import MachineTable from './tables/MachineTable';
import MachineTypeTable from './tables/MachineTypeTable';
import MainSectionTable from './tables/MainSectionTable';
import MaterialCodeTable from './tables/MaterialCodeTable';
import ParameterTable from './tables/ParameterTable';
import ParameterQualifiedValueTable from './tables/ParameterQualifiedValueTable';
import PlantDepartmentTable from './tables/PlantDepartmentTable';
import PlantDeptAbpUserTable from './tables/PlantDeptAbpUserTable';
import SectionTable from './tables/SectionTable';
import SectionTemplateTable from './tables/SectionTemplateTable';
import ShiftTable from './tables/ShiftTable';
import SubSectionTable from './tables/SubSectionTable';
import ToleranceTable from './tables/ToleranceTable';
import ParameterNomeTable from './tables/ParameterNomeTable';
import UserManage from './pages/UserManage';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Background from './components/Background';
import WelcomePage from './pages/WelcomePage';
import Faults from './pages/Faults';
import Maintenance from './pages/Maintenance';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import { getCurrentUser, isAuthenticated } from './services/authService';
import './styles/layout.css'; // imported last so the shared layout wins over page CSS

// Redirects to /login when there is no session; optionally restricts by role.
const RequireAuth = ({ roles }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(getCurrentUser()?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

// Public pages: already-signed-in users go straight to the dashboard.
const PublicOnly = ({ children }) =>
  isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;

// Dashboard Layout Component (Topbar + Sidebar + Content)
const DashboardLayout = () => (
  <div className="app-shell">
    <Topbar show />
    <Sidebar />
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
      <Background />
      <ThemeToggleButton />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicOnly><WelcomePage /></PublicOnly>} />
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />

        {/* Authenticated Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/masterData" element={<MasterData />} />
            <Route path="/machine" element={<MachineTable />} />
            <Route path="/faults" element={<Faults />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/machine-type" element={<MachineTypeTable />} />
            <Route path="/main-section" element={<MainSectionTable />} />
            <Route path="/material-code" element={<MaterialCodeTable />} />
            <Route path="/parameter" element={<ParameterTable />} />
            <Route path="/parameter-norm" element={<ParameterNomeTable />} />
            <Route path="/parameter-qualified-value" element={<ParameterQualifiedValueTable />} />
            <Route path="/plant-department" element={<PlantDepartmentTable />} />
            <Route path="/plant-dept-abp-user" element={<PlantDeptAbpUserTable />} />
            <Route path="/section" element={<SectionTable />} />
            <Route path="/section-template" element={<SectionTemplateTable />} />
            <Route path="/shift" element={<ShiftTable />} />
            <Route path="/sub-section" element={<SubSectionTable />} />
            <Route path="/tolerance" element={<ToleranceTable />} />

            {/* Admin only */}
            <Route element={<RequireAuth roles={['admin']} />}>
              <Route path="/UserManage" element={<UserManage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
