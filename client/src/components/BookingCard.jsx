import { useState } from "react";
import { cancelBooking } from "../api/BookingApi";
import toast from "react-hot-toast";

function BookingCard({ booking, onBookingCancelled }) {
  const [cancelling, setCancelling] = useState(false);

  const isCancelled = booking.bookingStatus === "CANCELLED";

  const handleCancelBooking = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) return;

    try {
      setCancelling(true);

      const response = await cancelBooking(booking._id);

      if (response?.booking?.bookingStatus === "CANCELLED") {
        toast.success("Booking cancelled successfully.");
        onBookingCancelled(response.booking._id);
      } else {
        toast.error("Unable to cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Cancel Booking Error:", error);

      toast.error(
        error.response?.data?.message ||
          "An error occurred while cancelling the booking.",
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <article className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
      {" "}
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            PNR Number
          </p>

          <p className="mt-1 text-lg font-bold tracking-wide text-slate-900">
            {booking.pnr}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isCancelled
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {booking.bookingStatus}
        </span>
      </div>
      {/* Train Information */}
      <div className="mt-5">
        <h2 className="text-lg font-bold text-slate-900">
          {booking.train?.trainName || "Train details unavailable"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Train No. {booking.train?.trainNumber || "—"}
        </p>
      </div>
      {/* Journey */}
      <div className="mt-5 border-y border-slate-100 py-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div>
            <p className="text-xs text-slate-500">Departure</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {booking.schedule?.departureTime || "—"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-blue-600">
            <span className="h-px w-5 bg-blue-200 sm:w-10" />
            <span aria-hidden="true">→</span>
            <span className="h-px w-5 bg-blue-200 sm:w-10" />
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">Arrival</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {booking.schedule?.arrivalTime || "—"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Journey Date:{" "}
          <span className="font-medium text-slate-700">
            {booking.schedule?.journeyDate || "—"}
          </span>
        </p>
      </div>
      {/* Class and Fare */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">Travel Class</p>
          <p className="mt-1 font-semibold text-slate-800">
            {booking.classType || "—"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Total Fare</p>
          <p className="mt-1 text-xl font-bold text-blue-700">
            ₹{booking.totalFare ?? 0}
          </p>
        </div>
      </div>
      {/* Passengers */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900">Passengers</h3>

          <span className="text-xs text-slate-500">
            {booking.passengers?.length || 0} passenger(s)
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {booking.passengers?.map((passenger, index) => (
            <div
              key={passenger._id || index}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {index + 1}. {passenger.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Age: {passenger.age} · Gender: {passenger.gender}
                </p>
              </div>
            </div>
          ))}

          {(!booking.passengers || booking.passengers.length === 0) && (
            <p className="text-sm text-slate-500">
              No passenger details available.
            </p>
          )}
        </div>
      </div>
      {/* Payment and Cancellation */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <div>
          <p className="text-xs text-slate-500">Payment Status</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {booking.paymentStatus || "—"}
          </p>
        </div>

        {!isCancelled && (
          <button
            type="button"
            onClick={handleCancelBooking}
            disabled={cancelling}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}
      </div>
    </article>
  );
}

export default BookingCard;
