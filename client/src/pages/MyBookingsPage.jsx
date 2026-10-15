
import { useEffect, useState } from "react";

import { getMyBookings } from "../api/BookingApi";
import BookingCard from "../components/BookingCard";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleBookingCancelled = (cancelledBookingId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === cancelledBookingId
          ? { ...booking, bookingStatus: "CANCELLED" }
          : booking,
      ),
    );
  };

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyBookings();
        setBookings(response.bookings || []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch bookings. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      {/* Blurred Train Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 scale-105 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Vande-Bharat.png')",
          filter: "blur(5px)",
        }}
      />

      {/* Light Overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-white/70"
      />

      {/* Page Content */}
      <div className="relative z-10 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 text-slate-700">
            View and manage your train bookings.
          </p>

          {loading && (
            <p className="mt-6 text-slate-700">
              Loading your bookings...
            </p>
          )}

          {!loading && error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-white/90 p-4 text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white/90 p-6 text-slate-600 shadow-sm">
              No bookings found.
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <>
              <p className="mt-4 text-sm font-medium text-slate-700">
                Total bookings: {bookings.length}
              </p>

              <div className="mt-6 space-y-5">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onBookingCancelled={handleBookingCancelled}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBookingsPage;
