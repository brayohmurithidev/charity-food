import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RESETURL = "http://165.22.87.172:5000/api/reset_password";

const ResetPassword = () => {
  const navigation = useNavigate();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCodeAndNewPasswordFields, setShowCodeAndNewPasswordFields] =
    useState(false);

  const handleResetClick = async () => {
    if (email.trim() === "") {
      toast.error("Please enter your email");
      return;
    } else {
      try {
        const res = await axios.post(
          RESETURL,
          { email },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        toast.success(`${res?.data?.message}`);
        // Show the reset code and new password fields
        setShowCodeAndNewPasswordFields(true);
      } catch (err) {
        if (!err?.response) {
          toast.error("No server response");
        } else if (err.response?.status === 403) {
          toast.error(`User with ${email} doesn't exist`);
        } else {
          toast.error("Failed To generate OTP");
        }
      }
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Password do not match");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }
    try {
      await axios.put(
        RESETURL,
        { email, reset_token: resetCode, new_password: newPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(
        "Password was reset Successfully,  You will be redirected to login"
      );
      // Reset the form fields
      setEmail("");
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");
      setInterval(() => {
        return navigation("/login", { replace: true });
      }, 1000);
    } catch (err) {
      if (!err?.response) {
        setNewPassword("");
        setConfirmPassword("");
        toast.error("No server response");
      } else if (err.response?.status === 403) {
        setNewPassword("");
        setConfirmPassword("");
        toast.error("Invalid / Expired OTP");
      } else {
        toast.error("Password reset error");
      }
    }

    // // Hide the reset code and new password fields
    // setShowCodeAndNewPasswordFields(false);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#E6DEE9"
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box bgcolor="#FFFFFF" p={4} borderRadius={4} textAlign="center">
          <Typography variant="h4" color="#6B287C" fontWeight={900}>
            Reset Password
          </Typography>

          {!showCodeAndNewPasswordFields && (
            <>
              <TextField
                label="Email"
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleResetClick}
                fullWidth
                sx={{ mt: 2 }}
              >
                Reset
              </Button>
            </>
          )}

          {showCodeAndNewPasswordFields && (
            <>
              <TextField
                label="Reset Code"
                type="text"
                name="resetCode"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />

              <TextField
                label="New Password"
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />

              <TextField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                fullWidth
                sx={{ mt: 2 }}
              >
                Reset Password
              </Button>
            </>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
