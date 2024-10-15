import React, { useState, useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import { FilingData } from "../../utility/DataContext/FilingData";

interface FilingModalProps {
  open: boolean;
  handleClose: () => void;
  content: FilingData | null;
}

const AdminEditStatus: React.FC<FilingModalProps> = ({
  open,
  handleClose,
  content,
}) => {
  const [status, setStatus] = useState(content?.status || "");
  console.log(status);
  
  // Sync state with prop changes
  useEffect(() => {
    if (content) {
      setStatus(content.status || "");
    }
  }, [content]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          maxHeight: "90vh", // Make the height flexible
          overflowY: "auto", // Allow scrolling if content overflows
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: "5px",
        }}
      >
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{ fontFamily: "Montserrat", fontWeight:'700' }}
        >
          Filing Details
        </Typography>
        {content && (
          <>
            <Typography id="modal-description" sx={{ mt: 2,fontFamily: "Montserrat" }}>
              Form/Challan No*: {content.formChallan || "N/A"}
            </Typography>
            <Typography sx={{fontFamily: "Montserrat"}}>
              Statute/Act: {content.statuteOrAct || "N/A"}
            </Typography>
            <Typography sx={{fontFamily: "Montserrat"}}>
              Assigned To: 
              {/* Render array of assignees */}
              {Array.isArray(content.assignedTo) ? (
                content.assignedTo.map((assignee, index) => (
                  <span key={index}>
                    {assignee.empName || "N/A"} {/* Adjust based on the structure of Assignees */}
                    {index < content.assignedTo.length - 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                "N/A"
              )}
            </Typography>
            <Typography sx={{fontFamily: "Montserrat"}}>Particulars: {content.particulars || "N/A"}</Typography>
            <Typography sx={{ display: "flex", alignItems: "center",fontFamily: "Montserrat"   }}>
              Status: {content.status || "N/A"}
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center",fontFamily: "Montserrat" }}>
              Remarks:  {content.remarks || "No remarks added"}
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AdminEditStatus;
