import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import { FcLock } from 'react-icons/fc';
 
const UnauthorizedPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <FcLock size={100} />
        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          You do not have permission to view this page. Please contact your administrator if you believe this is a mistake.
        </Typography>
      </Box>
    </Container>
  );
};
 
export default UnauthorizedPage;