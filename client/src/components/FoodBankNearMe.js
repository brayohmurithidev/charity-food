import { Grid } from "@mui/material";
import React from "react";
import MapLeaflet from "./MapLeaflet";

const FoodBankNearMe = ({ profile, foodbanks }) => {
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {profile && (
          <MapLeaflet
            lat={profile.latitude}
            lon={profile.longitude}
            foodbanks={foodbanks}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default FoodBankNearMe;
