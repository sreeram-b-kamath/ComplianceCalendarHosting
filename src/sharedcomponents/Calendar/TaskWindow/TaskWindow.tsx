import React, { useContext } from "react";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import StatusCard from "../StatusCard/StatusCard";
import DataContext from "../../../utility/DataContext/DataContext";
import { FilingData } from "../../../utility/DataContext/FilingData"; 

interface RightSidebarProps {
  selectedDate: dayjs.Dayjs | null;
  currentDate: dayjs.Dayjs | null;
}

const TaskWindow: React.FC<RightSidebarProps> = ({
  selectedDate,
  currentDate,
}) => {
  const selectedObject = useContext(DataContext) as FilingData[];
  
  return (
    <Box
      sx={{
        width: "290px",
        height: "100vh",
        backgroundColor: "#D9D9D9",
        position: "fixed",
        right: 0,
      }}
    >
      <Box
        sx={{
          width: "290px",
          height: "90vh",
          backgroundColor: "#D9D9D9",
          position: "fixed",
          right: 0,
          top: "54px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",

          paddingBottom: "10px",
          borderLeft: "5px white solid",

        }}
      >
        <Box
          sx={{
            height: "10vh",
            boxShadow: 3,
            display: "flex",
            alignItems: "center",
            fontWeight: 400,
            fontSize: "12px",
            paddingLeft: "20px",
            fontFamily: "Montserrat",

          }}
        >
          <h2>
            {selectedDate
              ? selectedDate.format("DD-MMM-YYYY")
              : `${currentDate?.format("DD-MM-YYYY")}`}
          </h2>
        </Box>
        <Box
          sx={{
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
            overflowY: "auto",
            scrollbarWidth:'none'
          }}
        >
          {selectedObject.length > 0 ? (
            <StatusCard />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "85%",
                gap:'10px'
              }}
            >
              <Box
                component="img"
                src="public\nofilingsimage.png"
                sx={{ height: "100px" }}
              ></Box>
              <Box sx={{fontWeight:'500'}}>No Filings for Today</Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TaskWindow;
 