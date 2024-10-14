import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import mslogo from "../../assets/mslogo.png";
import logoDark from "../../assets/logo-dark.png";
import React from "react";
import App from "../../App";
import { loginRequest } from "../../auth/auth-config";
import { UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import VectorArt from "../../assets/output-onlinejpgtools.jpg"

const Login: React.FC = () => {
  const { instance } = useMsal();

  const handleLoginRedirect = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        prompt: "create",
      })
      .catch((error) => console.log(error));
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundImage: `linear-gradient(90deg, rgba(199,0,57,1) 0%, rgba(255,255,255,0) 90%),url(${VectorArt})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "right",
        backgroundPositionY: "bottom",
      }}
    >
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          color: "",
          bgcolor: "white",
          width: "30vw",
          height: "20vh",
          p: "5%",
          // boxShadow: "  1px 1px 3px 3px gray",
          borderRadius: 1.5,
        }}
      >
        <Typography sx={{ fontWeight: "bold", color: "black", fontSize:"23px" }}>
          Login
        </Typography>

        <UnauthenticatedTemplate>
          <Box
            component="section"
            sx={{
              p: 1.2,
              bgcolor: "white",
              color: "#000000",
              boxShadow: "  1px 1px 3px black",
              borderRadius: 1,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              fontFamily: "Segoe UI Regular 15px",
            }}
            onClick={handleLoginRedirect}
          >
            <Box component="img" src={mslogo} sx={{}} />

            <Typography sx={{ fontFamily: "Montserrat" }}>
              Sign In with Microsoft
            </Typography>
          </Box>
          <Box component="img" src={logoDark} sx={{ height: "15%",marginTop:'25px' }} />
        </UnauthenticatedTemplate>
        {/* <Typography>Compliance Calendar</Typography> */}
      </Box>
    </Box>
  );
};

export default Login;
