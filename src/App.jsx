// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import ShowcaseFeed from "./pages/ShowcaseFeed"; // ✅ create this page
import CollaborationRoom from "./pages/CollaborationRoom";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Features from "./pages/Features";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Support from "./pages/Support";



import { AuthProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />

          {/* ✅ Showcase Feed route */}
          <Route
            path="/showcase"
            element={
              <ProtectedRoute>
                <ShowcaseFeed />
              </ProtectedRoute>
            }
            
          />
           {/* ✅ Collaboration Room route */}
          <Route
  path="/collaboration"
  element={
    <ProtectedRoute>
      <CollaborationRoom />
    </ProtectedRoute>
  }
/>
 {/* Notification page route */}
 <Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>
 {/* ✅ Settings page route */}
 <Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
{/* ✅ features page route */}
<Route path="/features" element={<Features />} />
{/* ✅ privacy page route */}
<Route path="/privacy" element={<Privacy />} />
{/* ✅ terms page route */}
<Route path="/terms" element={<Terms />} />
{/* ✅ support page route */}
<Route path="/support" element={<Support />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}