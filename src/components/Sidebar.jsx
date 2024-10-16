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
import ListAltIcon from "@mui/icons-material/ListAlt"; // Master data icon
import "./Sidebar.css"; // Import the CSS file

const Sidebar = () => {
  const [masterDataOpen, setMasterDataOpen] = useState(false); // State to manage collapse
  const [user, setUser] = useState({ name: "", email: "", role: "" }); // Add role to user state
  const location = useLocation(); // Get current location

  // Fetch user data from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user data from localStorage
    }
  }, []);

  const handleMasterDataClick = () => {
    setMasterDataOpen(!masterDataOpen);
  };

  // Generate initials from the user's name
  const generateInitials = (name) => {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part[0]).join("").toUpperCase();
    return initials.length > 2 ? initials.slice(0, 2) : initials;
  };

  return (
    <div className="sidebar">
      {/* User Info Section */}
      <div className="user-info">
        {/* Profile Icon with Initials */}
        <div className="profile-icon">
          {generateInitials(user.name || "User Name")}
        </div>
        <div>
          {/* Display User Name, Email, and Role */}
          <p className="user-name">{user.name || "User Name"}</p>
          <p className="user-email">{user.email || "Email"}</p>
          <p className="user-role">{user.role || "Role"}</p>
        </div>
      </div>

      {/* Sidebar Links */}
      <List className="sidebar-links">
        {/* Home Link */}
        <ListItem
          button
          component={Link}
          to="/dashboard"
          selected={location.pathname === "/dashboard"}
        >
          <ListItemIcon>
            <HomeIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        {/* Conditionally Render User Manage Link for Admins */}
        {user.role === "admin" && (
          <ListItem
            button
            component={Link}
            to="/UserManage"
            selected={location.pathname === "/UserManage"}
          >
            <ListItemIcon>
              <GroupIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary="User Manage" />
          </ListItem>
        )}

        {/* Collapsible Master Data Section */}
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

        {/* Collapsible Links */}
        <Collapse in={masterDataOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              component={Link}
              to="/machine"
              className={
                location.pathname === "/machine"
                  ? "nested-link active"
                  : "nested-link"
              }
            >
              <ListItemIcon>
                <BuildIcon className="icon" />
              </ListItemIcon>
              <ListItemText primary="Machine" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/machine-type"
              className={
                location.pathname === "/machine-type"
                  ? "nested-link active"
                  : "nested-link"
              }
            >
              <ListItemIcon>
                <BuildIcon className="icon" />
              </ListItemIcon>
              <ListItemText primary="Machine Type" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/main-section"
              className={
                location.pathname === "/main-section"
                  ? "nested-link active"
                  : "nested-link"
              }
            >
              <ListItemIcon>
                <BuildIcon className="icon" />
              </ListItemIcon>
              <ListItemText primary="Main Section" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/parameter"
              className={
                location.pathname === "/parameter"
                  ? "nested-link active"
                  : "nested-link"
              }
            >
              <ListItemIcon>
                <BuildIcon className="icon" />
              </ListItemIcon>
              <ListItemText primary="Parameter" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/parameter-qualified-value"
              className={
                location.pathname === "/parameter-qualified-value"
                  ? "nested-link active"
                  : "nested-link"
              }
            >
              <ListItemIcon>
                <BuildIcon className="icon" />
              </ListItemIcon>
              <ListItemText primary="Parameter Qualified Value" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/section-template"
              className={
                location.pathname === "/section-template"
                  ? "nested-link active"
                  : "nested-link"
              }
            >
              <ListItemIcon>
                <BuildIcon className="icon" />
              </ListItemIcon>
              <ListItemText primary="Section Template" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/sub-section"
              className={
                location.pathname === "/sub-section"
                  ? "nested-link active"
                  : "nested-link"
              }
            >
              <ListItemIcon>
                <BuildIcon className="icon" />
              </ListItemIcon>
              <ListItemText primary="Sub Section" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/tolerance"
              className={
                location.pathname === "/tolerance"
                  ? "nested-link active"
                  : "nested-link"
              }
            >
              <ListItemIcon>
                <BuildIcon className="icon" />
              </ListItemIcon>
              <ListItemText primary="Tolerance" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default Sidebar;
