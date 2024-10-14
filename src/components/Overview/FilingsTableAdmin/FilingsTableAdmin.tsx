import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Modal,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import { LuClipboardEdit } from "react-icons/lu";
import { ThemeProvider } from "@mui/material/styles";
import { IoMdArrowDropdown } from "react-icons/io";
import { Assignees, FilingData } from "../../../utility/DataContext/FilingData";
import { getStatusButtonColor } from "../../../utility/statusColors";
import { theme } from "../../../utility/statusColors";
import dayjs from "dayjs";
import { RiFileWarningFill } from "react-icons/ri";
import { MdAssignmentInd } from "react-icons/md";
import profileDetails from "../../../auth/api/authApi";

interface FilingsTableAdminProps {
  filingsData: FilingData[];
  selectedDepartment: string;
  selectedMonth: number | null;
}

const FilingsTableAdmin: React.FC<FilingsTableAdminProps> = ({
  filingsData,
  selectedDepartment,
  selectedMonth,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [statusFilter, setStatusFilter] = useState<string>("Status");
  const [visibleRowCount, setVisibleRowCount] = useState<number>(5);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [review, setReview] = useState<string>("");
  const [selectedFilingId, setSelectedFilingId] = useState<number | null>(null);
  const [role, setRole] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (status: string) => {
    setStatusFilter(status);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = (filingId: number) => {
    setSelectedFilingId(filingId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setReview("");
    setSelectedFilingId(null);
  };

  const handleSubmitRemarks = async () => {
    if (!review.trim()) {
      setErrorMessage("Please enter some remarks before submitting.");
      return;
    }

    if (selectedFilingId === null) return;

    try {
      const response = await fetch(
        `https://localhost:7013/Filings/review/${selectedFilingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ review }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit remarks");
      }

      setOpenSnackbar(true);
      handleCloseModal();
    } catch (error : any) {
      console.error("Error submitting remarks:", error.message);
    }
  };

  useEffect(() => {
    const { RoleName } = profileDetails;
    setRole(RoleName);
    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;
      if (bottom) {
        setVisibleRowCount((prevCount) => prevCount + 5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredFilings = useMemo(() => {
    const sortedFilings = filingsData.slice().sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      if (a.status === "Open" && b.status === "Closed") return -1;
      if (a.status === "Closed" && b.status === "Open") return 1;
      return 0;
    });

    return sortedFilings.filter(
      (filing) =>
        (selectedDepartment === "All Departments" ||
          filing.depName === selectedDepartment) &&
        (statusFilter === "Status" ||
          filing.status.toLowerCase() === statusFilter.toLowerCase()) &&
        (selectedMonth === null ||
          new Date(filing.dueDate).getMonth() === selectedMonth)
    );
  }, [filingsData, selectedDepartment, statusFilter, selectedMonth]);
  const statuses = ["Status", "Open", "Pending", "Closed"];

  const handleStatusClick = (date: string) => {
    navigate("/", { state: { date } });
  };

  const handleFilingReassign = (filingId : number, statute : string, form : string, particulars : string, duedate : string, setdepartment : string, setname : Array<Assignees>) => {
    navigate("/admin/addfilings", {state: {filingId, statute, form, particulars, duedate, setdepartment, setname}})
  };

  console.log(filingsData);
  console.log(filteredFilings);

  const handleDownload = async (filingId: number) => {
    try {
      const response = await fetch(
        `https://localhost:7013/Document/download/${filingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download document");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `document_${filingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error : any) {
      console.error("Error downloading document:", error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          padding: 2,
          paddingLeft: "20.5%",
          paddingRight: "45px",
          marginTop: "4.5%",
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell
                  sx={{ width: 150, fontWeight: "600", textAlign: "center" }}
                >
                  Due Date
                </TableCell>
                <TableCell
                  sx={{ width: 150, fontWeight: "600", textAlign: "center" }}
                >
                  Department
                </TableCell>
                <TableCell
                  sx={{ width: 200, fontWeight: "600", textAlign: "center" }}
                >
                  Statute/Form No.
                </TableCell>
                <TableCell
                  sx={{ width: 150, fontWeight: "600", textAlign: "center" }}
                >
                  Task Owner
                </TableCell>
                <TableCell
                  sx={{ width: 150, fontWeight: "600", textAlign: "center" }}
                >
                  <Button
                    variant="text"
                    onClick={handleButtonClick}
                    sx={{
                      color: "black",
                      textTransform: "none",
                      fontWeight: "600",
                      "&:hover": {
                        bgcolor: theme.palette.primary.main,
                      },
                    }}
                  >
                    {statusFilter === "Status" ? "Status" : statusFilter}
                    <IoMdArrowDropdown />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {statuses.map((status) => (
                      <MenuItem
                        key={status}
                        onClick={() => handleMenuItemClick(status)}
                      >
                        {status}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>
                <TableCell
                  sx={{ width: 150, fontWeight: "600", textAlign: "center" }}
                >
                  Document
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFilings
                .slice(0, visibleRowCount)
                .map((filing, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {dayjs(filing.dueDate).format("DD-MMMM-YYYY")}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {filing.depName}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {filing.statuteOrAct}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {filing.assignedTo
                          .map((employee) => employee.empName)
                          .join(", ")}
                        <Tooltip title={"Re-Assign"}>
                            <Button onClick={() => handleFilingReassign(filing.filingId, filing.statuteOrAct, filing.formChallan, filing.particulars, filing.dueDate, filing.depName, filing.assignedTo)}>
                              <MdAssignmentInd
                                style={{
                                  fontSize: 22,
                                  padding: "0.5rem",
                                }}
                              />
                            </Button>
                        </Tooltip>
                      </span>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        sx={{
                          backgroundColor: getStatusButtonColor(filing.status),
                          color: "white",
                          width: "7em",
                          "&:hover": {
                            backgroundColor: "gray",
                          },
                        }}
                        onClick={() => handleStatusClick(filing.dueDate)}
                      >
                        {filing.status}
                      </Button>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        textAlign: "center",
                        paddingLeft: "29px",
                      }}
                    >
                      {filing.status === "Closed" && !filing.docIsUploaded ? (
                        <Tooltip title={"Document not uploaded"}>
                          <Box>
                            <RiFileWarningFill
                              style={{
                                fontSize: 22,
                                padding: "1em",
                                color: "red",
                              }}
                            />
                          </Box>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={
                            filing.status === "Closed"
                              ? "Give Remarks"
                              : "Edit Document"
                          }
                        >
                          <Button
                            sx={{
                              fontSize: 18,
                              padding: "1em",
                              color: "black",
                              visibility: role == "Admin" ? "block" : "hidden",
                            }}
                            disabled={
                              filing.status === "Open" ||
                              filing.status === "Pending" ||
                              !filing.docIsUploaded
                            }
                            onClick={() => handleOpenModal(filing.filingId)}
                          >
                            <LuClipboardEdit />
                          </Button>
                        </Tooltip>
                      )}
                      <Tooltip title="Download Document">
                        <Button
                          sx={{
                            fontSize: 18,
                            p: 2,
                            color:
                              filing.status === "Open" ||
                              filing.status === "Pending" ||
                              !filing.docIsUploaded
                                ? "gray"
                                : "black",
                          }}
                          disabled={
                            filing.status === "Open" ||
                            filing.status === "Pending" ||
                            !filing.docIsUploaded
                          }
                          onClick={() => handleDownload(filing.filingId)}
                        >
                          <IoMdDownload />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="remarks-modal"
        aria-describedby="modal-to-enter-remarks"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="remarks"
            label="Enter Remarks"
            type="text"
            fullWidth
            variant="outlined"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            error={!!errorMessage}
            helperText={errorMessage}
          />
          <Button
            onClick={handleSubmitRemarks}
            sx={{
              float: "right",
              mt: 2,
              backgroundColor: "#c70039",
              color: "white",
              fontSize: "0.875rem",
              padding: "6px 12px",
              "&:hover": {
                backgroundColor: "darkblue",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Remarks entered successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default FilingsTableAdmin;
