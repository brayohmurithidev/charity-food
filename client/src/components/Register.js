import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { get_coordinates_by_city } from "../utils";
import { toast } from "react-toastify";
import axios from "axios";

const REGISTERURL = "http://165.22.87.172:5000/api/register";

const Register = () => {
  const userRef = useRef();
  const initialData = {
    name: "",
    email: "",
    role: "",
    city: "",
    country: "",
    state: "",
    postal_code: "",
    phone_number: "",
    password: "",
  };
  const [userData, setUserData] = useState(initialData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //check all data is passed:
    const isAllFieldsFilled = Object.values(userData).every((value) => value);
    if (!isAllFieldsFilled) {
      toast.error("All fields must be filled");
    } else {
      try {
        const cords = await get_coordinates_by_city(
          userData.city,
          userData.country
        );
        const res = await axios.post(
          REGISTERURL,
          JSON.stringify({
            ...userData,
            latitude: cords[0],
            longitude: cords[1],
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success(res?.data?.message);
        setUserData(initialData);
      } catch (err) {
        if (!err?.response) {
          toast.error("No Server Response !");
        } else if (err.response?.status === 400) {
          toast.error(err?.response?.data?.message);
        } else {
          toast.error("Registration Error");
        }
      }
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Box bgcolor="#E6DEE9" padding={4} borderRadius={4}>
          <Typography variant="h4" gutterBottom align="center">
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Name"
                  ref={userRef}
                  variant="outlined"
                  fullWidth
                  required
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  type="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Country"
                  variant="outlined"
                  fullWidth
                  required
                  name="country"
                  value={userData.country}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  variant="outlined"
                  fullWidth
                  required
                  name="city"
                  value={userData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="State"
                  variant="outlined"
                  fullWidth
                  required
                  name="state"
                  value={userData.state}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Postal Code"
                  variant="outlined"
                  fullWidth
                  required
                  name="postal_code"
                  value={userData.postal_code}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  required
                  name="phone_number"
                  value={userData.phone_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  required
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">I'm here to:</Typography>
                <RadioGroup
                  aria-label="role"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="donor"
                    control={<Radio />}
                    label="Donate"
                  />
                  <FormControlLabel
                    value="recepient"
                    control={<Radio />}
                    label="Get Relief Food"
                  />
                  <FormControlLabel
                    value="foodbank"
                    control={<Radio />}
                    label="Become A food Bank"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
          <Typography variant="body1" align="center" marginTop={2}>
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Register;
