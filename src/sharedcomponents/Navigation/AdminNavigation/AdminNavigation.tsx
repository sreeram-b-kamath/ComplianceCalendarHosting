import React, { MouseEvent, useState, useEffect } from "react";
import styles from "../AdminNavigation/AdminNavigation.module.css"; //Change path after copying code
import logo from "../../../../public/Experion_Logo.png"; //Change path after copying code
import { BsCalendar3 } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { HiUsers } from "react-icons/hi";
import { PiListPlusFill } from "react-icons/pi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MdOutlineLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import profileDetails from "../../../auth/api/authApi";

interface Notification {
  id: number;
  notificationBody: string;
}

const AdminNavigation: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string>(""); // add this state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [anchorElalert, setAnchorElalert] = useState<null | HTMLElement>(null);
  const openalertMenu = Boolean(anchorElalert);
  const { instance } = useMsal();

  const profileName = profileDetails.EmployeeName;
  const profileUpn = profileDetails.Email;
  const profileDepartment = profileDetails.Department;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { EmployeeId } = profileDetails;
        const response = await fetch(`https://localhost:7013/api/Notification/unread/${EmployeeId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`https://localhost:7013/api/Notification/markasread/${notificationId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAlertClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElalert(event.currentTarget);
  };

  const handleCloseAlertMenu = () => {
    setAnchorElalert(null);
  };

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  const activeAccount = instance.getActiveAccount();

  const handleLogoutRedirect = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
    });
    window.location.reload();
  };

  // Calculate notification count
  const notificationCount = notifications.length;

  return (
    <div>
      <div className={styles.navbar}>
        <img className={styles.logo} src={logo} alt="Experion Logo" />
        <div className={styles.userdiv}>
          <span onClick={handleAlertClick} className={styles.notificationIconContainer}>
            <IoNotifications
              id="basic-button-settings"
              aria-controls={openalertMenu ? "basic-menu-settings" : undefined}
              aria-haspopup="true"
              aria-expanded={openalertMenu ? "true" : undefined}
              className={styles.notificationbutton}
            />
            {notificationCount > 0 && (
              <span className={styles.notificationCount}>{notificationCount}</span>
            )}
          </span>
          <Menu
            id="basic-menu-settings"
            anchorEl={anchorElalert}
            open={openalertMenu}
            onClose={handleCloseAlertMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button-settings",
            }}
          >
            {notifications.length === 0 ? (
              <MenuItem>No notifications</MenuItem>
            ) : (
              notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  sx={{ width: "300px", whiteSpace: "normal" }}
                >
                  <Box>
                    <Typography>{notification.notificationBody}</Typography>
                    <Button
                      onClick={() => markAsRead(notification.id)}
                      sx={{ textTransform: "none", padding: 0 }}
                    >
                      Mark as read
                    </Button>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          <span className={styles.hiadmin}>Hi, {profileName}</span>
          <span onClick={handleClick}>
            <FaUserCircle
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              className={styles.usericon}
            />
          </span>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Box sx={{ display: "flex", fontFamily: "Montserrat" }}>
              <Box sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    fontSize: "15px",
                    paddingLeft: "20px",
                    fontFamily: "Montserrat",
                    fontWeight: "600",
                  }}
                >
                  {profileName},{profileDepartment}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "10px",
                    paddingLeft: "20px",
                    fontFamily: "Montserrat",
                  }}
                >
                  {profileUpn}
                </Typography>
              </Box>
            </Box>
            <AuthenticatedTemplate>
              {activeAccount ? (
                <>
                  <MenuItem
                    className={styles.profile}
                    onClick={handleLogoutRedirect}
                  >
                    <MdOutlineLogout className={styles.logouticon} /> Logout
                  </MenuItem>
                </>
              ) : null}
            </AuthenticatedTemplate>
          </Menu>
        </div>
      </div>
      <div className={styles.sidebar}>
        <div className={styles.buttongroup}>
          <Link to="/">
            <Button
              variant="contained"
              onClick={() => handleButtonClick("calendar")}
              sx={{
                width: "100%",
                bgcolor: activeButton === "calendar" ? "#a5a5a5" : "#d9d9d9",
                "&:hover": { bgcolor: "#a5a5a5", boxShadow: "none" },
                boxShadow: "none",
                color: "black",
                justifyContent: "flex-start",
                paddingTop: "5px",
                paddingBottom: "5px",
                paddingLeft: 3,
                fontFamily: "Montserrat",
                textTransform: "none",
                gap: 2,
                borderRadius: "0",
              }}
            >
              <Link to="/">
                <BsCalendar3 className={styles.calendaricon} />
              </Link>{" "}
              Calendar
            </Button>
          </Link>
          <Link to="/overview">
            <Button
              variant="contained"
              onClick={() => handleButtonClick("overview")}
              sx={{
                width: "100%",
                bgcolor: activeButton === "overview" ? "#a5a5a5" : "#d9d9d9",
                "&:hover": { bgcolor: "#a5a5a5", boxShadow: "none" },
                boxShadow: "none",
                color: "black",
                paddingTop: "5px",
                paddingBottom: "5px",
                paddingLeft: 3,
                justifyContent: "flex-start",
                fontFamily: "Montserrat",
                textTransform: "none",
                gap: 2,
                borderRadius: "0",
              }}
            >
              <VscGraph className={styles.calendaricon} /> Overview
            </Button>
          </Link>
          <Link to="/admin/manageusers">
            <Button
              variant="contained"
              onClick={() => handleButtonClick("manageUsers")}
              sx={{
                width: "100%",
                bgcolor: activeButton === "manageUsers" ? "#a5a5a5" : "#d9d9d9",
                "&:hover": { bgcolor: "#a5a5a5", boxShadow: "none" },
                boxShadow: "none",
                color: "black",
                justifyContent: "flex-start",
                paddingTop: "5px",
                paddingBottom: "5px",
                paddingLeft: 3,
                fontFamily: "Montserrat",
                textTransform: "none",
                gap: 2,
                borderRadius: "0",
              }}
            >
              <HiUsers className={styles.calendaricon} /> Manage Users
            </Button>
          </Link>
          <Link to="/admin/addfilings">
            <Button
              variant="contained"
              onClick={() => handleButtonClick("addFilings")}
              sx={{
                width: "100%",
                bgcolor: activeButton === "addFilings" ? "#a5a5a5" : "#d9d9d9",
                "&:hover": { bgcolor: "#a5a5a5", boxShadow: "none" },
                boxShadow: "none",
                color: "black",
                justifyContent: "flex-start",
                paddingTop: "5px",
                paddingBottom: "5px",
                paddingLeft: 3,
                fontFamily: "Montserrat",
                textTransform: "none",
                gap: 2,
                borderRadius: "0",
              }}
            >
              <PiListPlusFill className={styles.calendaricon} /> Add filings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
