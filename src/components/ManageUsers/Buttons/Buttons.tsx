/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography, FormHelperText } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";
import profileDetails from "../../../auth/api/authApi";

type Department = {
  id: number,
  depName: string,
};

type User = {
  empName: string,
  email: string,
};

const Buttons: React.FC<{ fetchData: () => void }> = ({ fetchData }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [names, setNames] = useState<User[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [departmentError, setDepartmentError] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleDepartmentChange = (event): void => {
    setSelectedDepartment(event.target.value);
    fetchNamePerDepartment(event.target.value);
    setDepartmentError(false);  // Clear error on change
  };

  const handleNameChange = (event): void => {
    const user = names.find(name => name.empName === event.target.value);
    setSelectedUser(user || null);
    setNameError(false);  // Clear error on change
  };

  const fetchDepartment = async () => {
    const { EmployeeId } = profileDetails;
    console.log(EmployeeId);
    const response = await axios.get(`https://localhost:7013/api/Admin/GetDepartmentNamesByEmployeeId/${EmployeeId}`);
    setDepartments(response.data);
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchNamePerDepartment = async (department: string) => {
    const response = await axios.get(`https://localhost:7013/ManageUsers/GetUsersByDepartment/${department}`);
    setNames(response.data);
  };

  const addUser = async () => {
    if (!selectedDepartment) {
      setDepartmentError(true);
    }
    if (!selectedUser) {
      setNameError(true);
    }

    if (selectedUser && selectedDepartment) {
      const userDto = {
        EmpName: selectedUser.empName,
        Email: selectedUser.email,
        DepartmentName: selectedDepartment,
      };
      try {
        const response = await axios.post('https://localhost:7013/ManageUsers/AddUserToEmployeeTable', userDto);
        handleClose();
        fetchData();
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<GroupIcon />}
        sx={{ bgcolor: "#C70039", "&:focus": { outline: "none" }, "&:hover": { bgcolor: "#C70039" } }}
        onClick={handleOpen}
      >
        <Typography sx={{ textTransform: 'none', fontFamily: "Montserrat" }}>Add User</Typography>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ height: "fit-content", width: '50%' }}
      >
        <Box sx={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box
            sx={{ bgcolor: "white", display: "flex", flexDirection: "column", color: "black", borderRadius: "5px", width: "50vw", height: "40vh", padding: 3 }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', marginTop: '3%', marginLeft: "10px", fontFamily: "Montserrat" }}>
              Add User
            </Typography>
            <>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <FormControl sx={{ width: "45%", margin: '0 auto', marginTop: '5%' }} error={departmentError}>
                  <InputLabel id="department-select-label">Department</InputLabel>
                  <Select
                    labelId="department-select-label"
                    id="department-select"
                    variant="outlined"
                    label="Department"
                    name="Department"
                    sx={{ width: "100%" }}
                    value={selectedDepartment || ""}
                    onChange={handleDepartmentChange}
                  >
                    {departments.map((department: Department) => (
                      <MenuItem key={department.depName} value={department.depName}>{department.depName}</MenuItem>
                    ))}
                  </Select>
                  {departmentError && <FormHelperText>Please select a department.</FormHelperText>}
                </FormControl>

                <FormControl sx={{ width: "45%", margin: '0 auto', marginTop: '5%' }} error={nameError}>
                  <InputLabel id="name-select-label">Name</InputLabel>
                  <Select
                    labelId="name-select-label"
                    id="name-select"
                    variant="outlined"
                    label="Name"
                    name="Name"
                    sx={{ width: "100%" }}
                    value={selectedUser ? selectedUser.empName : ""}
                    onChange={handleNameChange}
                  >
                    {names.map((name: User) => (
                      <MenuItem key={name.empName} value={name.empName}>{name.empName}</MenuItem>
                    ))}
                  </Select>
                  {nameError && <FormHelperText>Please select a name.</FormHelperText>}
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: "row", gap: 3, justifyContent: "center", marginTop: '7%' }}>
                <Button variant="outlined" color="error" onClick={handleClose}>
                  <Typography sx={{ fontFamily: "Montserrat" }}>CLOSE</Typography>
                </Button>
                <Button variant="contained" onClick={addUser} sx={{ bgcolor: "#c90037", "&:hover": { bgcolor: "#c90037" }, textTransform: "none" }}>
                  <Typography sx={{ fontFamily: "Montserrat" }}>APPLY</Typography>
                </Button>
              </Box>
            </>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Buttons;
