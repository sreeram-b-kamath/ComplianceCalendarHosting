import axios from "axios";

interface ProfileDetails {
  EmployeeName: string;
  Department: string;
  Email: string;
  EmployeeId: string;
  RoleName: string;
  DepartmentId: string;
  IsEnabled: boolean;

}

const profileDetails: ProfileDetails = {
  EmployeeName: "",
  Department: "",
  Email: "",
  EmployeeId: "",
  RoleName: "",
  DepartmentId: "",
  IsEnabled:true,
};

export const GetRoles = async (authToken: string | undefined) => {
  try {

    // const response = await axios.get(
    //   `http://172.16.4.89:90/api/Admin/getUserRole`, {
    //     params: {
    //       token: authToken, 
    //     },
    //   }
    // )

    // const response = await axios.get(
    //   `http://172.16.4.89:90/getUserRole`, {
    //     params: {
    //       token: authToken, 
    //     },
    //   }
    // )

    const response = await axios.get(`https://compliancecalendarbackendhosting.onrender.com/getUserRole/${authToken}`);

    // const response = await axios.get(`http://localhost:7013/getUserRole/${authToken}`);

    
    const roles = response.data;
    profileDetails.EmployeeName = roles.EmployeeName;
    profileDetails.Department = roles.department;
    profileDetails.Email = roles.employeeEmail;
    profileDetails.EmployeeId = roles.EmployeeId;
    profileDetails.RoleName = roles.roleName;
    profileDetails.DepartmentId = roles.departmentId;
    profileDetails.IsEnabled = roles.isEnabled;
    return roles;
  } catch (error) {
    console.log("Error fetching roles :: ", error);
  }
};

export default profileDetails;
