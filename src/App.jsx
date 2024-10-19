import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react"; // Ensure useState is imported
import ThemeToggleButton from "./components/ThemeToggleButton";
import Login from "./pages/Login";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import MasterData from "./pages/MasterData";
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
import ParameterNomeTable from './tables/ParameterNomeTable'; // Correct the import
import UserManage from './pages/UserManage';
import Profile from './components/Profile';
import Settings from "./components/Settings";

// Dashboard Layout Component (Topbar + Sidebar + Content)
const DashboardLayout = () => (
  <div className="app-wrapper">
    <Topbar show={true} />  {/* Keep the Topbar visible */}
    <Sidebar />  {/* Keep the Sidebar visible */}
    <div className="main-content">
      <Outlet />  {/* This is where each page content will be rendered */}
    </div>
  </div>
);

function App() {
  const [users, setUsers] = useState([]); // Initial empty user list

  return (
    <div>
      <ThemeToggleButton /> {/* This ensures the button is visible on all pages, including Login */}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login users={users} />} /> {/* Pass user data to Login */}
        
        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}> {/* Layout wrapping all dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile user={users[0]} />} /> {/* Pass first user data to Profile if available */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/UserManage" element={<UserManage users={users} setUsers={setUsers} />} /> {/* Pass user data to UserManage */}
          <Route path="/masterData" element={<MasterData />} />
          <Route path="/machine" element={<MachineTable />} />
          <Route path="/machine-type" element={<MachineTypeTable />} />
          <Route path="/main-section" element={<MainSectionTable />} />
          <Route path="/material-code" element={<MaterialCodeTable />} />
          <Route path="/parameter" element={<ParameterTable />} />
          <Route path="/parameter-norm" element={<ParameterNomeTable />} /> {/* Match the sidebar link */}
          <Route path="/parameter-qualified-value" element={<ParameterQualifiedValueTable />} />
          <Route path="/plant-department" element={<PlantDepartmentTable />} />
          <Route path="/plant-dept-abp-user" element={<PlantDeptAbpUserTable />} />
          <Route path="/section-template" element={<SectionTemplateTable />} />
          <Route path="/shift" element={<ShiftTable />} />
          <Route path="/sub-section" element={<SubSectionTable />} />
          <Route path="/tolerance" element={<ToleranceTable />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
