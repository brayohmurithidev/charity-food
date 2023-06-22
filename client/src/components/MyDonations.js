import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Edit, Cancel } from "@mui/icons-material";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const MyDonations = () => {
  const { auth } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDonation, setEditDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState(null);
  const [refetch, setRefetch] = useState(null);
  const [updateData, setUpdateData] = useState(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (donation) => {
    // Destructure the object and update the status
    const { status, ...updatedData } = donation;
    updatedData.status = "canceled";
    setUpdateData({ id: updatedData.id, status: updatedData.status });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // UPDATE STATUS  set cancelled
  const handleUpdateStatus = async () => {
    if (updateData === null) {
      return;
    } else {
      try {
        const id = updateData?.id;
        console.log(updateData);
        const res = await axios.put(
          `http://165.22.87.172:5000/api/donations/${id}`,
          JSON.stringify({
            status: updateData.status,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setRefetch(true);
        toast.success(res?.data?.message);
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };
  // CALL MY DONATIONS ON

  useEffect(() => {
    const fetch_donations = async () => {
      setLoading(true);
      const id = auth?.user;
      try {
        const res = await axios.get(
          `http://165.22.87.172:5000/api/donors/${id}/donations`
        );
        setDonations(res?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetch_donations();
  }, [auth?.user, refetch]);

  // HANDLE EDIT EDIT CHANGE
  const handleEditChange = (e) => {
    setEditDonation((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // CONST HANDLE UPDATE
  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(editDonation);
  };

  const handleEdit = (donation) => {
    setEditDonation(donation);
    setEditModalOpen(true);
  };

  const handleCancel = (donation) => {
    console.log(donation);

    // if (editDonation) {
    //   const updatedDonations = donations.map((donation) =>
    //     donation.id === editDonation.id
    //       ? { ...donation, status: "Canceled" }
    //       : donation
    //   );
    //   // Update the donations array with the updatedDonations array
    //   // You can use a state management library or make an API call to update the data
    //   console.log("Donation canceled:", editDonation);
    // }
    setEditDonation(null);
    setEditModalOpen(false);
  };

  const handleModalClose = () => {
    setEditDonation(null);
    setEditModalOpen(false);
  };

  return (
    <React.Fragment>
      {loading ? (
        "Loading"
      ) : (
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ borderBottom: "" }}>
                <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                  Foodbank Name
                </TableCell>
                <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                  Food Item
                </TableCell>
                <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                  Pickup Preference
                </TableCell>
                <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontSize: "20px", fontWeight: 900 }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donations?.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {donation.id}
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {donation?.foodbank?.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {donation.food_item}
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {donation.quantity}
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {donation.pickup_preference}
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {donation.status}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      disabled={
                        donation?.status === "completed" ||
                        donation?.status === "canceled"
                      }
                      color="primary"
                      onClick={() => handleEdit(donation)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      disabled={
                        donation?.status === "completed" ||
                        donation?.status === "canceled"
                      }
                      color="secondary"
                      onClick={() => handleClickOpen(donation)}
                    >
                      <Cancel />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={editModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            bgcolor: "#fff",
            p: 4,
            borderRadius: "8px",
          }}
        >
          <TextField
            label="Food Item"
            variant="outlined"
            fullWidth
            name="food_item"
            value={editDonation?.food_item || ""}
            onChange={handleEditChange}
            // Add onChange handler to update the editDonation state
          />
          <Box sx={{ mt: 2 }}>
            <Select
              // Add onChange handler to update the editDonation state
              fullWidth
              onChange={handleEditChange}
              name="pickup_preference"
              variant="outlined"
              value={editDonation?.pickup_preference || ""}
              label="Pickup Preference"
            >
              <MenuItem value="pickup">Pickup</MenuItem>
              <MenuItem value="dropoff">Drop Off</MenuItem>
            </Select>
          </Box>
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            name="quantity"
            onChange={handleEditChange}
            fullWidth
            value={editDonation?.quantity || ""}
            // Add onChange handler to update the editDonation state
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              sx={{ backgroundColor: "#333" }}
              variant="contained"
              onClick={handleCancel}
            >
              Cancel Donation
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpdate}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are You sure you want to cancel this donation? Your changes cannot be
          reverted!
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdateStatus} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default MyDonations;
