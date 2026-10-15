import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [passengers, setPassengers] = useState([
    {
      name: "",
      age: "",
      gender: "",
    },
  ]);

  const train = location.state?.train;
  const schedule = location.state?.schedule;
  const selectedClass = location.state?.selectedClass;

  if (!train || !schedule || !selectedClass) {
    return (
      <div>
        <h1>No Booking</h1>

        <button onClick={() => navigate("/search")}>Search</button>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleAddPassenger = () => {
    const newPassenger = {
      name: "",
      age: "",
      gender: "",
    };

    setPassengers((previousPassengers) => [
      ...previousPassengers,
      newPassenger,
    ]);
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];

    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };

    setPassengers(updatedPassengers);
  };

  // Calculate total fare
  const calculateTotalFare = () => {
    return selectedClass.fare * passengers.length;
  };

  // Continue to payment
  const handleContinuePayment = async () => {
    // Validate passengers
    for (const passenger of passengers) {
      if (!passenger.name.trim()) {
        alert("Passenger name is required.");
        return;
      }

      if (!passenger.age) {
        alert("Passenger age is required.");
        return;
      }

      if (!passenger.gender) {
        alert("Passenger gender is required.");
        return;
      }
    }

    // Prepare booking request
    const bookingRequest = {
      trainId: train._id,
      scheduleId: schedule._id,
      classType: selectedClass.classType,
      passengers,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingRequest),
      });

      const data = await response.json();

      console.log("Create Booking Response:", data);

      if (!response.ok) {
        alert(data.message || "Booking failed.");
        return;
      }

      // Booking successfully created
      const booking = data.booking;

      console.log("Booking Created:", booking);

      navigate("/payment", {
        state: {
          bookingData: {
            train,
            schedule,
            selectedClass,
            passengers,
            totalFare: booking.totalFare,
            bookingId: booking._id,
            pnr: booking.pnr,
          },
        },
      });
    } catch (error) {
      console.error("Create Booking Error:", error);
      alert("Something went wrong while creating booking.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Ticket</h1>

          <p className="mt-2 text-gray-600">
            Enter passenger details to continue your booking.
          </p>
        </div>

        {/* Journey Summary */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900">Journey Details</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Train */}
            <div>
              <p className="text-sm text-gray-500">Train</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {train.trainName}
              </p>

              <p className="text-sm text-gray-600">{train.trainNumber}</p>
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
                {formatDate(schedule.journeyDate)}
              </p>
            </div>

            {/* Timing */}
            <div>
              <p className="text-sm text-gray-500">Timing</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {schedule.departureTime} → {schedule.arrivalTime}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Class */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900">Selected Class</h2>

          <div className="mt-5 flex items-center justify-between rounded-lg border bg-gray-50 p-5">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {selectedClass.classType}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {selectedClass.totalSeats} seats available
              </p>
            </div>

            <p className="text-xl font-bold text-gray-900">
              ₹{calculateTotalFare()}
            </p>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900">Passenger Details</h2>

          {passengers.map((passenger, index) => (
            <div key={index} className="mt-5 rounded-lg border bg-gray-50 p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Passenger {index + 1}
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter passenger name"
                    value={passenger.name}
                    onChange={(e) =>
                      handlePassengerChange(index, "name", e.target.value)
                    }
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Age
                  </label>

                  <input
                    type="number"
                    placeholder="Enter age"
                    value={passenger.age}
                    onChange={(e) =>
                      handlePassengerChange(index, "age", e.target.value)
                    }
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Gender
                  </label>

                  <select
                    value={passenger.gender}
                    onChange={(e) =>
                      handlePassengerChange(index, "gender", e.target.value)
                    }
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>

                    <option value="MALE">Male</option>

                    <option value="FEMALE">Female</option>

                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {/* Add Passenger */}
          <button
            type="button"
            onClick={handleAddPassenger}
            className="mt-5 rounded-md border border-blue-600 px-4 py-2 font-medium text-blue-600 hover:bg-blue-50"
          >
            + Add Passenger
          </button>
        </div>

        {/* Booking Summary */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900">Booking Summary</h2>

          <div className="mt-5 flex items-center justify-between border-b pb-4">
            <p className="text-gray-600">Total Fare</p>

            <p className="text-2xl font-bold text-gray-900">
              ₹{calculateTotalFare()}
            </p>
          </div>

          {/* Continue */}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleContinuePayment}
              className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
