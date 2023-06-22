import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FoodBank from "./pages/FoodBank";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Donor from "./pages/Donor";
import Recepient from "./pages/Recepient";
import React from "react";

// Configure the toast notifications

// MAIN ENTERY FILE
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* PUBLIC ROUTES */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset_password" element={<ResetPassword />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Home />} />

          {/* PROTECTED ROUTES */}
          <Route element={<RequireAuth allowedRoles={["foodbank"]} />}>
            <Route path="foodbank" element={<FoodBank />} />
          </Route>
          {/* ROUTES FOR DONORS */}
          <Route element={<RequireAuth allowedRoles={["donor"]} />}>
            <Route path="user" element={<User />} />
            <Route path="donor" element={<Donor />} />
          </Route>
          {/* ROUTES FOR RECEPIENTS */}
          <Route element={<RequireAuth allowedRoles={["recipient"]} />}>
            <Route path="/recepient" element={<Recepient />} />
          </Route>
        </Route>

        {/* CATCH ALL OTHERS */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
