import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import banner1 from "../assets/images/background.png";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = (path) => {
    sessionStorage.setItem("redirectTo", path);
    navigate(path);
  };

  return (
    <Box
      style={{
        height: "100vh",
        backgroundImage: `url(${banner1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <Grid
        container
        style={{
          maxWidth: "600px",
          width: "100%",
          display: {
            md: "flex",
            xs: "auto",
          },
        }}
        spacing={2}
      >
        <Grid item xs={12}>
          <Typography variant="h1" sx={{ color: "#6B287C", fontWeight: 900 }}>
            Food for All
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: "#6B287C", fontWeight: 600, fontSize: "36px" }}
          >
            Donate and Receive Relief
          </Typography>
          <Typography
            sx={{ fontSize: "24px", color: "#000000", fontWeight: 500 }}
            variant="subtitle1"
            style={{ marginTop: "1rem" }}
          >
            Join our mission to fight hunger and food insecurity. Donate to help
            those in need or request relief assistance. Together, we can make a
            difference in the lives of individuals and communities.
          </Typography>
          {/* Add your reasons for donating food here */}
        </Grid>
        <Grid item xs={6}>
          <Button
            component={Link}
            variant="contained"
            sx={{
              backgroundColor: "#6A1B9A",
              width: "100%",
            }}
            onClick={() => handleClick("/donor")}
            to="/donor"
          >
            Donate
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            component={Link}
            onClick={() => handleClick("/recepient")}
            variant="contained"
            sx={{
              backgroundColor: "#FF5722",
              width: "100%",
            }}
            to="/recepient"
          >
            Ask for Relief Food
          </Button>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Typography
            variant="h4"
            sx={{ color: "#6B287C", fontWeight: 600, marginTop: "30px" }}
          >
            Are You a Registered NGO?
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "18px",
              color: "#000000",
              fontWeight: 500,
              marginTop: "1rem",
            }}
          >
            If you are a registered non-governmental organization and would like
            to be a food storage facility, click below to get connected with
            donors and receivers.
          </Typography>
          <Button
            component={Link}
            onClick={() => handleClick("/foodbank")}
            variant="outlined"
            sx={{
              marginTop: "1rem",
              color: "#fff",
              backgroundColor: "#9C4DCC",
              width: "100%",
            }}
            to="/foodbank"
          >
            Learn More
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
