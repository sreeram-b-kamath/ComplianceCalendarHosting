import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  Modal,
  Typography,
  Autocomplete,
  Select,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import UploadComponent from "./UploadFilings";
import { theme } from "../../utility/statusColors";
import { useLocation } from "react-router-dom";
import profileDetails from "../../auth/api/authApi";
// Types for the form values and user
interface Department {
  id: number;
  depName: string;
  employees: User[];
}

interface User {
  empName: string;
  employeeId: number; // Adjusted to include empId
}

interface AddFilingsProps {
  selectedDepartment: string;
  selectedUser: string;
}

interface FormValues {
  statuteOrAct: string;
  formChallan: string;
  particulars: string;
  dueDate: Dayjs | null;
  depName: string;
  assignedToList: User[];
  createdById: string;
  recurrence: string ;
}

// Validation schema
const validationSchema = Yup.object({
  statuteOrAct: Yup.string()
    .required("Statute/Act is required")
    .min(5, "Statute/Act must be at least 5 characters long")
    .max(50, "Statute/Act cannot be longer than 50 characters"),
  formChallan: Yup.string().required("Form/Challan No. is required"),
  particulars: Yup.string()
    .required("Particulars are required")
    .max(200, "Particulars cannot be longer than 200 characters"),
  dueDate: Yup.date().required("Due Date is required").nullable(),
  depName: Yup.string().required("Department is required"),
  assignedToList: Yup.array()
    .min(1, "At least one assignee is required")
    .required("Assignees are required"),
  recurrence: Yup.string().required("Recurrence is required"),
});

const AddFilings: React.FC<AddFilingsProps> = ({
  selectedDepartment,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedUser,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employee, setEmployee] = useState<User[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const [uploadSnackbarOpen, setUploadSnackbarOpen] = useState<boolean>(false);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<
    string | null
  >(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const EmployeeId = profileDetails.EmployeeId;
  const [navigationFlag, setNavigationFlag] = useState<boolean>(false);

  const handleUploadOpen = () => setUploadOpen(true);
  const handleUploadClose = () => setUploadOpen(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, department } = location.state || { name: "", department: "" };
  const {
    filingId,
    statute,
    form,
    particulars,
    duedate,
    setdepartment,
    setname,
    recurrence,
  } = location.state || {
    filingId: null,
    statute: "",
    form: "",
    particulars: "",
    duedate: null,
    setdepartment: "",
    setname: "",
    recurrence: "",
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7013/api/Admin/GetDepartmentNamesByEmployeeId/${EmployeeId}`
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, [name]);

  const fetchUsersInDepartment = async (selectedDepartmentName: string) => {
    try {
      const response = await axios.get(
        `https://localhost:7013/api/Admin/GetEmployeesByDepartmentName/${selectedDepartmentName}`
      );
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setEmployee([]);
    }
  };

  useEffect(() => {
    if (department) {
      formik.setFieldValue("depName", department);
      setSelectedDepartmentName(department);
      fetchUsersInDepartment(department);
    }
    if (name) {
      setSelectedUserName(name);
      formik.setFieldValue("assignedToList", [name]);
    }
  }, [department, name]);

  useEffect(() => {
    // Update form fields if state values are available
    if (filingId) setNavigationFlag(true);
    if (statute) formik.setFieldValue("statuteOrAct", statute);
    if (form) formik.setFieldValue("formChallan", form);
    if (particulars) formik.setFieldValue("particulars", particulars);
    if (duedate) formik.setFieldValue("dueDate", dayjs(duedate));
    if (setdepartment) formik.setFieldValue("depName", setdepartment);
    if (recurrence) formik.setFieldValue("recurrence", recurrence);
    setSelectedDepartmentName(setdepartment);
    if (setname) {
      const selectedUser = employee.find((user) => user.empName === setname);
      if (selectedUser) {
        formik.setFieldValue("assignedToList", [selectedUser]);
      }
      if (filingId) setNavigationFlag(true);
    }
  }, [statute]);

  useEffect(() => {
    if (setdepartment) {
      setSelectedDepartmentName(setdepartment);
      fetchUsersInDepartment(setdepartment);
    }
  }, [setdepartment]);

  const formik = useFormik<FormValues>({
    initialValues: {
      statuteOrAct: "",
      formChallan: "",
      particulars: "",
      dueDate: null,
      depName: selectedDepartment || "",
      assignedToList: [],
      createdById: profileDetails.EmployeeId,
      recurrence: "No recurrence",
    },
    validationSchema,
    onSubmit: (values: FormValues) => {
      const formDataWithAssignees: FormValues = {
        ...values,
      };
      setFormData(formDataWithAssignees);
      handleOpen();
    },
  });

  const handleDepartmentChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedDepName = event.target.value as string;
    const department = departments.find(
      (dept) => dept.depName === selectedDepName
    );

    if (department) {
      setSelectedDepartmentName(department.depName); // Set the department ID
      fetchUsersInDepartment(department.depName); // Fetch users by department ID
      formik.setFieldValue("depName", selectedDepName);
      formik.setFieldValue("assignedToList", []); // Clear existing assignees
    } else {
      formik.setFieldValue("depName", "");
      setEmployee([]);
      formik.setFieldValue("assignedToList", []);
    }
  };

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (formData) {
      try {
        if (navigationFlag == false) {
          
          await axios.post(
            "https://localhost:7013/Filings/AddFilings",
            formData
          );

          // Ensure all required fields are defined
          if (!formData.dueDate) {
            console.error("Due Date is missing in formData");
            return;
          }
        }
        else {
          const employeeId = formData.assignedToList[0]?.employeeId; // Ensure employeeId is available
          if (employeeId) {
            const response = await axios.post(
              `https://localhost:7013/Filings/reassign/${filingId}?employeeId=${employeeId}`,
              formData
            );
          } else {
            console.error("Employee ID is missing in formData.assignedToList");
          }
          setNavigationFlag(false);
        }

        // Prepare notification requests
        const notificationRequests = formData.assignedToList.map((user) => {
          if (!user.employeeId) {
            console.error("Employee ID is missing for user:", user);
            return Promise.resolve(); // Skip this request
          }

          const queryString = new URLSearchParams({
            empId: user.employeeId.toString(),
            particulars: formData.particulars || "",
            dueDate: dayjs(formData.dueDate).format("YYYY-MM-DD") || "",
          }).toString();

          return axios
            .post(`https://localhost:7013/api/Notification?${queryString}`)
            .catch((error) => {
              console.error(
                "Error sending notification for user ID:",
                user.employeeId,
                error
              );
            });
        });
        // Execute all notification requests
        const notificationResponses = await Promise.all(notificationRequests);
        // Show success message and reload page
        setSnackbarOpen(true);
        handleClose();
        formik.resetForm(); // Reset the form
      } catch (error : any) {
        // Log error details
        console.error(
          "Error submitting form data:",
          error.response || error.message
        );
        // Display a user-friendly message
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleUploadSuccess = () => {
    setUploadSnackbarOpen(true);
    handleUploadClose();
  };

  const handleUploadSnackbarClose = () => {
    setUploadSnackbarOpen(false);
  };

  return (
    <Box sx={{ fontFamily: "Montserrat" }}>
      <Box
        sx={{
          pt: 8,
          pl: 10,
          marginLeft: 10,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <h3
          style={{
            marginLeft: "9em",
            display: "flex",
            alignItems: "center",
            color: "black",
            fontFamily: "Montserrat",
          }}
        >
          Add Filings
        </h3>
        <h5 style={{ marginLeft: "31%" }}>
          <a
            href="../../src/assets/Filingstemplate.xlsx"
            target="_blank"
            download
            style={{ textDecoration: "underline", color: "black" }}
          >
            <Button
              style={{
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                color: "black",
                fontFamily: "Montserrat",
                backgroundColor: "#f9f6fd",
              }}
            >
              Download Template{" "}
              <GetAppRoundedIcon sx={{ fontSize: 17, p: 0.5 }} />
            </Button>
          </a>
        </h5>
        <h5 style={{ marginLeft: "3%" }}>
          <Button
            onClick={handleUploadOpen}
            style={{
              textTransform: "none",
              textDecoration: "underline",
              display: "flex",
              alignItems: "center",
              color: "black",
              fontFamily: "Montserrat",
              backgroundColor: "#f9f6fd",
            }}
          >
            Upload Excel Doc{" "}
            <PublishRoundedIcon sx={{ fontSize: 17, p: 0.5 }} />
          </Button>
        </h5>
      </Box>

      <form
        onSubmit={formik.handleSubmit}
        style={{ marginLeft: "14%", fontFamily: theme.typography.fontFamily }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "3%",
          }}
        >
          <TextField
            sx={{  width: "35%" }}
            id="statuteOrAct"
            name="statuteOrAct"
            label="Enter the Statute/Act"
            variant="outlined"
            value={formik.values.statuteOrAct}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.statuteOrAct && Boolean(formik.errors.statuteOrAct)
            }
            helperText={
              formik.touched.statuteOrAct && formik.errors.statuteOrAct
            }
          />
          <TextField
            sx={{ width: "35%" }}
            id="formChallan"
            name="formChallan"
            label="Form/Challan No."
            variant="outlined"
            value={formik.values.formChallan}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.formChallan && Boolean(formik.errors.formChallan)
            }
            helperText={formik.touched.formChallan && formik.errors.formChallan}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "3%",
            marginTop: 2,
          }}
        >
          <TextField
            sx={{  width: "35%" }}
            id="particulars"
            name="particulars"
            label="Particulars"
            variant="outlined"
            value={formik.values.particulars}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.particulars && Boolean(formik.errors.particulars)
            }
            helperText={formik.touched.particulars && formik.errors.particulars}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              disablePast
              sx={{ width: "35%" }}
              label="Due Date"
              value={formik.values.dueDate}
              onChange={(date) => formik.setFieldValue("dueDate", date)}
              renderInput={(params : any) => (
                <TextField
                  {...params}
                  sx={{ margin: 2, width: "35%" }}
                  error={
                    formik.touched.dueDate && Boolean(formik.errors.dueDate)
                  }
                  helperText={formik.touched.dueDate && formik.errors.dueDate}
                />
              )}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "3%",
            marginTop: 2,
          }}
        >
          <FormControl
            sx={{ width: "35%" }}
            error={formik.touched.depName && Boolean(formik.errors.depName)}
          >
            <InputLabel>Department</InputLabel>
            <Select
              id="depName"
              name="depName"
              value={formik.values.depName}
              onChange={handleDepartmentChange}
              onBlur={formik.handleBlur}
              label="Department"
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.depName}>
                  {department.depName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formik.touched.depName && formik.errors.depName}
            </FormHelperText>
          </FormControl>

          <FormControl sx={{ width: "35%" }}>
            <Autocomplete
              multiple
              id="assignedToList"
              options={employee}
              getOptionLabel={(option) => option.empName}
              value={formik.values.assignedToList}
              onChange={(_event, value) => {
                formik.setFieldValue("assignedToList", value);
                formik.setFieldTouched("assignedToList", true, false);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Assign To"
                  placeholder="Select Assignees"
                  error={
                    formik.touched.assignedToList &&
                    Boolean(formik.errors.assignedToList)
                  }
                  helperText={
                    formik.touched.assignedToList &&
                    formik.errors.assignedToList
                  }
                />
              )}
            />
          </FormControl>
        </Box>

        <Box
          sx={{
            marginTop: 2,
            marginLeft:15
          }}
        >
          <FormControl
            sx={{marginLeft:3.5,width: "39.5%"}}
            error={formik.touched.recurrence && Boolean(formik.errors.recurrence)}
          >
            <InputLabel>Recurrence</InputLabel>
            <Select
              id="recurrence"
              name="recurrence"
              value={formik.values.recurrence}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Recurrence"
            >
              <MenuItem value="No recurrence">No recurrence</MenuItem>
              <MenuItem value="1 month">1 month</MenuItem>
              <MenuItem value="3 months">3 months</MenuItem>
              <MenuItem value="6 months">6 months</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.recurrence && formik.errors.recurrence}
            </FormHelperText>
          </FormControl>



        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!formik.isValid || !formik.dirty}
            sx={{
              width: 150,
              fontFamily: "Montserrat",
              bgcolor: formik.isValid && formik.dirty ? "#c70039" : "#cccccc",
              "&:hover": {
                backgroundColor:
                  formik.isValid && formik.dirty ? "#c70039" : "#cccccc",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </form>

      {/* Confirm Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            margin: "10em 25em",
            borderRadius: "5px",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontFamily: "Montserrat" }}
          >
            Confirm Submission
          </Typography>
          <Typography sx={{ mt: 2, fontFamily: "Montserrat" }}>
            Are you sure you want to submit the form?
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              fontFamily: "Montserrat",
            }}
          >
            <Button
              onClick={handleClose}
              sx={{ mr: 2, fontFamily: "Montserrat", color: "c70039" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              color="primary"
              sx={{
                fontFamily: "Montserrat",
                bgcolor: "#c70039",
                "&:hover": { backgroundColor: "#808080" },
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for Success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Form submitted successfully!"
      />

      {/* Upload Snackbar */}
      <Snackbar
        open={uploadSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleUploadSnackbarClose}
        message="File uploaded successfully!"
      />

      {/* Upload Component Modal */}
      <Modal open={uploadOpen} onClose={handleUploadClose}>
        <UploadComponent
          onClose={handleUploadClose}
          onUploadSuccess={handleUploadSuccess}
        />
      </Modal>
    </Box>
  );
};

export default AddFilings;
