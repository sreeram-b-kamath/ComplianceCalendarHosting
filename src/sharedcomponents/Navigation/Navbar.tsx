import React from "react";
import AdminNavigation from "./AdminNavigation/AdminNavigation";
import UserNavigation from "./UserNavigation/UserNavigation";
import SuperUserNavigation from "./SuperUserNavigation/SuperUserNavigation";
import { useUser } from "../../context/UserContext";
import profileDetails from "../../auth/api/authApi";

const Navbar = () => {
  const { role } = useUser();
  return (
    <>
    {(role==="Admin" && profileDetails.IsEnabled &&
      <AdminNavigation />
    )}
    {(role==="NormalUser" && profileDetails.IsEnabled &&
      <UserNavigation />
    )}
      {(role==="SuperUser" &&
        <SuperUserNavigation />    )}
      
    </>
  );
};

export default Navbar;
