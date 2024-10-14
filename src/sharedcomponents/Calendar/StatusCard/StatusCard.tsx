import React, { useContext, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Tooltip,
  IconButton,
} from "@mui/material";
import { LuFileWarning } from "react-icons/lu";
import DataContext from "../../../utility/DataContext/DataContext";
import FilingModal from "../../../components/EditStatus/UserEditStatus";
import AdminEditStatus from "../../../components/EditStatus/AdminEditStatus";
import profileDetails from "../../../auth/api/authApi";
import { FilingData } from "../../../utility/DataContext/FilingData";

const StatusCard: React.FC = () => {
  const selectedObject = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState<FilingData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setUserRole(profileDetails.RoleName);
        setUserId(profileDetails.EmployeeId);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, []);

  const handleOpen = (obj: FilingData) => {
    setModalContent(obj);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const getStatusTextColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "closed":
        return "green";
      case "open":
        return "blue";
      case "pending":
        return "red";
      default:
        return "black";
    }
  };

  const renderCardContent = (obj: FilingData, index: number) => {
    const isAdminAndWrongDept = 
      userRole === "Admin" && 
      userId && 
      !obj.assignedToId.some(assign => assign.employeeId === userId);

    return (
      <Card
        key={index}
        sx={{
          width: "90%",
          backgroundColor: "white",
          marginLeft: "3%",
          paddingTop: "5px",
          marginBottom: "10px",
          cursor: "pointer",
          borderRadius: "8px",
          boxShadow: "0 8px 4px rgba(0, 0, 0, 0.1)",
          borderLeft: `9px solid ${getStatusTextColor(obj.status)}`,
          position: "relative",
          height: "90px",
        }}
        onClick={() => handleOpen(obj)}
      >
        {obj.status?.toLowerCase() === "open" && (
          <Typography
            sx={{
              position: "absolute",
              top: "10px",
              left: "15px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Open
          </Typography>
        )}

        <CardContent>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: getStatusTextColor(obj.status),
                }}
                gutterBottom
              >
                {obj.status || "N/A"}
                <Typography
                  sx={{
                    alignItems: "flex-start",
                    color: "black",
                    fontFamily: "Montserrat",
                    fontSize: "12px",
                  }}
                >
                  {obj.assignedTo && obj.assignedTo.length > 0
                    ? obj.assignedTo
                        .map((employee) => employee.empName)
                        .join(", ") // Convert array of objects to a string
                    : "N/A"}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                component="div"
                sx={{
                  color: "black",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  fontFamily: "Montserrat",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {obj.statuteOrAct || "N/A"}
              </Typography>
            </Grid>
          </Grid>
          {!obj.docIsUploaded && obj.status === "Closed" && (
            <Tooltip title="Document not uploaded" placement="top">
              <IconButton
                sx={{
                  position: "absolute",
                  top: "60px",
                  right: "0px",
                  color: "red",
                  fontSize: "18px",
                }}
              >
                <LuFileWarning />
              </IconButton>
            </Tooltip>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!selectedObject || selectedObject.length === 0) {
    return null;
  }

  return (
    <div>
      {selectedObject.map((obj, index) => (
        <div key={index}>
          {renderCardContent(obj, index)}
          {modalContent && modalContent === obj && (
            userRole === "Admin" && !obj.assignedToId.some(assign => assign.employeeId === userId) ? (
              <AdminEditStatus
                open={open}
                handleClose={handleClose}
                content={modalContent}
              />
            ) : (
              <FilingModal
                open={open}
                handleClose={handleClose}
                content={modalContent}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default StatusCard;
