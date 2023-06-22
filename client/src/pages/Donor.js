import React, { useEffect, useState } from "react";
import { Grid, Button, Box, Avatar, Typography } from "@mui/material";
import { Room, ShoppingCart, AddCircle } from "@mui/icons-material";
import FoodBankNearMe from "../components/FoodBankNearMe";
import MyDonations from "../components/MyDonations";
import CreateDonation from "../components/CreateDonation";
import DonorProfile from "../components/DonorProfile";
import Logout from "../components/Logout";
import { calculateCoordinates, calculateDistance } from "../utils";
import axios from "axios";

const Donor = () => {
  const [activeSection, setActiveSection] = useState("foodBankNearMe");
  const [profile, setProfile] = useState(null);
  const [distances, setDistances] = useState([]);
  const [foodbanks, setFoodbanks] = useState([]);

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

  // FETCH FOODBANKS NEAR ME ON RENDER:
  useEffect(() => {
    const fetch_foodbanks_near_me = async () => {
      try {
        const lat = parseFloat(profile?.latitude);
        const lon = parseFloat(profile?.longitude);
        // calculate range
        const { minLat, maxLat, minLon, maxLon } = calculateCoordinates(
          lat,
          lon,
          20
        );
        const res = await axios.get(
          "http://165.22.87.172:5000/api/foodbanks_near_me",
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              minLat: minLat,
              maxLat: maxLat,
              minLon: minLon,
              maxLon: maxLon,
            },
          }
        );
        const results = res?.data;
        setFoodbanks(results);
        const distancesData = results?.map((result) => {
          const { id, name, latitude, longitude } = result;
          const distance = calculateDistance(lat, lon, latitude, longitude);
          return { id, name, distance };
        });
        setDistances(distancesData);
      } catch (error) {
        console.error(error);
      }
    };

    if (profile) {
      fetch_foodbanks_near_me();
    } else {
      return;
    }
  }, [profile, profile?.latitude, profile?.longitude, activeSection]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "foodBankNearMe":
        return <FoodBankNearMe foodbanks={foodbanks} profile={profile} />;
      case "myDonations":
        return <MyDonations />;
      case "createDonation":
        return <CreateDonation profile={profile} distances={distances} />;
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
                  onClick={() => handleSectionChange("foodBankNearMe")}
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
                      activeSection === "foodBankNearMe"
                        ? "#FF5722"
                        : "#1976D2",
                    "&:hover": {
                      backgroundColor:
                        activeSection === "foodBankNearMe"
                          ? "#FF5722"
                          : "#1976D2",
                    },
                  }}
                  startIcon={<Room sx={{ fontSize: 40, color: "#fff" }} />}
                >
                  View Food Bank Near Me
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSectionChange("createDonation")}
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
                      activeSection === "createDonation"
                        ? "#FF5722"
                        : "#1976D2",
                    "&:hover": {
                      backgroundColor:
                        activeSection === "createDonation"
                          ? "#FF5722"
                          : "#1976D2",
                    },
                  }}
                  startIcon={<AddCircle sx={{ fontSize: 40, color: "#fff" }} />}
                >
                  Create Donation
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSectionChange("myDonations")}
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
                      activeSection === "myDonations" ? "#FF5722" : "#1976D2",
                    "&:hover": {
                      backgroundColor:
                        activeSection === "myDonations" ? "#FF5722" : "#1976D2",
                    },
                  }}
                  startIcon={
                    <ShoppingCart sx={{ fontSize: 40, color: "#fff" }} />
                  }
                >
                  View My Donations
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

export default Donor;
