import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField } from "@mui/material";
import dayjs from "dayjs";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import axios from "axios";
import { FilingData } from "../../utility/DataContext/FilingData";
import { useNavigate } from "react-router-dom";
import profileDetails from "../../auth/api/authApi";

interface FilingModalProps {
  open: boolean;
  handleClose: () => void;
  content: FilingData | null;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UserEditStatus: React.FC<FilingModalProps> = ({
  open,
  handleClose,
  content,
}) => {
  const [status, setStatus] = useState(content?.status || "");
  const [remarks, setRemarks] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);

  const navigate = useNavigate();

  // Sync state with prop changes
  useEffect(() => {
    if (content) {
      setStatus(content.status || "");
    }
  }, [content]);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value as string;
    setStatus(newStatus);

    if (newStatus === "Closed" && !uploadedFile) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
      setUploadedFileName(event.target.files[0].name);
      setShowWarning(false); // Hide warning if a file is uploaded
    }
  };

  const handleSubmit = async () => {
    if (content) {
      try {
        setUpdateCounter(prevCounter => prevCounter + 1);
        const { EmployeeId } = profileDetails;
        let docIsUploaded = content.docIsUploaded;

        if (uploadedFile) {
          const formData = new FormData();
          formData.append("file", uploadedFile);
          formData.append("filingId", content.filingId.toString());
          formData.append("documentLink", "");
          formData.append("uploadedDate", new Date().toISOString());

          await axios.post(
            `https://localhost:7013/Document/AddDocument`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          docIsUploaded = true;
        }

        await axios.put(
          `https://localhost:7013/Filings/UpdateFilingStatus/${content.filingId}`,
          {
            status,
            docIsUploaded,
            remarks,
          }
        );

        const queryString = new URLSearchParams({
          empId: EmployeeId.toString(),
          particulars: content.particulars || "",
          dueDate: dayjs(content.dueDate).format("YYYY-MM-DD") || "",
        }).toString();
        if (status === "Closed") {

          await axios.post(
            `https://localhost:7013/api/Notification/ClosedFiling?${queryString}`,
          );
        }

        handleClose();

        // Use the updateCounter instead of status in navigation
        navigate("/", { state: { updateCounter } });

      } catch (error) {
        console.error("There was an error updating the filing status:", error);
      }
    }
  };

  const getMenuItems = () => {
    const statuses = ["Open", "Closed"];
    return statuses
      .filter((s) => s !== status)
      .map((s) => (
        <MenuItem key={s} value={s}>
          {s}
        </MenuItem>
      ));
  };

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
          maxHeight: "90vh",
          overflowY: "auto",
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
          sx={{ fontFamily: "Montserrat", fontWeight: "700" }}
        >
          Edit Status
        </Typography>
        {content && (
          <>

            <Typography id="modal-description" sx={{ mt: 1,fontFamily: "Montserrat" }}>
              Form/Challan No: {content.formChallan || "N/A" }
            </Typography>
            <Typography sx={{ fontFamily: "Montserrat" }}>
              Statute/Act: {content.statuteOrAct || "N/A"}
            </Typography>
            <Typography sx={{ fontFamily: "Montserrat" }}>
              Assigned To: {content.assignedTo || "N/A"}
            </Typography>
            <Typography sx={{ fontFamily: "Montserrat" }}>
              Particulars: {content.particulars || "N/A"}
            </Typography>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontFamily: "Montserrat",
              }}
            >
              Status:
              <FormControl sx={{ m: 1, minWidth: 80, ml: 2 }}>
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  sx={{ height: "35px" }}
                >
                  <MenuItem value={status}>{status}</MenuItem>
                  {getMenuItems()}
                </Select>
              </FormControl>
            </Typography>
            {showWarning && (
              <Typography
                variant="body2"
                color="error"
                sx={{ fontFamily: "Montserrat" }}
              >
                Please note: You have not uploaded a document. Ensure all
                necessary documents are uploaded.
              </Typography>
            )}
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{
                fontFamily: "Montserrat",
                bgcolor: "#c90037",
                "&:hover": { bgcolor: "#c90037" },
              }}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
            {uploadedFileName && (
              <Typography
                variant="body2"
                sx={{ mt: 1, fontFamily: "Montserrat" }}
              >
                Uploaded file: {uploadedFileName}
              </Typography>
            )}
            <TextField
              label="Enter remarks"
              value={remarks}
              onChange={handleRemarksChange}
              sx={{ fontFamily: "Montserrat" }}
            />
            <Typography sx={{fontFamily: "Montserrat"}}>Feedback: {content.review || "No feedbacks for now"}</Typography>
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "40%",
                marginLeft: "120px",
                fontFamily: "Montserrat",
                bgcolor: "#c90037",
                "&:hover": { bgcolor: "#c90037" },
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default UserEditStatus;