/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import ClosedFilingProgress from "./ClosedFilingProgress";
import OpenFilingProgress from "./OpenFilingProgress";
import PendingFilingProgress from "./PendingFilingProgress";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  CircularProgress,
} from "@mui/material";
import FilingsTableAdmin from "../FilingsTableAdmin/FilingsTableAdmin";
import { FilingData } from "../../../utility/DataContext/FilingData";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import profileDetails from "../../../auth/api/authApi";
import { useLocation } from "react-router-dom";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

const YearlyOverviewCards: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [filingsData, setFilingsData] = useState<FilingData[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [openFilingsCount, setOpenFilingsCount] = useState<number>(0);
  const [pendingFilingsCount, setPendingFilingsCount] = useState<number>(0);
  const [closedFilingsCount, setClosedFilingsCount] = useState<number>(0);
  const [totalFilingsCount, setTotalFilingsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");

  const location = useLocation();
  const { filingId } = location.state || { filingId: "" };
  const deletedFilingId = filingId;
  console.log(deletedFilingId);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { RoleName, EmployeeId } = profileDetails;
        setRole(RoleName);

        let response;
        if (RoleName === "Admin") {
          response = await fetch(`https://localhost:7013/Filings/GetAdminFilings/${EmployeeId}?year=${selectedYear}`);
        } else {
          response = await fetch(`https://localhost:7013/Filings/GetUserFilings/${EmployeeId}?year=${selectedYear}`);
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setFilingsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, deletedFilingId]);

  useEffect(() => {
    const calculateCounts = (
      data: FilingData[],
      department: string,
      month: number | null
    ) => {
      const filteredData = data.filter((item: FilingData) => {
        const dueDate = new Date(item.dueDate);
        return (
          (month === null || dueDate.getMonth() === month) &&
          (department === "All Departments" || item.depName === department)
        );
      });

      const openCount = filteredData.filter(
        (filing) => filing.status === "Open"
      ).length;
      const pendingCount = filteredData.filter(
        (filing) => filing.status === "Pending"
      ).length;
      const closedCount = filteredData.filter(
        (filing) => filing.status === "Closed"
      ).length;
      const totalCount = filteredData.length;

      setOpenFilingsCount(openCount);
      setPendingFilingsCount(pendingCount);
      setClosedFilingsCount(closedCount);
      setTotalFilingsCount(totalCount);
    };

    calculateCounts(filingsData, selectedDepartment, selectedMonth);
  }, [selectedDepartment, selectedMonth, filingsData]);

  const handleChangeDepartment = (event: SelectChangeEvent<string>) => {
    setSelectedDepartment(event.target.value as string);
  };

  const handleChangeMonth = (event: SelectChangeEvent<string>) => {
    const value = event.target.value === "" ? null : Number(event.target.value);
    setSelectedMonth(value);
  };

  const handleChangeYear = (event: SelectChangeEvent<string>) => {
    const selectedRange = event.target.value;
    const year = parseInt(selectedRange.split(" - ")[0], 10);
    setSelectedYear(year);
  };

  const monthsInFinancialYear = Array.from({ length: 12 }, (_, index) => ({
    value: index,
    label: new Date(currentYear, index, 1).toLocaleString("default", {
      month: "long",
    }),
  }));

  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  const yearRanges = years.map((year) => ({
    value: year,
    label: `${year} - ${year + 1}`,
  }));

  const departments = [
    "All Departments",
    ...[...new Set(filingsData.map((filing) => filing.depName))],
  ];

  const generateReport = () => {
    const doc = new jsPDF();
    const reportTitle = "Yearly Overview Report";
    const fontSize = 25;
    const textWidth = (doc.getStringUnitWidth(reportTitle) * fontSize) / doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPos = (pageWidth - textWidth) / 2;

    doc.setFontSize(25);
    doc.setFont("helvetica", "bold");
    doc.text(reportTitle, xPos, 22);
    doc.setFontSize(12);
    doc.setFont("normal");
    doc.text(`Department: ${selectedDepartment}`, 14, 30);
    doc.text(
      `Month: ${
        selectedMonth === null
          ? "All Months"
          : monthsInFinancialYear[selectedMonth].label
      }`,
      14,
      36
    );
    doc.text(`Year: ${selectedYear} - ${selectedYear + 1}`, 14, 42);

    filingsData.sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      if (a.status === "Open" && b.status === "Closed") return -1;
      if (a.status === "Closed" && b.status === "Open") return 1;
      return 0;
    });

    autoTable(doc, {
      startY: 50,
      head: [["Open Filings", "Pending Filings", "Closed Filings", "Total Filings"]],
      body: [[openFilingsCount, pendingFilingsCount, closedFilingsCount, totalFilingsCount]],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["SL.No", "Department", "Statute/Act", "Task owner", "Status", "Due Date"]],
      body: filingsData
        .filter(
          (filing) =>
            (selectedDepartment === "All Departments" ||
              filing.depName === selectedDepartment) &&
            (selectedMonth === null ||
              new Date(filing.dueDate).getMonth() === selectedMonth)
        )
        .map((filing, index) => [
          index + 1,
          filing.depName,
          filing.statuteOrAct,
          filing.assignedTo,
          filing.status,
          new Date(filing.dueDate).toLocaleDateString(),
        ]),
      didParseCell: (data) => {
        if (data.section === "body" && data.cell.raw === "Pending") {
          data.cell.styles.textColor = "#C70039"; // Red background for Pending rows
        } else if (data.section === "body" && data.cell.raw === "Open") {
          data.cell.styles.textColor = "#0d6efd"; // Blue background for Open rows
        } else if (data.section === "body" && data.cell.raw === "Closed") {
          data.cell.styles.textColor = "#198754"; // Green background for Closed rows
        }
      },
    });

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    );

    doc.save(`Yearly-Overview-Report-${new Date().toLocaleDateString()}.pdf`);
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
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            marginLeft: "17%",
            paddingTop: "80px",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box
              sx={{
                width: role === "Admin" ? "33%" : "46%",
                textAlign: "start",
                marginLeft: "45px",
                fontSize: "20px",
                fontWeight: "700",
                fontFamily: "Montserrat",
                
              }}
            >
              <Typography
                sx={{
                  // marginLeft: "45px",
                  fontSize: "20px",
                  fontWeight: "700",
                  fontFamily: "Montserrat",
                }}
              >
                Yearly Overview
              </Typography>
            </Box>

            <Box
              sx={{
                width: "25%",
                textAlign: "end",
                display: role === "Admin" ? "block" : "none",
              }}
            >
              <FormControl
                sx={{
                  m: 1,
                  width: 190,
                  borderRadius: "5px",
                  marginBottom: "30px",
                  // boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.75)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Select
                  value={selectedDepartment}
                  onChange={handleChangeDepartment}
                  inputProps={{ style: { border: "none", boxShadow: "none" } }}
                  sx={{
                    height: "30px",
                    minWidth: "150px",
                    backgroundColor: "#ffffff",
                    border: "none",
                    fontWeight: "bold",
                    "& fieldset": {
                      border: "none",
                    },
                  }}
                >
                  {departments.map((department) => (
                    <MenuItem
                      key={department}
                      value={department}
                      sx={{ padding: "10px" }}
                    >
                      {department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                width: "15%",
                paddingRight: "20px",
                textAlign: role === "Admin" ? "start" : "center",
                marginLeft: role === "Admin" ? "0px" : "100px",
              }}
            >
              <FormControl
                sx={{
                  m: 1,
                  width: 160,
                  borderRadius: "5px",
                  marginBottom: "30px",
                  // boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.75)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Select
                  value={selectedMonth === null ? "" : selectedMonth.toString()}
                  onChange={handleChangeMonth}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selectedMonth === null) {
                      return "Select Month";
                    }
                    return monthsInFinancialYear.find(
                      (month) => month.value === parseInt(selected as string)
                    )?.label;
                  }}
                  inputProps={{ style: { border: "none", boxShadow: "none" } }}
                  sx={{
                    height: "30px",
                    minWidth: "150px",
                    backgroundColor: "#ffffff",
                    border: "none",
                    fontWeight: "bold",
                    "& fieldset": {
                      border: "none",
                    },
                  }}
                >
                  <MenuItem value="">All Months</MenuItem>
                  {monthsInFinancialYear.map((month) => (
                    <MenuItem
                      key={month.value}
                      value={month.value.toString()}
                      sx={{ padding: "10px" }}
                    >
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                width: "20%",
                textAlign: role === "Admin" ? "start" : "center",
                marginLeft: role === "Admin" ? "0px" : "0px",
              }}
            >
              <FormControl
                sx={{
                  m: 1,
                  width: 160,
                  borderRadius: "5px",
                  marginBottom: "30px",
                  // boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.75)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Select
                  value={yearRanges.find((range) => range.value === selectedYear)?.label || ""}
                  onChange={handleChangeYear}
                  inputProps={{ style: { border: "none", boxShadow: "none" } }}
                  sx={{
                    height: "30px",
                    minWidth: "150px",
                    backgroundColor: "#ffffff",
                    border: "none",
                    fontWeight: "bold",
                    "& fieldset": {
                      border: "none",
                    },
                  }}
                >
                  {yearRanges.map((range) => (
                    <MenuItem
                      key={range.value}
                      value={range.label}
                      sx={{ padding: "10px" }}
                    >
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "space-around" }}>
            <OpenFilingProgress
              openFilingsCount={openFilingsCount}
              totalFilingsCount={totalFilingsCount}
              closedFilingsCount={0}
              pendingFilingsCount={0}
            />
            <ClosedFilingProgress
              closedFilingsCount={closedFilingsCount}
              totalFilingsCount={totalFilingsCount}
              openFilingsCount={0}
              pendingFilingsCount={0}
            />
            <PendingFilingProgress
              pendingFilingsCount={pendingFilingsCount}
              totalFilingsCount={totalFilingsCount}
              openFilingsCount={0}
              closedFilingsCount={0}
            />
          </Box>
        </Box>
      )}
      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={generateReport}
          sx={{
            bgcolor: "#c70039",
            "&:hover": {
              bgcolor: "#c70039",
            },
            fontFamily: "Montserrat",
            textTransform: "none",
            marginRight: "3.5%",
            float : "right",
          }}
        >
          Generate Report
        </Button>
      </Box>
      <FilingsTableAdmin
        filingsData={filingsData}
        selectedDepartment={selectedDepartment}
        selectedMonth={selectedMonth}
      />
      
    </>
  );
};

export default YearlyOverviewCards;
