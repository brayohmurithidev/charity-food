import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import useAuth from "../hooks/useAuth";

const LOGIN_URL = "http://165.22.87.172:5000/api/session";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  // const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const from = sessionStorage.getItem("redirectTo") || "/";
    try {
      const res = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const role = res.data.role || "";
      const user = res.data.id || "";
      console.log(`Role ${role} user: ${user}`);
      setAuth({ role, user });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
      sessionStorage.removeItem("redirectTo");
    } catch (err) {
      if (!err?.response) {
        toast.error("No server response");
      } else if (err.response?.status === 400) {
        toast.error("Missing email or password");
      } else if (err.response?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Login failed");
      }
      errRef.current.focus();
    }
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
            Sign In
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              name="email"
              inputRef={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              inputRef={errRef}
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </form>

          <Typography variant="body1" mt={2}>
            Need an Account?{" "}
            <Link to="/register" style={{ color: "#6A1B9A" }}>
              Sign Up
            </Link>
          </Typography>
          <Typography variant="body1" mt={2}>
            <Link to="/reset_password" style={{ color: "#6A1B9A" }}>
              Forgot Your Password? Reset
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
