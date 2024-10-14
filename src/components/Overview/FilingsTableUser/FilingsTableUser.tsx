import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
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
} from "@mui/material";
import { IoMdDownload } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { ThemeProvider } from "@mui/material/styles";
import { IoMdArrowDropdown } from "react-icons/io";
import { FilingData } from "../../../utility/DataContext/FilingData";
import { getStatusButtonColor } from "../../../utility/statusColors";
import { theme } from "../../../utility/statusColors"

interface FilingsTableUserProps {
  filingsData: FilingData[];
  selectedUser: string;
}
// Create your custom theme with the extended palette options

const FilingsTableUser: React.FC<FilingsTableUserProps> = ({
  filingsData,
  selectedUser,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [statusFilter, setStatusFilter] = useState<string>("Status");
  const [visibleRowCount, setVisibleRowCount] = useState<number>(5); // Initial number of visible rows

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

  // Lazy loading effect: Load more rows every time visibleRowCount changes
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;
      if (bottom) {
        setVisibleRowCount((prevCount) => prevCount + 5); // Increase visible rows by 5
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredFilings = useMemo(() => {
    // Filter filings based on selected user and status filter
    const filteredByUser = filingsData.filter(
      (filing) => filing.assignedTo === selectedUser
    );

    // Sort filings based on status: pending first, then open, and finally closed
    const sortedFilings = filteredByUser.sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      if (a.status === "Open" && b.status === "Closed") return -1;
      if (a.status === "Closed" && b.status === "Open") return 1;
      return 0;
    });

    // Filter based on status filter
    return sortedFilings.filter(
      (filing) =>
        statusFilter === "Status" ||
        filing.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [filingsData, selectedUser, statusFilter]);

  const statuses = ["Status", "Open", "Pending", "Closed"];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 2, paddingLeft: "20%", paddingRight: "50px", marginTop: "6%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: '900', marginLeft: '10px' }}>Filings Table</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell sx={{ width: 150, fontWeight: '600', textAlign: "center" }}>Due Date</TableCell>
                <TableCell sx={{ width: 200, fontWeight: '600', textAlign: "center" }}>Statute/Form No.</TableCell>
                <TableCell sx={{ width: 150, fontWeight: '600', textAlign: "center" }}>
                  <Button
                    variant="text"
                    onClick={handleButtonClick}
                    sx={{
                      color: 'black',
                      textTransform: 'none',
                      fontWeight: '600',
                      "&:hover": {
                        bgcolor: theme.palette.primary.main,
                      }
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
                      <MenuItem key={status} onClick={() => handleMenuItemClick(status)}>
                        {status}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>
                <TableCell sx={{ width: 150, fontWeight: '600', textAlign: "center" }}>Document</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFilings.slice(0, visibleRowCount).map((filing, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center" }}>{filing.dueDate}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{filing.statuteOrAct}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      sx={{
                        backgroundColor: getStatusButtonColor(filing.status),
                        color: "white",
                        width: "7em",
                        "&:hover": {
                          backgroundColor: "gray"
                        }
                      }}
                    >
                      {filing.status}
                    </Button>
                  </TableCell>
                  <TableCell sx={{ display: "flex", flexDirection: "row", textAlign: "center" }}>
                    <Tooltip title="View Document">
                      <Button
                        sx={{
                          fontSize: 18,
                          padding: "1em",
                          color:
                            filing.status === "Open" ||
                            filing.status === "Pending"
                              ? "gray"
                              : "black",
                        }}
                        disabled={
                          filing.status === "Open" || filing.status === "Pending"
                        }
                      >
                        <FaEye />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Download Document">
                      <Button
                        sx={{
                          fontSize: 18,
                          p: 2,
                          color:
                            filing.status === "Open" ||
                            filing.status === "Pending"
                              ? "gray"
                              : "black",
                        }}
                        disabled={
                          filing.status === "Open" || filing.status === "Pending"
                        }
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
    </ThemeProvider>
  );
};

export default FilingsTableUser;
