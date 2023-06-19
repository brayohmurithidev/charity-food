import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Box bgcolor="#E6DEE9" padding={4} borderRadius={4}>
          <Typography variant="h4" gutterBottom align="center">
            Unauthorized Access
          </Typography>
          <Typography variant="body1" align="center">
            Sorry, you don't have permission to access this page.
          </Typography>
          <Grid container justifyContent="center" marginTop={4}>
            <Grid item xs={6} md={4}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBack />}
                fullWidth
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} marginTop={2}>
        <Button
          component={Link}
          to="/"
          variant="text"
          startIcon={<Home />}
          fullWidth
          sx={{ color: "#6B287C" }}
        >
          Go to Home
        </Button>
      </Grid>
    </Grid>
  );
};

export default Unauthorized;
