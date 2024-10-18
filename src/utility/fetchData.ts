import axios from "axios";
import { FilingData } from "./DataContext/FilingData";
import profileDetails from "../auth/api/authApi"; // Adjust the import path as needed

export const useFetchData = async (): Promise<FilingData[]> => {
    try {
        // Ensure profileDetails is populated
        if (!profileDetails.EmployeeId || !profileDetails.RoleName) {
            throw new Error("Profile details are not populated");
        }

        const { RoleName, EmployeeId } = profileDetails;

        let response;
        if (RoleName === "Admin") {
            response = await axios.get<FilingData[]>(`https://compliancecalendarbackendhosting.onrender.com/Filings/GetAdminFilings/${EmployeeId}`);
        } else {
            response = await axios.get<FilingData[]>(`https://compliancecalendarbackendhosting.onrender.com/Filings/GetUserFilings/${EmployeeId}`);
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};
