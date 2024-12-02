import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/tailwind.css';
import LoadingSpinner from './components/LoadingSpinner';
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
import SectionTemplateTable from './tables/SectionTemplateTable';
import ShiftTable from './tables/ShiftTable';
import SubSectionTable from './tables/SubSectionTable';
import ToleranceTable from './tables/ToleranceTable';
import ParameterNomeTable from './tables/ParameterNomeTable';
import UserManage from './pages/UserManage';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Background from './components/Background';
import WelcomePage from './pages/WelcomePage'; // Import WelcomePage

// Dashboard Layout Component (Topbar + Sidebar + Content)
const DashboardLayout = () => (
  <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
    <Sidebar />  {/* Fixed sidebar */}
    <div>
      <Topbar show={true} /> {/* Topbar */}
      <div className="main-content mt-6"> {/* Padding for content */}
        <Outlet /> {/* Nested routes will render here */}
      </div>
    </div>
  </div>
);

function App() {
  const [users, setUsers] = useState([]); // Initialize empty user list
  const [loading, setLoading] = useState(false); // State to track loading
  const navigate = useNavigate(); // Get the navigate function from react-router-dom
  const location = useLocation(); // Track location changes
  const [isFirstVisit, setIsFirstVisit] = useState(false); // Track first visit

  // Check if it's the first visit
  useEffect(() => {
    if (!localStorage.getItem('hasVisited')) {
      setIsFirstVisit(true); // Show WelcomePage
      localStorage.setItem('hasVisited', 'true'); // Set flag for future visits
    }
  }, []);

  // Show loading spinner on location change (route change)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // Hide after 1 second
    return () => clearTimeout(timer);
  }, [location]); // Runs every time the location changes

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
      <Background />  {/* Background component */}
      <ThemeToggleButton /> {/* Toggle theme button visible on all pages */}
      {loading ? <LoadingSpinner /> : null} {/* Show loading spinner if loading is true */}
      
      {/* Conditional Rendering for First Visit */}
      {isFirstVisit ? (
        <WelcomePage /> // Show Welcome Page if it's the first visit
      ) : (
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login users={users} />} /> {/* Pass user data to Login */}

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}> {/* Layout wrapping all dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile user={users[0]} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/UserManage" element={<UserManage users={users} setUsers={setUsers} />} />
            <Route path="/masterData" element={<MasterData />} />
            <Route path="/machine" element={<MachineTable />} />
            <Route path="/machine-type" element={<MachineTypeTable />} />
            <Route path="/main-section" element={<MainSectionTable />} />
            <Route path="/material-code" element={<MaterialCodeTable />} />
            <Route path="/parameter" element={<ParameterTable />} />
            <Route path="/parameter-norm" element={<ParameterNomeTable />} />
            <Route path="/parameter-qualified-value" element={<ParameterQualifiedValueTable />} />
            <Route path="/plant-department" element={<PlantDepartmentTable />} />
            <Route path="/plant-dept-abp-user" element={<PlantDeptAbpUserTable />} />
            <Route path="/section-template" element={<SectionTemplateTable />} />
            <Route path="/shift" element={<ShiftTable />} />
            <Route path="/sub-section" element={<SubSectionTable />} />
            <Route path="/tolerance" element={<ToleranceTable />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}

export default App;
