import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state?.bookingData;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);

  if (!bookingData) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">No Booking Data</h1>

          <p className="mt-2 text-gray-600">Please start your booking again.</p>

          <button
            type="button"
            onClick={() => navigate("/search")}
            className="mt-6 rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Search Trains
          </button>
        </div>
      </div>
    );
  }

  const { 
    train, 
    schedule, 
    selectedClass, 
    passengers, 
    totalFare, 
    bookingId 
    } = bookingData;

  /* -------------- HANDLE PAYMENT ------------------ */
  const handleProceedPayment = async () => {
    // Check payment method
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    // Prevent multiple clicks
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");

      /* STEP 1: --------------- CREATE PAYMENT ----------------- */
      const paymentData = {
        bookingId,
        paymentMethod: selectedPaymentMethod,
      };

      console.log("Payment Data:", paymentData);

      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      console.log("Create Payment Response:", data);

      // Check create payment response
      if (!response.ok) {
        alert(data.message || "Payment initiation failed.");
        return;
      }

      // Payment object received
      const paymentId = data.payment._id;

      console.log("Payment Created:", data.payment);

      /* STEP 2: ---------------- PROCESS PAYMENT ----------------- */
      const processPaymentData = {
        paymentId,
        result: "SUCCESS",
      };

      console.log("Process Payment Data:", processPaymentData);

      const processResponse = await fetch(
        "http://localhost:5000/api/payments/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(processPaymentData),
        },
      );

      const processData = await processResponse.json();

      console.log("Process Payment Response:", processData);

      // Check process payment response
      if (!processResponse.ok) {
        alert(processData.message || "Payment processing failed.");
        return;
      }

      /* --------- STEP 3: PAYMENT SUCCESS ---------------- */
      setPaymentSuccess(true);

      setConfirmedBooking(processData.booking);

      setPaymentDetails(processData.payment);

      console.log("Payment Successful:", processData.payment);

      console.log("Booking Confirmed:", processData.booking);

    } catch (error) {
      console.error("Payment Error:", error);

      alert("Something went wrong while processing payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  /*------------------ PAYMENT SUCCESS UI ------------------- */
  if (paymentSuccess && confirmedBooking && paymentDetails) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          {/* Success Message */}
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl text-green-600">✓</span>
            </div>

            <h1 className="mt-5 text-3xl font-bold text-green-600">
              Payment Successful
            </h1>

            <p className="mt-2 text-gray-600">
              Your ticket has been successfully booked.
            </p>

            {/* PNR */}
            <div className="mt-6 rounded-lg bg-gray-50 p-5">
              <p className="text-sm text-gray-500">PNR Number</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {confirmedBooking.pnr}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {/* Train */}
              <div>
                <p className="text-sm text-gray-500">Train</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {train.trainName}
                </p>

                <p className="text-sm text-gray-600">
                  Train No: {train.trainNumber}
                </p>
              </div>

              {/* Route */}
              <div>
                <p className="text-sm text-gray-500">Route</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {train.source?.name} → {train.destination?.name}
                </p>
              </div>

              {/* Journey Date */}
              <div>
                <p className="text-sm text-gray-500">Journey Date</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {new Date(schedule.journeyDate).toLocaleDateString("en-IN")}
                </p>
              </div>

              {/* Class */}
              <div>
                <p className="text-sm text-gray-500">Class</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {confirmedBooking.classType}
                </p>
              </div>

              {/* Passengers */}
              <div>
                <p className="text-sm text-gray-500">Passengers</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {confirmedBooking.passengers.length}
                </p>
              </div>

              {/* Booking Status */}
              <div>
                <p className="text-sm text-gray-500">Booking Status</p>

                <p className="mt-1 font-semibold text-green-600">
                  {confirmedBooking.bookingStatus}
                </p>
              </div>

              {/* Payment Status */}
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>

                <p className="mt-1 font-semibold text-green-600">
                  {confirmedBooking.paymentStatus}
                </p>
              </div>

              {/* Total Fare */}
              <div>
                <p className="text-sm text-gray-500">Total Fare</p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  ₹{confirmedBooking.totalFare}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {/* Payment Method */}
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {paymentDetails.paymentMethod}
                </p>
              </div>

              {/* Transaction ID */}
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>

                <p className="mt-1 break-all font-semibold text-gray-900">
                  {paymentDetails.transactionId}
                </p>
              </div>

              {/* Amount */}
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  ₹{paymentDetails.amount}
                </p>
              </div>

              {/* Payment Status */}
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>

                <p className="mt-1 font-semibold text-green-600">
                  {paymentDetails.status}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              My Bookings
            </button>

            <button
              type="button"
              onClick={() => navigate("/search")}
              className="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Book Another Ticket
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------- PAYMENT PAGE ----------------- */
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>

          <p className="mt-2 text-gray-600">
            Review your booking and select a payment method.
          </p>
        </div>

        {/* Booking Summary */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900">Booking Summary</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Train */}
            <div>
              <p className="text-sm text-gray-500">Train</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {train.trainName}
              </p>

              <p className="text-sm text-gray-600">
                Train No: {train.trainNumber}
              </p>
            </div>

            {/* Route */}
            <div>
              <p className="text-sm text-gray-500">Route</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {train.source?.name} → {train.destination?.name}
              </p>
            </div>

            {/* Journey Date */}
            <div>
              <p className="text-sm text-gray-500">Journey Date</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {new Date(schedule.journeyDate).toLocaleDateString("en-IN")}
              </p>
            </div>

            {/* Class */}
            <div>
              <p className="text-sm text-gray-500">Class</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {selectedClass.classType}
              </p>
            </div>

            {/* Passengers */}
            <div>
              <p className="text-sm text-gray-500">Passengers</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {passengers.length}
              </p>
            </div>

            {/* Total Fare */}
            <div>
              <p className="text-sm text-gray-500">Total Fare</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                ₹{totalFare}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>

          <div className="mt-5 space-y-3">
            {/* UPI */}
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("UPI")}
              disabled={isProcessing}
              className={`w-full rounded-lg border p-4 text-left ${
                selectedPaymentMethod === "UPI"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <p className="font-medium text-gray-900">UPI</p>
            </button>

            {/* Card */}
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("CARD")}
              disabled={isProcessing}
              className={`w-full rounded-lg border p-4 text-left ${
                selectedPaymentMethod === "CARD"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <p className="font-medium text-gray-900">Card</p>
            </button>

            {/* Net Banking */}
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("NET_BANKING")}
              disabled={isProcessing}
              className={`w-full rounded-lg border p-4 text-left ${
                selectedPaymentMethod === "NET_BANKING"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <p className="font-medium text-gray-900">Net Banking</p>
            </button>
          </div>
        </div>

        {/* Continue Payment */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleProceedPayment}
            disabled={isProcessing}
            className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? "Processing Payment..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
