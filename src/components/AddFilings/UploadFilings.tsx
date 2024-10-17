import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Snackbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import profileDetails from "../../auth/api/authApi";

interface UploadComponentProps {
  onClose: () => void;
  onUploadSuccess: () => void; // Callback for successful upload
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onClose, onUploadSuccess }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const handleDrop = (acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: true,
  });

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      setSnackbarMessage("No files to upload");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("file", file); 
    });
    formData.append("createdById", profileDetails.EmployeeId.toString());

    try {
      const response = await fetch("http://172.16.4.89:90/Filings/UploadFilings/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSnackbarMessage("Upload successful");
        setSnackbarOpen(true);
        onUploadSuccess(); // Notify the successful upload
        onClose(); // Close the modal after successful upload
      } else {
        const errorData = await response.json();
        setSnackbarMessage(`Error: ${errorData.title}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(`Error: ${error}`);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{fontFamily: "Montserrat"}}>
        Upload Files
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "background.paper"}}>
        <Box className="upload-container" sx={{ p: 2 }}>
          <Box
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
            sx={{
              border: "2px dashed #ccc",
              borderRadius: "5px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              color: "#C70039"
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <FaCloudUploadAlt style={{ fontSize: 50 }} />
            ) : (
              <FaCloudUploadAlt style={{ fontSize: 50 }} />
            )}
          </Box>

          <Box sx={{ mt: 2, display: "flex", textAlign: "center", flexDirection: "column" }}>
            <Typography variant="h6" sx={{fontFamily: "Montserrat"}}>Uploaded Files:</Typography>
            {uploadedFiles.length > 0 ? (
              <ul >
                {uploadedFiles.map((file, index) => (
                  <li key={index} style={{ listStyle: "none",fontFamily: "Montserrat"}}>
                    <Typography>{file.name}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography sx={{fontFamily: "Montserrat"}}>No files uploaded</Typography>
            )}
          </Box>  
          <DialogActions>
        <Button
          sx={{ bgcolor: "#c70039",fontFamily: "Montserrat",marginLeft:"50%", "&:hover": { backgroundColor: '#808080' } }}
          variant="contained"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </DialogActions>
        </Box>
      </DialogContent>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default UploadComponent;
