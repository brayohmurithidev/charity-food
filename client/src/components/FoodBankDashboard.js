import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { RequestPage, VolunteerActivism } from "@mui/icons-material";

const FoodBankDashboard = ({ count }) => {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <RequestPage fontSize="large" />
            <Typography variant="h6">Requests made</Typography>
            <Typography variant="body1">Pending: 10</Typography>
            <Typography variant="body1">Complete: 5</Typography>
            <Typography variant="body1">Rejected: 3</Typography>
            <Typography variant="body1">Under Review: 2</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <VolunteerActivism fontSize="large" />
            <Typography variant="h6">Donations made</Typography>
            <Typography variant="body1">
              Completed: {count?.completed}
            </Typography>
            <Typography variant="body1">Pending: {count?.pending}</Typography>
            <Typography variant="body1">
              Available: {count?.available}
            </Typography>
            <Typography variant="body1">Donated: {count?.donated}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FoodBankDashboard;
