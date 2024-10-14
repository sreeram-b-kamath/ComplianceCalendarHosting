import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Modal,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Tooltip,
  Switch,
  alpha,
  styled,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

import { pink } from "@mui/material/colors";


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


interface Admin {
  employeeId: number;
  empName: string;
  email: string;
  departmentName: string;
  isEnabled: boolean;
}

type Department = {
  id: number;
  depName: string;
};

const AdminList: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [enableOpen, setEnableOpen] = useState<boolean>(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const [usersInDepartment, setUsersInDepartment] = useState<Admin[]>([]);
  const [selectedUser, setSelectedUser] = useState<Admin | null>(null);
  const [deleteUsers, setDeleteUsers] = useState<{ id: number; name: string }>({
    id: 0,
    name: "",
  });

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("https://localhost:7013/api/Admin");
      console.log(response.data);
      setAdmins(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    
    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const fetchUsersInDepartment = async (id: number) => {
    try {
      const response = await axios.get(
        `https://localhost:7013/api/Admin/GetEmployeesByDepartmentId/${id}`
      );
      setUsersInDepartment(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsersInDepartment([]);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEnableOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setSelectedDepartmentId(null);
  };

  const handleOpenDeleteDialog = (admin: Admin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setAdminToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleUpdateAdmin = (id: number) => {
    console.log("Employee ID : " + id);
    // Write update api to update the
    axios
      .put(`https://localhost:7013/api/Admin/${id}`)
      .then(() => {
        console.log("User status updated successfully");
        fetchAdmins(); // Refresh data
      })
      .catch((error) => {
        console.error("Failed to update user status", error);
      });

    //setIsEnabled(isEnabled);
    console.log("User Disabled successfully");
    //console.log(event?.target.checked);
    //setIsEnabled(event.target.checked);
    setOpen(false);
    setEnableOpen(false);
  };

  const handleChangeSwitch = (id: number, name: string) => {
    setDeleteUsers({ id, name });
    const isEnabled = event.target.checked;
    console.log(isEnabled);
    if (isEnabled) {
      //Code to do something...
      console.log("A :", isEnabled);
      setEnableOpen(true);
    } else {
      //Code disable user..
      console.log("B :", isEnabled);
      setOpen(true);
    }
  };

  const handleDeleteAdmin = async () => {
    if (adminToDelete) {
      try {
        await axios.delete(
          `https://localhost:7013/api/Admin/${adminToDelete.employeeId}`
        );
        const updatedAdmins = admins.filter(
          (admin) => admin.employeeId !== adminToDelete.employeeId
        );
        setAdmins(updatedAdmins);
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedDepartmentId && selectedUser) {
      const department = departments.find(
        (dept) => dept.id === selectedDepartmentId
      );

      if (department) {
        const userDto = {
          empName: selectedUser.empName,
          email: selectedUser.email,
          departmentName: department.depName,
        };

        try {
          const response = await axios.post(
            "https://localhost:7013/api/Admin/AddAdmin",
            userDto
          );
          const newAdmin = { ...userDto, employeeId: response.data.employeeId };
          setAdmins([...admins, newAdmin]);
          handleCloseModal();
        } catch (error) {
          console.error("Error adding admin:", error);
        }
      }
    }
  };

  return (
    <div
      style={{ padding: "20px", paddingTop: "80px", fontFamily: "Montserrat" }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Montserrat", fontWeight: "600" }}
              >
                Admins
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                style={{ float: "right", marginBottom: "10px" }}
                onClick={handleOpenModal}
                sx={{
                  fontFamily: "Montserrat",
                  textTransform: "none",
                  bgcolor: "#c70039",
                  "&:hover": { bgcolor: "#c70039" },
                }}
              >
                Add Admin
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper} sx={{ marginBottom: "100px" }}>
            <Table>
              <TableHead sx={{ height: "5px", bgcolor: "#d9d9d9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontFamily: "Montserrat" }}>
                    Employee's Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: "Montserrat" }}>
                    Email Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: "Montserrat" }}>
                    Department
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: "Montserrat" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.employeeId}>
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      {admin.empName}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      {admin.email}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      {admin.departmentName}
                    </TableCell>
                    {/* <TableCell sx={{ fontFamily: "Montserrat" }}>
                      <IconButton
                        onClick={() => handleOpenDeleteDialog(admin)}
                        sx={{ color: "#c70039" }}
                      >
                        
                        <Delete />
                      </IconButton>
                    </TableCell> */}
                    <TableCell sx={{ fontFamily: "Montserrat" }}>
                      {/* We need to change this into Toggle */}
                      <Tooltip
                            title={admin.isEnabled ? "Disable" : "Enable"}
                          >
                            
                            <PinkSwitch
                              checked={admin.isEnabled}
                              onChange={() =>
                                //handleOpen(user.employeeId, user.empName)
                                handleChangeSwitch(
                                  admin.employeeId,
                                  admin.empName
                                )
                              }
                            />
                            {/* <Typography variant="caption">Enable</Typography>
                            </Stack> */}
                            {/* </IconButton> */}
                          </Tooltip>
                      {/* Stop Toggle */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Modal open={modalOpen} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" component="h2">
                Add Admin
              </Typography>
              <form>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="departmentName"
                    value={
                      selectedDepartmentId
                        ? departments.find(
                            (dept) => dept.id === selectedDepartmentId
                          )?.depName || ""
                        : ""
                    }
                    onChange={(event) => {
                      const department = departments.find(
                        (dept) => dept.depName === event.target.value
                      );
                      if (department) {
                        setSelectedDepartmentId(department.id);
                        fetchUsersInDepartment(department.id);
                      }
                    }}
                    displayEmpty
                  >
                    {departments.map((department) => (
                      <MenuItem key={department.id} value={department.depName}>
                        {department.depName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Admins</InputLabel>
                  <Select
                    name="empName"
                    value={selectedUser ? selectedUser.empName : ""}
                    onChange={(event) => {
                      const user = usersInDepartment.find(
                        (u) => u.empName === event.target.value
                      );
                      setSelectedUser(user || null);
                    }}
                    displayEmpty
                  >
                    {usersInDepartment.length === 0 ? (
                      <MenuItem disabled>No Admins Found</MenuItem>
                    ) : (
                      usersInDepartment.map((user) => (
                        <MenuItem key={user.email} value={user.empName}>
                          {user.empName}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                <DialogActions>
                  <Button
                    onClick={handleSubmit}
                    sx={{
                      fontFamily: "Montserrat",
                      bgcolor: "#c70039",
                      color: "white",
                      "&:hover": { bgcolor: "#c70039" },
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={handleCloseModal}
                    sx={{ color: "#c70039", fontFamily: "Montserrat" }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </form>
            </Box>
          </Modal>

          <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this admin?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button onClick={handleDeleteAdmin} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Modal here */}
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
                  borderRadius: "10px",
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
                  Disable admin
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: 3, p: 4 }}
                >
                  <Typography variant="body" component="p">
                    Are you sure you want to disable{" "}
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
                    variant="contained"
                    sx={{
                      bgcolor: "#4caf50",
                      "&:hover": { bgcolor: "#4caf50" },
                    }}
                    onClick={() => handleUpdateAdmin(deleteUsers.id)} //Disable
                  >
                    <Typography>Yes</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose} //Not disable or enable
                  >
                    <Typography>No</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
          {/* Modal ends here */}

          {/* Enable Modal here */}
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
                  borderRadius: "10px",
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
                  Enable admin
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: 3, p: 4 }}
                >
                  <Typography variant="body" component="p">
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
                    variant="contained"
                    sx={{
                      bgcolor: "#4caf50",
                      "&:hover": { bgcolor: "#4caf50" },
                    }}
                    onClick={() => handleUpdateAdmin(deleteUsers.id)} //Enable
                  >
                    <Typography>Yes</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose} //Not disable or enable
                  >
                    <Typography>No</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
          {/* Modal Enable ends here */}
    </div>
  );
};

export default AdminList;