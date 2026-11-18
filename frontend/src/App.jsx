
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Admin pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Policies from "./pages/Policies";
import PolicyDetails from "./pages/PolicyDetails";
import Claims from "./pages/Claims";

// Client pages
import ClientLogin from "./pages/ClientLogin";
import ClientRegister from "./pages/ClientRegister";
import ClientDashboard from "./pages/ClientDashboard";

import "./App.css";

// CLIENT PROTECTED ROUTE
function ClientProtectedRoute({ children }) {

  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {

    const checkLogin = async () => {

      try {
        const response = await fetch(
          "http://localhost:8080/client/me",
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (response.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }

      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthenticated(false);
      }
    };

    checkLogin();

  }, []);

  // Wait until authentication is checked
  if (authenticated === null) {
    return <p>Checking authentication...</p>;
  }

  // Redirect unauthenticated users
  if (!authenticated) {
    return <Navigate to="/client-login" replace />;
  }

  return children;
}

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* ADMIN ROUTES */}
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/customers" element={<Customers />} />

        <Route path="/policies" element={<Policies />} />

        <Route
          path="/policies/:id"
          element={<PolicyDetails />}
        />

        <Route path="/claims" element={<Claims />} />


        {/* CLIENT LOGIN */}
        <Route
          path="/client-login"
          element={<ClientLogin />}
        />

        {/* CLIENT REGISTRATION */}
        <Route
          path="/client-register"
          element={<ClientRegister />}
        />

        {/* CLIENT PROTECTED DASHBOARD */}
        <Route
          path="/client-dashboard"
          element={
            <ClientProtectedRoute>
              <ClientDashboard />
            </ClientProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
