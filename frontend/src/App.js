import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ChildForm from "./components/ChildForm";
import ChildList from "./components/ChildList";
import SponsorList from "./components/SponsorList";
import SponsorForm from "./components/SponsorForm";
import DonationList from "./components/DonationList";
import DonationForm from "./components/DonationForm";
import ProgramList from "./components/ProgramList";
import ProgramForm from "./components/ProgramForm";
import ChildProgramForm from "./components/ChildProgramForm";
import ChildProgramList from "./components/ChildProgramList";
import StaffList from "./components/StaffList";
import StaffForm from "./components/StaffForm";
import LoginPage from "./components/LoginPage";
import AdminRoute from "./components/AdminRoute";
import ManagerRoute from "./components/ManagerRoute";
import DashboardLayout from "./components/DashboardLayout";
import { UserProvider } from "./context/UserContext";  // <-- Import UserProvider
import 'bootstrap/dist/css/bootstrap.min.css';

// 👇 Welcome screen
const WelcomeScreen = () => (
  <div 
    className="d-flex flex-column justify-content-center align-items-center"
    style={{ height: "80vh", textAlign: "center" }}
  >
    <h2>Feel at Home!!</h2>
    <p>Select a menu from the sidebar to continue.</p>
  </div>
);

// 👇 PrivateRoute guard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <UserProvider> {/* <-- Wrap whole app in UserProvider */}
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* Nested Dashboard Routes */}
            <Route index element={<WelcomeScreen />} />

            {/* Children Routes */}
            <Route path="children" element={<ChildList />} />
            <Route
              path="children/add"
              element={
                <ManagerRoute>
                  <ChildForm />
                </ManagerRoute>
              }
            />
            <Route
              path="children/edit/:id"
              element={
                <ManagerRoute>
                  <ChildForm mode="edit" />
                </ManagerRoute>
              }
            />

            {/* Programs Routes */}
            <Route path="programs/list" element={<ProgramList />} />
            <Route
              path="programs/add"
              element={
                <ManagerRoute>
                  <ProgramForm />
                </ManagerRoute>
              }
            />
            <Route
              path="programs/edit/:id"
              element={
                <ManagerRoute>
                  <ProgramForm mode="edit" />
                </ManagerRoute>
              }
            />

            {/* Sponsors Routes */}
            <Route
              path="sponsors/list"
              element={
                <AdminRoute>
                  <SponsorList />
                </AdminRoute>
              }
            />
            <Route
              path="sponsors/add"
              element={
                <AdminRoute>
                  <SponsorForm />
                </AdminRoute>
              }
            />
            <Route
              path="sponsors/edit/:id"
              element={
                <AdminRoute>
                  <SponsorForm mode="edit" />
                </AdminRoute>
              }
            />

            {/* Donations Routes */}
            <Route
              path="donations/list"
              element={
                <AdminRoute>
                  <DonationList />
                </AdminRoute>
              }
            />
            <Route
              path="donations/add"
              element={
                <AdminRoute>
                  <DonationForm />
                </AdminRoute>
              }
            />
            <Route
              path="donations/edit/:id"
              element={
                <AdminRoute>
                  <DonationForm mode="edit" />
                </AdminRoute>
              }
            />

            {/* ChildProgram Routes */}
            <Route path="childprogram/list" element={<ChildProgramList />} />
            <Route
              path="childprogram/add"
              element={
                <ManagerRoute>
                  <ChildProgramForm />
                </ManagerRoute>
              }
            />
            <Route
              path="childprogram/edit/:id"
              element={
                <ManagerRoute>
                  <ChildProgramForm mode="edit" />
                </ManagerRoute>
              }
            />

            {/* Staff Routes */}
            <Route
              path="staff"
              element={
                <AdminRoute>
                  <StaffList />
                </AdminRoute>
              }
            />
            <Route
              path="staff/add"
              element={
                <AdminRoute>
                  <StaffForm />
                </AdminRoute>
              }
            />
            <Route
              path="staff/edit/:id"
              element={
                <AdminRoute>
                  <StaffForm mode="edit" />
                </AdminRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
