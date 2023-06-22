import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

import { toast } from "react-toastify";
import axios from "axios";

const CREATEDONATIONURL = "http://165.22.87.172:5000/api/donations";

const CreateDonation = ({ profile, distances }) => {
  const [foodbankNearMe, setFoodbankNearMe] = useState("");
  const [foodItem, setFoodItem] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pickupPreference, setPickupPreference] = useState("");

  const handleFoodbankNearMeChange = (event) => {
    setFoodbankNearMe(event.target.value);
  };

  const handleFoodItemChange = (event) => {
    setFoodItem(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handlePickupPreferenceChange = (event) => {
    setPickupPreference(event.target.value);
  };
  const handleAdditionalInformationChange = (e) => {
    setAdditionalInfo(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      foodbankNearMe === "" ||
      foodItem === "" ||
      quantity === "" ||
      pickupPreference === ""
    ) {
      toast.error("You must fill in all fields");
      return;
    } else {
      const data = {
        donor_id: profile?.id,
        foodbank_id: foodbankNearMe,
        food_item: foodItem,
        quantity: quantity,
        pickup_preference: pickupPreference,
        additional_information: additionalInfo,
      };

      // SEND DATA TO AXIOS
      try {
        const res = await axios.post(
          CREATEDONATIONURL,
          JSON.stringify({ ...data }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success(res?.data?.message);
        setFoodItem("");
        setQuantity("");
        setFoodbankNearMe("");
        setPickupPreference("");
        setAdditionalInfo("");
      } catch (err) {
        if (!err?.response) {
          toast.error("No Server Response !");
        } else if (err.response?.status === 400) {
          toast.error(err?.response?.data?.message);
        } else {
          toast.error(err?.response?.data?.message);
        }
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: {
          md: "130px",
          xs: "30px",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid
          sx={{
            maxWidth: "60%",
            marginX: "auto",
          }}
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="foodbank-label">FoodBank Near Me</InputLabel>
              <Select
                labelId="foodbank-label"
                id="foodbank"
                value={foodbankNearMe}
                onChange={handleFoodbankNearMeChange}
                label="FoodBank Near Me"
              >
                {distances.length === 0 ? (
                  "Loading"
                ) : (
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                )}
                {distances?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} ({item.distance} Km)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Food Item"
              value={foodItem}
              onChange={handleFoodItemChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="pickup-preference-label">
                Pickup Preference
              </InputLabel>
              <Select
                labelId="pickup-preference-label"
                id="pickup-preference"
                value={pickupPreference}
                label="Pickup Preference"
                onChange={handlePickupPreferenceChange}
              >
                <MenuItem value="pickup">Pickup</MenuItem>
                <MenuItem value="dropoff">Drop Off</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="additional_information"
              onChange={handleAdditionalInformationChange}
              value={additionalInfo}
              label="Additional Information"
              placeholder="Provide additional Information, on location, donation detailed info and any extra information"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Create Donation
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateDonation;
