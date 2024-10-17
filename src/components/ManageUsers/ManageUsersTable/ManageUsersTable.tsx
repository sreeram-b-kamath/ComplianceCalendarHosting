import { alpha, styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  Modal,
  Switch,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { pink } from "@mui/material/colors";
import profileDetails from "../../../auth/api/authApi";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink[600],
    "&:hover": {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: pink[600],
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "gray",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type Departments = {
  department: string;
}[];

type EmployeeData = {
  employeeId: number;
  empName: string;
  email: string;
  departmentName: Departments;
  isEnabled: boolean;
};

// type Department = {
//   id: number;
//   depName: string;
// };

const ManageUsersTable: React.FC<{ fetchData: () => void }> = ({
  fetchData,
}) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [users, setUsers] = useState<EmployeeData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState<boolean>(false);
  const [enableOpen, setEnableOpen] = useState<boolean>(false);
  const [deleteUsers, setDeleteUsers] = useState<{ id: number; name: string }>({
    id: 0,
    name: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    if (event) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchUsers = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get(
        `http://172.16.4.89:90/ManageUsers/${profileDetails.EmployeeId}`
      ); // Adjust API endpoint

      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch data when component mounts
  }, [fetchData]);

  const handleAssignTask = (name: string, department: string) => {
    navigate("/admin/addfilings", { state: { name, department } }); // Pass data to addFilings page
  };

  const handleDeleteUser = (id: number) => {
    // Write update api to update the
    axios
      .put(`http://172.16.4.89:90/ManageUsers/${id}?adminId=${profileDetails.EmployeeId}`)
      .then(() => {
        fetchData(); // Refresh data
        setSnackbarMessage("User status updated successfully");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Failed to update user status", error);
        setSnackbarMessage("Failed to disable user");
        setSnackbarOpen(true);
      });
    setOpen(false);
    setEnableOpen(false);
  };

  // const handleOpen = (id: number, name: string) => {
  //   setDeleteUsers({ id, name });
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>, id: number, name: string) => {
    setDeleteUsers({ id, name });
    const isEnabled = event.target.checked;
    if (isEnabled) {
      //Code to do something...
      setEnableOpen(true);
    } else {
      //Code disable user..
      setOpen(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper>
            <TableContainer>
              <Table sx={{ width: "78vw" }} aria-label="customized table">
                <TableHead>
                  <TableRow sx={{ fontWeight: "bold" }}>
                    <StyledTableCell
                      align="center"
                      sx={{ fontFamily: "Montserrat" }}
                    >
                      Name
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ fontFamily: "Montserrat" }}
                    >
                      Email
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ fontFamily: "Montserrat" }}
                    >
                      Department
                    </StyledTableCell>
                    <StyledTableCell
                      colSpan={2}
                      align="center"
                      sx={{ fontFamily: "Montserrat" }}
                    >
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <StyledTableRow key={user.employeeId}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ fontFamily: "Montserrat" }}
                        >
                          {user.empName}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ fontFamily: "Montserrat" }}
                        >
                          {user.email}
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ fontFamily: "Montserrat" }}>
                          {user.departmentName.map(dep => dep.department).join(", ")} {/* Extracting department names */}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ fontFamily: "Montserrat" }}
                        >
                          <Tooltip title="Assign">
                            <IconButton
                              disabled={!user.isEnabled}
                              onClick={() =>
                                handleAssignTask(
                                  user.empName,
                                  user.departmentName.toString()
                                )
                              }
                            >
                              <AssignmentIndIcon
                                sx={
                                  user.isEnabled
                                    ? { color: "red" }
                                    : { color: "gray" }
                                }
                              />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ fontFamily: "Montserrat" }}
                        >
                          <Tooltip
                            title={user.isEnabled ? "Disable" : "Enable"}
                          >
                            <PinkSwitch
                              checked={user.isEnabled}
                              onChange={(e) =>
                                handleChangeSwitch(
                                  e,
                                  user.employeeId,
                                  user.empName
                                )
                              }
                            />
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ height: "fit-content", width: "50%" }}
          >
            <Box
              sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  bgcolor: "white",
                  display: "flex",
                  flexDirection: "column",
                  color: "black",
                  borderRadius: "5px",
                  width: "50vw",
                  height: "40vh",
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    margin: 3,
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  }}
                >
                  Disable user
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: 3, p: 4 }}
                >
                  <Typography variant="body1" component="p" sx={{ fontFamily: "Montserrat" }}>
                    Are you sure you want to disable{" "}
                    <span style={{ color: "#c70039" }}>
                      <b>{deleteUsers.name}</b>
                    </span>
                    ? This user may have several filings and they will be assigned to you.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    justifyContent: "flex-end",
                    px: 5,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClose}
                  //Not disable or enable
                  >
                    <Typography sx={{ fontFamily: "Montserrat" }}>
                      No
                    </Typography>
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#c90037",
                      "&:hover": { bgcolor: "#c90037" },
                    }}
                    onClick={() => handleDeleteUser(deleteUsers.id)} //Disable
                  >
                    <Typography sx={{ fontFamily: "Montserrat" }}>
                      Yes
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
          <Modal
            open={enableOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ height: "fit-content", width: "50%" }}
          >
            <Box
              sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  bgcolor: "white",
                  display: "flex",
                  flexDirection: "column",
                  color: "black",
                  borderRadius: "5px",
                  width: "50vw",
                  height: "40vh",
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    margin: 3,
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  }}
                >
                  Enable user
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: 3, p: 4 }}
                >
                  <Typography variant="body1" component="p" sx={{ fontFamily: "Montserrat" }}>
                    Are you sure you want to Enable{" "}
                    <span style={{ color: "#c70039" }}>
                      <b>{deleteUsers.name}</b>
                    </span>
                    ?
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    justifyContent: "flex-end",
                    px: 5,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClose} //Not disable or enable
                  >
                    <Typography>No</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#c90037",
                      "&:hover": { bgcolor: "#c90037" },
                    }}
                    onClick={() => handleDeleteUser(deleteUsers.id)} //Enable
                  >
                    <Typography>Yes</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
          />
        </>
      )}
    </>
  );
};

export default ManageUsersTable;
