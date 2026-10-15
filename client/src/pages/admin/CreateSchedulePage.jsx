import { useState, useEffect } from "react";
import { getAllTrains, createSchedule } from "@/api/AdminApi";

function CreateSchedulePage() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTrain, setSelectedTrain] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllTrains();

        setTrains(response.trains || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load trains",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTrains();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setSubmitError("");

    if (!selectedTrain || !journeyDate || !departureTime || !arrivalTime) {
      setSubmitError("Please fill in all details.");
      return;
    }

    setSubmitting(true);

    try {
      const scheduleData = {
        train: selectedTrain,
        journeyDate,
        departureTime,
        arrivalTime,
      };

      const response = await createSchedule(scheduleData);

      setSuccessMessage(response.message || "Schedule created successfully.");

      setSelectedTrain("");
      setJourneyDate("");
      setDepartureTime("");
      setArrivalTime("");
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create schedule.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Schedule</h1>

          <p className="mt-2 text-gray-600">
            Select a train and schedule its journey date and timings.
          </p>
        </div>

        {/* Schedule Form */}
        <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
          <h2 className="border-b border-gray-200 pb-4 text-xl font-semibold text-gray-900">
            Schedule Information
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Select Train */}
            <div>
              <label
                htmlFor="train"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Select Train
              </label>

              {successMessage && (
                <p
                  className="rounded-lg bg-green-50 p-3 text-green-700"
                  role="status"
                >
                  {successMessage}
                </p>
              )}

              {submitError && (
                <p
                  className="rounded-lg bg-red-50 p-3 text-red-700"
                  role="alert"
                >
                  {submitError}
                </p>
              )}

              <select
                id="train"
                name="train"
                value={selectedTrain}
                onChange={(e) => setSelectedTrain(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  Select a train
                </option>

                {/* API request chalne par */}
                {loading && (
                  <option value="" disabled>
                    Loading Trains...
                  </option>
                )}

                {/* API fail hone par */}
                {!loading && error && (
                  <option value="" disabled>
                    Failed to load Trains
                  </option>
                )}

                {/* request complete hone par */}
                {!loading && !error && trains.length === 0 && (
                  <option value="" disabled>
                    No trains available
                  </option>
                )}

                {/* Har train ke liye dropdown option create karna hai */}
                {!loading &&
                  !error &&
                  trains.map((train) => (
                    <option key={train._id} value={train._id}>
                      {train.trainNumber} - {train.trainName}
                    </option>
                  ))}
              </select>

              <p className="mt-1 text-sm text-gray-500">
                Choose the train for this schedule.
              </p>
            </div>

            {/* Journey Date */}
            <div>
              <label
                htmlFor="journeyDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Journey Date
              </label>

              <input
                type="date"
                id="journeyDate"
                name="journeyDate"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Departure and Arrival */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="departureTime"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Departure Time
                </label>

                <input
                  type="time"
                  id="departureTime"
                  name="departureTime"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="arrivalTime"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Arrival Time
                </label>

                <input
                  type="time"
                  id="arrivalTime"
                  name="arrivalTime"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedTrain("");
                  setJourneyDate("");
                  setDepartureTime("");
                  setArrivalTime("");
                }}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={
                  submitting || loading || !!error || trains.length === 0
                }
                className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creating Schedule..." : "Create Schedule"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateSchedulePage;
