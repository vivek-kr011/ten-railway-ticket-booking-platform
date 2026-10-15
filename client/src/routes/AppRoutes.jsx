import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/Mainlayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import BookingDetailsPage from "../pages/BookingDetailsPage";
import SearchPage from "../pages/SearchPage";
import SearchResultsPage from "../pages/SearchResultsPage";
import TrainDetailsPage from "../pages/TrainDetailsPage";
import BookingPage from "../pages/BookingPage";
import PaymentPage from "../pages/PaymentPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AddTrainPage from "../pages/admin/AddTrainPage";
import ManageTrainsPage from "../pages/admin/ManageTrainsPage";
import CreateSchedulePage from "../pages/admin/CreateSchedulePage";
import AdminStationsPage from "../pages/admin/AdminStationsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/my-bookings/:id" element={<BookingDetailsPage />} />
          </Route>

          {/* Other General Routes */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/results" element={<SearchResultsPage />} />
          <Route path="/trains/:trainId" element={<TrainDetailsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

              <Route path="/admin/trains/add" element={<AddTrainPage />} />

              <Route path="/admin/trains" element={<ManageTrainsPage />} />

              <Route
                path="/admin/schedules/create"
                element={<CreateSchedulePage />}
              />

              <Route path="/admin/stations" element={<AdminStationsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
