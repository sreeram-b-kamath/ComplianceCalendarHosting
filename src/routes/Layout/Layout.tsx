import React from "react";
import { Route, Routes } from "react-router-dom";
import CalendarPage from "../../pages/CalendarPage/CalendarPage";
import OverviewPage from "../../pages/OverviewPage/OverviewPage";
import ManageUserPage from "../../pages/ManageUserPage/ManageUserPage";
import AddFilingsPage from "../../pages/AddFilingsPage/AddFilingsPage";
import { useUser } from "../../context/UserContext";
import AdminList from "../../components/ManageAdmins/AdminList";
import profileDetails from "../../auth/api/authApi";
import UnauthorizedPage from "../../sharedcomponents/UnAuthorized/UnAuthorizePage";


const Layout: React.FC = () => {
  const { role } = useUser();

  return (
    <>
      {/* All layout components */}
      <Routes>
        {/* Define routes here */}
        {(role === "Admin" || "NormalUser") && (profileDetails.IsEnabled === false) && (
          <>
          <Route path="*" element={<UnauthorizedPage />}></Route>
          </>
        )}
        {role === "Admin" && profileDetails.IsEnabled && (
          <>
            <Route path="/" element={<CalendarPage />}></Route>
            <Route path="/overview" element={<OverviewPage />}></Route>
            <Route
              path="/admin/manageusers"
              element={<ManageUserPage />}
            ></Route>
            <Route
              path="/admin/addfilings"
              element={<AddFilingsPage />}
            ></Route>
          </>
        )}

        {role === "NormalUser" && profileDetails.IsEnabled && (
          <>
            <Route path="/" element={<CalendarPage />}></Route>
            <Route path="/overview" element={<OverviewPage />}></Route>
          </>
        )}
        {role === "SuperUser" && (
          <>
            <Route path="*" element={<AdminList />}></Route>
          </>
        )}
      </Routes>
    </>
  );
};

export default Layout;
