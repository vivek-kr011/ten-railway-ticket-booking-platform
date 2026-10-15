import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TrainDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const train = location.state?.train;
  const schedule = location.state?.schedule;
  const searchData = location.state?.searchData;

  const [selectedClass, setSelectedClass] = useState(null);

  // If user directly opens the URL
  if (!train || !schedule) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">
            No Train Data
          </h1>

          <p className="mt-2 text-gray-600">
            Please select a train from the search results.
          </p>

          <button
            onClick={() => navigate("/search")}
            className="mt-6 rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Search Trains
          </button>
        </div>
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

  const handleClassSelect = (trainClass) => {
    setSelectedClass(trainClass);
  };
    const handleContinueBooking = () => {
  if (!selectedClass) {
    return;
  }

  navigate("/booking", {
    state: {
      train,
      schedule,
      selectedClass,
      searchData,
    },
  });
};
  

    console.log("Selected Train:", train);
    console.log("Selected Schedule:", schedule);
    console.log("Selected Class:", selectedClass);
    console.log("Search Data:", searchData);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Search Results
        </button>

        {/* Train Details */}
        <div className="rounded-xl bg-white p-6 shadow-md">

          {/* Train Header */}
          <div className="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-center">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {train.trainName}
              </h1>

              <p className="mt-2 text-gray-600">
                Train No: {train.trainNumber}
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              {schedule.status}
            </span>

          </div>

          {/* Journey Details */}
          <div className="grid gap-6 border-b py-6 md:grid-cols-3">

            {/* Departure */}
            <div>
              <p className="text-sm text-gray-500">
                Departure
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {schedule.departureTime || "N/A"}
              </p>

              <p className="mt-1 text-gray-700">
                {train.source?.name || "Source"}
              </p>
            </div>

            {/* Journey Date */}
            <div>
              <p className="text-sm text-gray-500">
                Journey Date
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {formatDate(schedule.journeyDate)}
              </p>
            </div>

            {/* Arrival */}
            <div>
              <p className="text-sm text-gray-500">
                Arrival
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {schedule.arrivalTime || "N/A"}
              </p>

              <p className="mt-1 text-gray-700">
                {train.destination?.name || "Destination"}
              </p>
            </div>

          </div>

          {/* Available Classes */}
          <div className="pt-6">

            <h2 className="text-xl font-bold text-gray-900">
              Select Class
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              {train.classes?.map((trainClass) => {

                const isSelected =
                  selectedClass?._id === trainClass._id;

                return (
                  <button
                    key={trainClass._id}
                    type="button"
                    onClick={() => handleClassSelect(trainClass)}
                    className={`rounded-lg border p-5 text-left transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 bg-gray-50 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {trainClass.classType}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {trainClass.totalSeats} seats available
                        </p>
                      </div>

                      <p className="text-xl font-bold text-gray-900">
                        ₹{trainClass.fare}
                      </p>

                    </div>

                    {isSelected && (
                      <p className="mt-3 text-sm font-medium text-blue-600">
                        Selected
                      </p>
                    )}

                  </button>
                );
              })}

            </div>

            {/* Selected Class Summary */}
            {selectedClass && (
              <div className="mt-5 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-600">
                  Selected Class
                </p>

                <div className="mt-1 flex items-center justify-between">
                  <p className="font-semibold text-gray-900">
                    {selectedClass.classType}
                  </p>

                  <p className="font-bold text-gray-900">
                    ₹{selectedClass.fare}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Continue Booking */}
          <div className="mt-8 flex justify-end">

            <button
              onClick={handleContinueBooking}
              disabled={!selectedClass}
              className={`rounded-md px-6 py-3 font-medium text-white ${
                selectedClass
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              Continue Booking
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default TrainDetailsPage;