import { useState, useEffect, MouseEvent } from "react";
import styles from "../UserNavigation/UserNavigation.module.css";
import logo from "../../../../public/Experion_Logo.png";
import { BsCalendar3 } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MdOutlineLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { Button, Box, Typography } from "@mui/material";
import { IoNotifications } from "react-icons/io5";
import { useMsal } from "@azure/msal-react";
import profileDetails from "../../../auth/api/authApi";
import { Link } from "react-router-dom";

interface Notification {
  id: number;
  notificationBody: string;
  notificationType: string;  // Added notificationType
}

const UserNavigation = () => {
  const [activeButton, setActiveButton] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElalert, setAnchorElalert] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const open = Boolean(anchorEl);
  const openalertMenu = Boolean(anchorElalert);

  const { instance } = useMsal();

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const { EmployeeId } = profileDetails;
      const response = await fetch(`https://localhost:7013/api/Notification/unread/${EmployeeId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      // Sort notifications to display "Pending Filing" first
      const sortedNotifications = data.sort((a: Notification, b: Notification) => {
        if (a.notificationType === "Pending Filing") return -1;
        if (b.notificationType === "Pending Filing") return 1;
        return 0;
      });

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  };

  // Fetch notifications initially and then set up interval
  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchNotifications(); // Fetch every 2 minutes
    }, 2 * 60 * 1000); // 2 minutes in milliseconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

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

  const handleLogoutRedirect = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
    });
    handleClose();
    window.location.reload();
  };

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

  const profileName = profileDetails.EmployeeName;
  const profileUpn = profileDetails.Email;
  const profileDepartment = profileDetails.Department;

  // Calculate notification count
  const notificationCount = notifications.length;

  return (
    <div>
      <div className={styles.navbar}>
        <img className={styles.logo} src={logo} alt="" />
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
                  {profileName}, {profileDepartment}
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
            <MenuItem className={styles.profile} onClick={handleLogoutRedirect}>
              <MdOutlineLogout className={styles.logouticon} /> Logout
            </MenuItem>
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
              }}
            >
              <BsCalendar3 className={styles.calendaricon} /> Calendar
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
              }}
            >
              <VscGraph className={styles.calendaricon} /> Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserNavigation;
