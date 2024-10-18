import { useEffect, useState } from "react";
import {
  List,
  ListItem,
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
import "./Sidebar.css";

const Sidebar = () => {
  const [masterDataOpen, setMasterDataOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", role: "", profilePicture: "" });
  const location = useLocation();

  const masterDataPaths = [
    "/machine",
    "/machine-type",
    "/main-section",
    "/parameter",
    "/parameter-qualified-value",
    "/section-template",
    "/sub-section",
    "/tolerance",
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setMasterDataOpen(masterDataPaths.includes(location.pathname));
  }, [location.pathname]);

  const handleMasterDataClick = () => {
    setMasterDataOpen((prev) => !prev);
  };

  const getFirstName = (name) => {
    if (!name) return "User";
    const nameParts = name.split(" ");
    return nameParts[0];
  };

  const generateInitials = (name) => {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part[0]).join("").toUpperCase();
    return initials.length > 2 ? initials.slice(0, 2) : initials;
  };

  return (
    <div className="sidebar">
      {/* User Info Section */}
      <div className="user-info">
        <div className="profile-icon">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="profile-picture" />
          ) : (
            <div className="initials-icon">
              {generateInitials(user.name || "User Name")}
            </div>
          )}
        </div>
        <div>
          <p className="welcome-text">Welcome, {getFirstName(user.name)}</p>
          <p className="user-email">{user.email || "Email"}</p>
          <p className="user-role">{user.role || "Role"}</p>
        </div>
      </div>

      {/* Sidebar Links */}
      <List className="sidebar-links">
        <ListItem
          button
          component={Link}
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          <ListItemIcon>
            <HomeIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        {user.role === "admin" && (
          <ListItem
            button
            component={Link}
            to="/UserManage"
            className={location.pathname === "/UserManage" ? "active" : ""}
          >
            <ListItemIcon>
              <GroupIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary="User Manage" />
          </ListItem>
        )}

        <ListItem button onClick={handleMasterDataClick}>
          <ListItemIcon>
            <ListAltIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary="Master Data" />
          {masterDataOpen ? (
            <ExpandLessIcon className="icon" />
          ) : (
            <ExpandMoreIcon className="icon" />
          )}
        </ListItem>

        <Collapse in={masterDataOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {masterDataPaths.map((path, index) => (
              <ListItem
                key={index}
                button
                component={Link}
                to={path}
                className={
                  location.pathname === path
                    ? "nested-link active"
                    : "nested-link"
                }
              >
                <ListItemIcon>
                  <BuildIcon className="subsection-icon" />
                </ListItemIcon>
                <ListItemText primary={path.replace("/", "").replace("-", " ")} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default Sidebar;
