import { useEffect, useState } from "react";
import { getDashboardStats } from "@/api/AdminApi";

function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardStats();

        console.log("Dashboard Stats Response:", response);

        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard Stats Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch dashboard statistics.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Overview of your Ticket Booking System
        </p>
      </div>

      {/* Dashboard Cards */}
      {dashboard && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Users */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Total Users
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-600">
              {dashboard.totalUsers}
            </p>
          </div>

          {/* Total Trains */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Total Trains
            </p>

            <p className="mt-3 text-3xl font-bold text-green-600">
              {dashboard.totalTrains}
            </p>
          </div>

          {/* Total Schedules */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Total Schedules
            </p>

            <p className="mt-3 text-3xl font-bold text-purple-600">
              {dashboard.totalSchedules}
            </p>
          </div>

          {/* Total Bookings */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Total Bookings
            </p>

            <p className="mt-3 text-3xl font-bold text-orange-600">
              {dashboard.totalBookings}
            </p>
          </div>

          {/* Total Payments */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Total Payments
            </p>

            <p className="mt-3 text-3xl font-bold text-red-600">
              {dashboard.totalPayments}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;