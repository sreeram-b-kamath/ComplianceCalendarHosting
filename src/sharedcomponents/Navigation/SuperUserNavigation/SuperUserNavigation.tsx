import  { useState, MouseEvent } from "react";
import styles from "../SuperUserNavigation/SuperUserNavigation.module.css";  //Change path after copying code
import logo from "../../../../public/Experion_Logo.png"; //Change path after copying code
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MdOutlineLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import {  Box,  Typography } from "@mui/material";
import profileDetails from "../../../auth/api/authApi";
import { useMsal } from "@azure/msal-react";

const SuperUserNavigation = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const {instance} = useMsal();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    // console.log("You are logged out")
  };
  const handleLogoutRedirect = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
    });
    handleClose();
    window.location.reload();
  };
  const profileName = profileDetails.EmployeeName;
  const profileUpn = profileDetails.Email;
  //const profileDepartment = profileDetails.Department;

    return (
        <div>
            <div className={styles.navbar}>
                <img className={styles.logo} src={logo} alt="" />
                <div className={styles.userdiv}>
                    <span className={styles.hiadmin}>Hi, {profileName}</span>
                    <span onClick={handleClick}
                    >
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
                        <Box sx={{ display: 'flex', fontFamily: "Montserrat" }}>
                            <Box sx={{ width: '100%' }}>
                                <Typography sx={{ fontSize: '15px', paddingLeft: '20px', fontFamily: "Montserrat", fontWeight: '600' }}>{profileName}</Typography>
                                <Typography sx={{ fontSize: '10px', paddingLeft: '20px', fontFamily: "Montserrat" }}>{profileUpn}</Typography>
                            </Box>
                        </Box>
                        <MenuItem className={styles.profile} onClick={handleLogoutRedirect}>
                            <MdOutlineLogout className={styles.logouticon} /> Logout
                        </MenuItem>
                    </Menu>
                </div>
            </div>

        </div>
    );
};

export default SuperUserNavigation;
