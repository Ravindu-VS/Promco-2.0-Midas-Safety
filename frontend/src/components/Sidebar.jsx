import { useEffect, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BuildIcon from "@mui/icons-material/Build";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupIcon from "@mui/icons-material/Group";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MailIcon from "@mui/icons-material/Mail";
import { getCurrentUser } from "../services/authService";
import "./Sidebar.css";

const operationLinks = [
  { path: "/machine", label: "Machines", Icon: PrecisionManufacturingIcon },
  { path: "/faults", label: "Fault Reports", Icon: ReportProblemIcon },
  { path: "/maintenance", label: "Maintenance", Icon: EngineeringIcon },
];

// Defined outside the component so it is a stable reference
const masterDataPaths = [
  { path: "/masterData", label: "Overview" },
  { path: "/machine-type", label: "Machine Type" },
  { path: "/main-section", label: "Main Section" },
  { path: "/material-code", label: "Material Code" },
  { path: "/parameter", label: "Parameter" },
  { path: "/parameter-norm", label: "Parameter Norm" },
  { path: "/parameter-qualified-value", label: "Parameter Qualified Value" },
  { path: "/plant-department", label: "Plant Department" },
  { path: "/plant-dept-abp-user", label: "Plant Department Users" },
  { path: "/section", label: "Section" },
  { path: "/section-template", label: "Section Template" },
  { path: "/shift", label: "Shift" },
  { path: "/sub-section", label: "Sub Section" },
  { path: "/tolerance", label: "Tolerance" },
];

const Sidebar = () => {
  const [masterDataOpen, setMasterDataOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", role: "", profilePicture: "" });
  const location = useLocation();

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    if (masterDataPaths.some((item) => item.path === location.pathname)) {
      setMasterDataOpen(true);
    }
  }, [location.pathname]);
  
  const handleMasterDataClick = () => {
    setMasterDataOpen((prev) => !prev);
  };

  const getFirstName = (name) => {
    if (!name) return "User";
    const nameParts = name.split(" ");
    return nameParts[0];
  };

  const generateInitials = (name) =>
    name
      .split(/[\s_.-]+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="sidebar">
      {/* User Info Section */}
      <div className="user-info">
        <div className="profile-icon">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="profile-picture" />
          ) : (
            <div className="initials-icon">
              {generateInitials(user.name || user.username || "User")}
            </div>
          )}
        </div>
        <div>
          <p className="welcome-text">Welcome, {getFirstName(user.name || user.username)}</p>
          <p className="user-email">{user.email || "Email"}</p>
          <p className="user-role">{user.role || "Role"}</p>
        </div>
      </div>

      {/* Sidebar Links */}
      <List className="sidebar-links">
        <ListItemButton
          component={Link}
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          <ListItemIcon>
            <HomeIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        {operationLinks.map(({ path, label, Icon }) => (
          <ListItemButton key={path} component={Link} to={path} className={location.pathname === path ? "active" : ""}>
            <ListItemIcon>
              <Icon className="icon" />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}

        <ListItemButton component={Link} to="/messages" className={location.pathname === "/messages" ? "active" : ""}>
          <ListItemIcon>
            <MailIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary={user.role === "admin" ? "Messages" : "Contact Admin"} />
        </ListItemButton>

        {user.role === "admin" && (
          <ListItemButton
            component={Link}
            to="/UserManage"
            className={location.pathname === "/UserManage" ? "active" : ""}
          >
            <ListItemIcon>
              <GroupIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItemButton>
        )}

        <ListItemButton onClick={handleMasterDataClick}>
          <ListItemIcon>
            <ListAltIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary="Master Data" />
          {masterDataOpen ? (
            <ExpandLessIcon className="icon" />
          ) : (
            <ExpandMoreIcon className="icon" />
          )}
        </ListItemButton>

        <Collapse in={masterDataOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {masterDataPaths.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                className={
                  location.pathname === item.path
                    ? "nested-link active"
                    : "nested-link"
                }
              >
                <ListItemIcon>
                  <BuildIcon className="subsection-icon" />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default Sidebar;
