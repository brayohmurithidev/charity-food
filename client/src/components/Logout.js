import { ExitToApp } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigation = useNavigate();
  const { setAuth } = useAuth();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        await axios.delete("http://165.22.87.172:5000/api/session");
        setAuth({}); // Clear the auth state
        sessionStorage.clear(); // Clear all session storage
        navigation("/", { replace: true });
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
    }
  };
  return (
    <>
      <Button
        variant="contained"
        onClick={handleLogout}
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
        }}
        endIcon={<ExitToApp />}
      >
        Logout
      </Button>
    </>
  );
};

export default Logout;
