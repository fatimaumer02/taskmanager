import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Dashboard from "../src/pages/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CompletedTasks from "./pages/Completedtask";
import PendingTasks from "./pages/Pendingtask";

function App() {
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("userAuthChanged"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userAuthChanged"));
  };

  const showNavbar = location.pathname === "/";

  return (
    <>
      {showNavbar && <Navbar user={user} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Layout Route with Nested Routes */}
        <Route
          path="/layout"
          element={
            user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        >
          {/* Nested route for Dashboard as default */}
          <Route index element={<Dashboard />} />
          {/* Nested routes */}
          <Route path="pending" element={<PendingTasks />} />
          <Route path="completed" element={<CompletedTasks />} />
          {/* Add more nested pages if needed */}
          {/* <Route path="profile" element={<Profile />} /> */}
        </Route>

        <Route
          path="/login"
          element={user ? <Navigate to="/layout" replace /> : <Login onSubmit={handleLogin} />}
        />

        <Route
          path="/signup"
          element={user ? <Navigate to="/layout" replace /> : <Signup />}
        />
      </Routes>
    </>
  );
}

export default App;