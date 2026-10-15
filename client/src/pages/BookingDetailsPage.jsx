import { getSingleBooking } from "../api/BookingApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookingDetailsPage = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;

      setError("");

      try {
        const response = await getSingleBooking(id);

        setBooking(response.booking);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch booking details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h1 className="font-semibold text-red-700">Unable to load booking</h1>

          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>

          <p className="mt-1 text-gray-600">
            Complete information about your booking
          </p>
        </div>

        {/* Booking Summary */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          {/* PNR + Status */}
          <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-500">PNR</p>

              <p className="text-2xl font-bold text-gray-900">{booking.pnr}</p>
            </div>

            <div className="flex gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {booking.bookingStatus}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                Payment: {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Train Details */}
          <div className="border-b py-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Train Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Train Name</p>

                <p className="font-medium text-gray-900">
                  {booking.train?.trainName || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Train Number</p>

                <p className="font-medium text-gray-900">
                  {booking.train?.trainNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Journey Details */}
          <div className="border-b py-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Journey Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Journey Date</p>

                {new Date(booking.schedule.journeyDate).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">Departure</p>

                <p className="font-medium text-gray-900">
                  {booking.schedule?.departureTime || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Arrival</p>

                <p className="font-medium text-gray-900">
                  {booking.schedule?.arrivalTime || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Class + Fare */}
          <div className="border-b py-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Fare Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Class</p>

                <p className="font-medium text-gray-900">{booking.classType}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Fare</p>

                <p className="text-xl font-bold text-gray-900">
                  ₹{booking.totalFare}
                </p>
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div className="py-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Passengers
            </h2>

            <div className="space-y-3">
              {booking.passengers?.map((passenger, index) => (
                <div
                  key={passenger._id || index}
                  className="rounded-lg border bg-gray-50 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>

                      <p className="font-medium text-gray-900">
                        {passenger.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Age</p>

                      <p className="font-medium text-gray-900">
                        {passenger.age}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Gender</p>

                      <p className="font-medium text-gray-900">
                        {passenger.gender}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
