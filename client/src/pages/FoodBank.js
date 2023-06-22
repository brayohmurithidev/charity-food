import React, { useEffect, useState } from "react";
import { Grid, Button, Box, Avatar, Typography } from "@mui/material";
import { ShoppingCart, AddCircle, Home } from "@mui/icons-material";
import DonorProfile from "../components/DonorProfile";
import Logout from "../components/Logout";

import axios from "axios";
import FoodBankDashboard from "../components/FoodBankDashboard";
import ManageDonations from "../components/ManageDonations";
import ManageRequests from "../components/ManageRequests";

const FoodBank = () => {
  const [activeSection, setActiveSection] = useState("foodBankDashboard");
  const [profile, setProfile] = useState(null);
  const [count, setCount] = useState(null);

  useEffect(() => {
    const get_profile = async () => {
      try {
        const res = await axios.get("http://165.22.87.172:5000/api/profile", {
          withCredentials: true,
        });
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    get_profile();
  }, []);

  // GET DONATIONS COUNT:
  useEffect(() => {
    const fetchData = async () => {
      const req1 = await axios.get(
        `http://165.22.87.172:5000/api/foodbanks/${profile?.id}/donations/filter`,
        {
          params: { status: "completed" },
          headers: { "Content-Type": "application/json" },
        }
      );
      const req2 = await axios.get(
        `http://165.22.87.172:5000/api/foodbanks/${profile?.id}/donations/filter`,
        {
          params: { status: "pending" },
          headers: { "Content-Type": "application/json" },
        }
      );
      const req3 = await axios.get(
        `http://165.22.87.172:5000/api/foodbanks/${profile?.id}/donations/filter`,
        {
          params: { isAvailable: true },
          headers: { "Content-Type": "application/json" },
        }
      );
      const req4 = await axios.get(
        `http://165.22.87.172:5000/api/foodbanks/${profile?.id}/donations/filter`,
        {
          params: { isDonated: true },
          headers: { "Content-Type": "application/json" },
        }
      );
      setCount({
        completed: req1?.data?.length || 0,
        pending: req2?.data?.length || 0,
        available: req3?.data?.length || 0,
        donated: req4?.data?.length || 0,
      });
    };
    if (profile?.id !== undefined) {
      fetchData();
    } else {
      return;
    }
  }, [profile?.id]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "foodBankDashboard":
        return <FoodBankDashboard count={count} />;
      case "manageDonations":
        return <ManageDonations profile={profile} />;
      case "manageRequests":
        return <ManageRequests profile={profile} />;
      case "profile":
        return <DonorProfile profile={profile} />;
      default:
        return null;
    }
  };

  return (
    <>
      {profile && (
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: "20vw",
              backgroundColor: "#6A1B9A",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#fff",
                    fontWeight: 900,
                    marginY: 3,
                  }}
                >
                  Hello, Welcome {profile.name.split(" ")[0]} !
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSectionChange("foodBankDashboard")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: "10px",
                    width: "100%",
                    justifyContent: "flex-start",
                    backgroundColor:
                      activeSection === "foodBankDashboard"
                        ? "#FF5722"
                        : "#1976D2",
                    "&:hover": {
                      backgroundColor:
                        activeSection === "foodBankDashboard"
                          ? "#FF5722"
                          : "#1976D2",
                    },
                  }}
                  startIcon={<Home sx={{ fontSize: 40, color: "#fff" }} />}
                >
                  Dashboard
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSectionChange("manageDonations")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: "10px",
                    width: "100%",
                    justifyContent: "flex-start",
                    backgroundColor:
                      activeSection === "manageDonations"
                        ? "#FF5722"
                        : "#1976D2",
                    "&:hover": {
                      backgroundColor:
                        activeSection === "manageDonations"
                          ? "#FF5722"
                          : "#1976D2",
                    },
                  }}
                  startIcon={<AddCircle sx={{ fontSize: 40, color: "#fff" }} />}
                >
                  Manage Donations
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSectionChange("manageRequests")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: "10px",
                    width: "100%",
                    justifyContent: "flex-start",
                    backgroundColor:
                      activeSection === "manageRequests"
                        ? "#FF5722"
                        : "#1976D2",
                    "&:hover": {
                      backgroundColor:
                        activeSection === "manageRequests"
                          ? "#FF5722"
                          : "#1976D2",
                    },
                  }}
                  startIcon={
                    <ShoppingCart sx={{ fontSize: 40, color: "#fff" }} />
                  }
                >
                  Manage Request
                </Button>
              </Grid>
              <Grid item sx={{ marginTop: "auto" }}>
                <Button
                  onClick={() => handleSectionChange("profile")}
                  variant="contained"
                  color="primary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: "10px",
                    width: "100%",
                    justifyContent: "flex-start",
                    backgroundColor:
                      activeSection === "profile" ? "#FF5722" : "#1976D2",
                    "&:hover": {
                      backgroundColor:
                        activeSection === "profile" ? "#FF5722" : "#1976D2",
                    },
                  }}
                  startIcon={<Avatar sx={{ width: 24, height: 24 }} />}
                >
                  Profile
                </Button>
              </Grid>

              <Grid item sx={{ marginTop: "auto" }}>
                <Logout />
              </Grid>
            </Grid>
          </Box>

          {/* Content */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#F3E5F5",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {renderActiveSection()}
          </Box>
        </Box>
      )}
    </>
  );
};

export default FoodBank;
