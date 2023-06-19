import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";

const DonorProfile = ({ profile }) => {
  return (
    <Paper
      sx={{
        flexGrow: 1,
        display: "flex",
        width: "80%",
        marginY: "auto",
        marginX: "auto",
        maxHeight: "60vh",

        flexDirection: "column",
        // border: "1px solid #ccc",
      }}
    >
      {/* {
  "city": "Los Angeles",
  "country": "United States",
  "email": "r@mail.com",
  "id": 16,
  "latitude": "34.05673500",
  "longitude": "-118.24568300",
  "name": "Jacob Anderson",
  "phone": "+1 (987) 654-3210",
  "postal_code": "90010",
  "role": "recipient",
  "state": "California"
} */}
      <Box sx={{ padding: "30px" }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: 900,
            color: "teal",
            alignItems: "flex-start",
            textTransform: "capitalize",
            textDecoration: "underline",
            mb: 5,
          }}
        >
          User Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              <strong>Name:</strong> {profile.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              <strong>Email:</strong> {profile.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              <strong>Phone:</strong> {profile.phone}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              <strong>Postal Code:</strong> {profile.postal_code}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              <strong>City:</strong> {profile.city}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              <strong>State:</strong> {profile.state}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              <strong>Country:</strong> {profile.country}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DonorProfile;
