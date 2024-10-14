import { CustomPaletteOptions } from './DataContext/FilingData';
import { createTheme } from "@mui/material";

export const getStatusButtonColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "closed":
        return "#008000"; // green
      case "pending":
        return "#FF0000"; // red
      case "open":
        return "#0000FF"; // blue
      default:
        return "#808080"; // gray
    }
  };

  export const theme = createTheme({
    typography: {
      fontFamily: "Montserrat, sans-serif",
    },
    palette: {
      primary: {
        main: "#A5A5A5",// selection color
      },
      secondary: {
        main: "#414D59", //week color
      },
      error: {
        main: "#f44336",
      },
      background: {
        default: "#fff",
        paper: "#f5f5f5",
      },
      action: {
        active: "#C70039", // red
      },
    } as CustomPaletteOptions, // Cast to CustomPaletteOptions
  });
  