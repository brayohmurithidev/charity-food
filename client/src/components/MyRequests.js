import React, { useEffect, useState } from "react";
import "./styles.css";
import foodItem from "../assets/images/banner2.png";
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
  Grid,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Cancel, Visibility } from "@mui/icons-material";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const MyRequests = ({ distances }) => {
  const { auth } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ViewModalOpen, setViewModalOpen] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requests, setDonations] = useState(null);
  const [request, setRequest] = useState(null);
  const [refetch, setRefetch] = useState(null);
  const [updateData, setUpdateData] = useState(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (item) => {
    // Destructure the object and update the status
    const { status, ...updatedData } = item;
    updatedData.status = "canceled";
    setUpdateData({ id: updatedData.id, status: updatedData.status });
    setOpen(true);
  };

  //   VIEW SINGLE ELEMENT
  const handleClickView = (item) => {
    // Destructure the object and update the status
    setRequest(item);
    setViewModalOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleUpdateChange = (e) => {};

  // UPDATE STATUS  set cancelled
  const handleUpdateStatus = async () => {
    if (updateData === null) {
      return;
    } else {
      try {
        const id = updateData?.id;
        const res = await axios.put(
          `http://165.22.87.172:5000/api/requests/${id}`,
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
          `http://165.22.87.172:5000/api/requestors/${id}/requests`
        );
        setDonations(res?.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetch_donations();
  }, [auth?.user, refetch]);

  // HANDLE EDIT EDIT CHANGE
  const handleEditChange = (e) => {
    setEditRequest((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // CONST HANDLE UPDATE
  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(editRequest);
  };

  const handleEdit = (item) => {
    setEditRequest(item);
    setEditModalOpen(true);
  };

  const handleCancel = (item) => {
    console.log(item);

    // if (editDonation) {
    //   const updatedDonations = requests.map((donation) =>
    //     donation.id === editDonation.id
    //       ? { ...donation, status: "Canceled" }
    //       : donation
    //   );
    //   // Update the requests array with the updatedDonations array
    //   // You can use a state management library or make an API call to update the data
    //   console.log("Donation canceled:", editDonation);
    // }
    setEditRequest(null);
    setEditModalOpen(false);
  };

  const handleModalClose = () => {
    setEditRequest(null);
    setEditModalOpen(false);
  };

  return (
    <React.Fragment>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ borderBottom: "" }}>
              <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                ID
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                Food Item
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                Quantity
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                Food Bank
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}>
                Status
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: 900 }}></TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            "Loading"
          ) : (
            <TableBody>
              {requests?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {item.id}
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {item?.donation?.food_item}
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {item.units}
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {item.user?.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "18px", fontWeight: 400 }}>
                    {item.status}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="info"
                      onClick={() => handleClickView(item)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      disabled={
                        item?.status === "allocated" ||
                        item?.status === "rejected" ||
                        item?.status === "canceled"
                      }
                      color="primary"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      disabled={
                        item?.status === "allocated" ||
                        item?.status === "rejected" ||
                        item?.status === "canceled"
                      }
                      color="secondary"
                      onClick={() => handleClickOpen(item)}
                    >
                      <Cancel />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

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
          <FormControl fullWidth>
            <InputLabel id="donation-label">Available Foods</InputLabel>
            <Select
              required
              labelId="donation-label"
              name="donation_id"
              value={editRequest?.donation?.donation_id}
              onChange={handleEditChange}
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
          <Box sx={{ mt: 2 }}>
            <Select
              // Add onChange handler to update the editRequest state
              fullWidth
              onChange={handleEditChange}
              name="urgency"
              variant="outlined"
              value={editRequest?.urgency || ""}
              label="Pickup Preference"
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </Box>
          <TextField
            label="Unit"
            type="number"
            variant="outlined"
            name="units"
            onChange={handleEditChange}
            fullWidth
            value={editRequest?.units || ""}
            // Add onChange handler to update the editRequest state
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            required
            name="additional_information"
            onChange={handleEditChange}
            value={editRequest?.additional_information}
            label="Additional Information"
            placeholder="Provide additional Information, on location, need detailed info and any extra information"
            multiline
            rows={4}
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

      <Modal open={ViewModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40vw",
            bgcolor: "#fff",
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h3"
              sx={{ textAlign: "center", fontWeight: 900, mb: 5 }}
            >
              Your Food Request
            </Typography>
            <img
              src={foodItem}
              alt="Food Request"
              style={{ width: "100%", height: "300px", marginBottom: "20px" }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "24px" }}>
                  <strong>Food Item:</strong> {request?.donation?.food_item}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "24px" }}>
                  <strong>Quantity:</strong> {request?.units}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "24px" }}>
                  <strong>Urgency:</strong> {request?.urgency}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "24px" }}>
                  <strong>Foodbank:</strong> {request?.user?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "24px" }}>
                  <strong>Location:</strong> {request?.user?.city},{" "}
                  {request?.user?.country}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "24px" }}>
                  <strong>Contact:</strong> {request?.user?.phone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: "24px" }}>
                  <strong>Status:</strong> {request?.status}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: "24px" }}>
                  <strong>Additional Information:</strong>{" "}
                  {request?.additional_information}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              sx={{ backgroundColor: "#333" }}
              variant="contained"
              onClick={() => setViewModalOpen(false)}
            >
              CLOSE
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
          Are You sure you want to cancel this Request? Your changes cannot be
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

export default MyRequests;
