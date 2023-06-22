import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const initialData = {
  donation_id: "",
  requestor_id: "",
  urgency: "",
  units: "",
  additional_informations: "",
};

const CreateRequest = ({ distances, profile }) => {
  const [data, setData] = useState(initialData);
  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const allValues = Object.keys(data).every((key) => data[key]);
    if (!allValues) {
      toast.error("Please Ensure all fields are filled");
    } else {
      // MAKE A REQUEST
      try {
        await axios.post(
          "http://165.22.87.172:5000/api/requests",
          JSON.stringify({ ...data }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success(
          "Your Request has been request and is under review! We will keep In touch!"
        );
        setData(initialData);
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

  //   HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      requestor_id: profile?.id,
    }));
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
              <InputLabel id="donation-label">Available Foods</InputLabel>
              <Select
                required
                labelId="donation-label"
                name="donation_id"
                value={data.donation_id}
                onChange={handleChange}
                label="Available Foods"
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
                    {item.food_item} -{" "}
                    <span
                      style={{
                        color: "teal",
                      }}
                    >
                      {item.food_bank}
                    </span>{" "}
                    ({item.distance} Km)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="urgency-label">Urgency Level</InputLabel>
              <Select
                required
                labelId="urgency-label"
                name="urgency"
                value={data.urgency}
                label="Urgency Level"
                onChange={handleChange}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="units"
              label="Units"
              type="number"
              value={data.units}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              name="additional_informations"
              onChange={handleChange}
              value={data.additional_informations}
              label="Additional Information"
              placeholder="Provide additional Information, on location, need detailed info and any extra information"
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

export default CreateRequest;
