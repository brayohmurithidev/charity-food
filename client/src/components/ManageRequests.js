import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Paper,
  FormControl,
  Grid,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const ManageRequests = ({ profile }) => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [donations, setDonations] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchDonations = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://165.22.87.172:5000/api/foodbanks/${profile?.id}/requests`
      );
      const results = res?.data;
      setDonations(results);
    } catch (err) {
      console.error(err);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    // Code to update donation status
    try {
      const res = await axios.put(
        `http://165.22.87.172:5000/api/requests/${selectedDonation.id}`,
        JSON.stringify({ status: selectedStatus }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res?.data?.message);
      await fetchDonations();
      // setInterval(() => {
      setModalOpen(false);
      // }, 5000);
    } catch (err) {
      if (!err?.response) {
        toast.error("No Server Response !");
      } else if (err.response?.status === 400) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("Registration Error");
      }
    }
  };

  return (
    <>
      <motion.Box
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: "75vw",
          }}
        >
          <Typography variant="h5" component="h2">
            Manage Requests
          </Typography>

          <TableContainer component={Paper}>
            <Table size="medium" aria-label="donations table">
              <TableHead sx={{ backgroundColor: "#ccc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, fontSize: "20px" }}>
                    Requestor Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "20px" }}>
                    Food Item
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "20px" }}>
                    Urgency
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "20px" }}>
                    Units
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "20px" }}>
                    Phone Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "20px" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "20px" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "20px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              {!donations ? (
                <CircularProgress />
              ) : (
                <TableBody>
                  {donations?.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{donation.user.name}</TableCell>
                      <TableCell>{donation.donation.food_item}</TableCell>
                      <TableCell>{donation.urgency}</TableCell>
                      <TableCell>{donation.units}</TableCell>
                      <TableCell>{donation.user.phone}</TableCell>
                      <TableCell>{donation.user.email}</TableCell>
                      <TableCell>{donation.status}</TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDonation(donation)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </motion.Box>
      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.Box
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          component={Paper}
          sx={{
            minWidth: 700,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 900, textAlign: "center" }}
          >
            Donation Details
          </Typography>
          {selectedDonation && (
            <>
              <Typography
                variant="h6"
                component="h5"
                sx={{ textAlign: "center", fontSize: "18px" }}
              >
                Manage Donation #{selectedDonation.id}
              </Typography>
              <Grid container spacing={2} my={3}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Food Item:</strong> {selectedDonation.food_item}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Quantity:</strong> {selectedDonation.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Pickup Preference:</strong>{" "}
                    {selectedDonation.pickup_preference}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Status:</strong> {selectedDonation.status}
                  </Typography>
                </Grid>
              </Grid>

              <Typography
                variant="h4"
                component="h3"
                sx={{ fontWeight: 700, color: "teal" }}
              >
                Donor Information
              </Typography>
              <Grid container spacing={2} my={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Donor Name:</strong> {selectedDonation.user.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Phone:</strong> {selectedDonation.user.phone}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Email:</strong> {selectedDonation.user.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>City:</strong> {selectedDonation.user.city}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Country:</strong> {selectedDonation.user.country}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>State:</strong> {selectedDonation.user.state}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Postal Code:</strong>{" "}
                    {selectedDonation.user.postal_code}
                  </Typography>
                </Grid>
              </Grid>

              {selectedDonation.status === "canceled" ? (
                <Typography variant="h6" component="h3">
                  This Donation was canceled by the donor
                </Typography>
              ) : (
                <Box mt={2}>
                  <Typography variant="h6" component="h3">
                    Update Status
                  </Typography>
                  <FormControl fullWidth sx={{ marginY: 3 }}>
                    <Select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <MenuItem value="under-review">Under Review</MenuItem>
                      <MenuItem value="allocated">Allocated</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    sx={{ padding: "10px" }}
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateStatus}
                  >
                    Update Status
                  </Button>
                </Box>
              )}
            </>
          )}
        </motion.Box>
      </Modal>
    </>
  );
};

export default ManageRequests;
