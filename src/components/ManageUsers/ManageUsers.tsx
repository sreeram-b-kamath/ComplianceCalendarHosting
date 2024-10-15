import { useState } from "react";
import ManageUsersTable from "./ManageUsersTable/ManageUsersTable";
import Buttons from "./Buttons/Buttons";
import { Box, Typography } from "@mui/material";
import axios from "axios";


const ManageUsers = () => {

  const [refresh, setRefresh] = useState(false);

  const fetchData = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.get("https://localhost:7013/ManageUsers"); // Update the API URL if necessary
      console.log(response);
      
      setRefresh(!refresh); // Trigger a refresh if needed
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Box sx={{ p: 2,display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBlock: 2,
            paddingInline: 2,
            marginTop: 10,
            paddingLeft:'18.5%'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily:"Montserrat"  }}>
            Users
          </Typography>
          <Buttons  fetchData={fetchData}/>
        </Box>
        <Box sx={{display:"flex",justifyContent:"flex-end",marginInlineEnd:2}}>
          <ManageUsersTable  fetchData={fetchData}/>
        </Box>
      </Box>
    </>
  );
};

export default ManageUsers;
