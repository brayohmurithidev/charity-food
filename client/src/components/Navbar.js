import { Home } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  console.log(location);
  return (
    <>
      {location?.pathname !== "/" && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#6A1B9A",
            paddingY: "10px",
          }}
        >
          <Typography
            sx={{ color: "#ffffff", ml: 5 }}
            component="h3"
            variant="h3"
          >
            CHARITY FOOD APP
            <Divider sx={{ backgroundColor: "#ffffff" }} />
          </Typography>

          <Button
            sx={{ color: "#ffffff", mr: 5, fontSize: "20px", fontWeight: 700 }}
            to="/"
            component={Link}
            startIcon={<Home sx={{ width: 34, height: 34 }} />}
          >
            GO HOME
          </Button>
        </Box>
      )}
    </>
  );
};

export default Navbar;
