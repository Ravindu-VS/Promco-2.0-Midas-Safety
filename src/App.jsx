import { Routes, Route, Outlet } from "react-router-dom";
import ThemeToggleButton from "./components/ThemeToggleButton";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MasterData from "./pages/MasterData";
import Machine from './pages/Machine';
import MachineType from './pages/MachineType';
import MainSection from './pages/MainSection';
import Parameter from './pages/Parameter';
import ParameterQualifiedValue from './pages/ParameterQualifiedValue';
import SectionTemplate from './pages/SectionTemplate';
import SubSection from './pages/SubSection';
import Tolerance from './pages/Tolerance';
import UserManage from './pages/UserManage';
import Profile from './components/Profile';
import Settings from "./components/Settings";

// Sample user data
const user = {
  name: 'John Doe',
  address: '123 Main St, Anytown',
  telephone: '+1 234 567 890',
  username: 'johndoe',
  email: 'john.doe@example.com',
  role: 'Admin',
  profilePicture: '', // Add a default or placeholder image URL if available
  joinedDate: new Date(),
  phone: '+1 234 567 890',
};

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
  return (
    <div>
      <ThemeToggleButton /> {/* This ensures the button is visible on all pages, including Login */}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} /> {/* Login page - no topbar/sidebar */}
        
        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}> {/* Layout wrapping all dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile user={user} />} /> {/* Pass user data to Profile */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/UserManage" element={<UserManage />} />
          <Route path="/masterData" element={<MasterData />} />
          <Route path="/machine" element={<Machine />} />
          <Route path="/machine-type" element={<MachineType />} />
          <Route path="/main-section" element={<MainSection />} />
          <Route path="/parameter" element={<Parameter />} />
          <Route path="/parameter-qualified-value" element={<ParameterQualifiedValue />} />
          <Route path="/section-template" element={<SectionTemplate />} />
          <Route path="/sub-section" element={<SubSection />} />
          <Route path="/tolerance" element={<Tolerance />} /> 
        </Route>
      </Routes>
    </div>
  );
}

export default App;
