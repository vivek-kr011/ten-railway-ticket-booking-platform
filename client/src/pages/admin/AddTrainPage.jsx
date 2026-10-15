import { useEffect, useState } from "react";
import { fetchStations } from "@/api/StationApi";
import { createTrain } from "@/api/AdminApi";

function AddTrainPage() {
  const [stations, setStations] = useState([]);
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [loadingStations, setLoadingStations] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getStations = async () => {
      try {
        setLoadingStations(true);
        setError(null);

        const data = await fetchStations();

        const stationList = Array.isArray(data)
          ? data
          : (data?.stations ?? data?.data ?? []);

        setStations(stationList);
      } catch (err) {
        // HANDLE any API error
        console.error("Failed to fetch stations:", err);
        setError("Could not load stations. Please try again later.");
      } finally {
        setLoadingStations(false);
      }
    };

    getStations();
  }, []);

  // WHEN source changes: STORE selected source ID
  const handleSourceChange = (e) => {
    // setSourceId(e.target.value);

    const selectedId = e.target.value;

    setSourceId(selectedId);
    console.log("Selected Source ID:", selectedId);
  };

  // WHEN destination changes: STORE selected destination ID
  const handleDestinationChange = (e) => {
    // setDestinationId(e.target.value);

    const selectedId = e.target.value;

    setDestinationId(selectedId);
    console.log("Selected Destination ID:", selectedId);
  };

  const [classes, setClasses] = useState([
    {
      classType: "",
      fare: "",
      totalSeats: "",
    },
  ]);

  const handleAddClass = () => {
    setClasses((prevClasses) => [
      ...prevClasses,
      {
        classType: "",
        fare: "",
        totalSeats: "",
      },
    ]);
  };

  const handleRemoveClass = (index) => {
    setClasses((prevClasses) =>
      prevClasses.filter((_, classIndex) => classIndex !== index),
    );
  };

  const handleClassChange = (index, field, value) => {
    setClasses((prevClasses) =>
      prevClasses.map((trainClass, classIndex) =>
        classIndex === index
          ? {
              ...trainClass,
              [field]: value,
            }
          : trainClass,
      ),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sourceId === destinationId) {
      setError("Source and destination cannot be the same.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const form = e.currentTarget;

      const trainData = {
        trainNumber: form.trainNumber.value.trim(),
        trainName: form.trainName.value.trim(),
        source: sourceId,
        destination: destinationId,
        classes: classes.map((trainClass) => ({
          classType: trainClass.classType,
          fare: Number(trainClass.fare),
          totalSeats: Number(trainClass.totalSeats),
        })),
      };

      const result = await createTrain(trainData);

      console.log("Train created successfully:", result);
      alert("Train created successfully!");
    } catch (err) {
      console.error("Failed to create train:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create train. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Add New Train</h1>

          <p className="mt-2 text-gray-600">
            Enter train details to create a new train.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-md"
        >
          {error && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mb-8">
            <h2 className="mb-4 border-b pb-3 text-xl font-semibold text-gray-800">
              Train Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Train Number
                </label>

                <input
                  type="text"
                  name="trainNumber"
                  placeholder="Enter train number"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Train Name
                </label>

                <input
                  type="text"
                  name="trainName"
                  placeholder="Enter train name"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Source
                </label>

                <select
                  name="source"
                  value={sourceId}
                  onChange={handleSourceChange}
                  required
                  disabled={loadingStations || Boolean(error)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="">
                    {loadingStations ? "Loading stations..." : "Select source"}
                  </option>

                  {stations.map((station) => (
                    <option key={station._id} value={station._id}>
                      {station.stationName ??
                        station.name ??
                        station.stationCode ??
                        station._id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Destination
                </label>

                <select
                  name="destination"
                  value={destinationId}
                  onChange={handleDestinationChange}
                  required
                  disabled={loadingStations || Boolean(error)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="">
                    {loadingStations
                      ? "Loading stations..."
                      : "Select destination"}
                  </option>

                  {stations.map((station) => (
                    <option key={station._id} value={station._id}>
                      {station.stationName ??
                        station.name ??
                        station.stationCode ??
                        station._id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Train Classes
              </h2>

              <button
                type="button"
                onClick={handleAddClass}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Class
              </button>
            </div>

            <div className="space-y-5">
              {classes.map((trainClass, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">
                      Class {index + 1}
                    </h3>

                    {classes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveClass(index)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Class Type
                      </label>

                      <select
                        value={trainClass.classType}
                        onChange={(e) =>
                          handleClassChange(index, "classType", e.target.value)
                        }
                        required
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
                      >
                        <option value="">Select class</option>
                        <option value="SL">Sleeper</option>
                        <option value="AC_3">AC 3 Tier</option>
                        <option value="AC_2">AC 2 Tier</option>
                        <option value="AC_1">AC 1st Class</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Fare
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={trainClass.fare}
                        onChange={(e) =>
                          handleClassChange(index, "fare", e.target.value)
                        }
                        placeholder="Enter fare"
                        required
                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Total Seats
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={trainClass.totalSeats}
                        onChange={(e) =>
                          handleClassChange(index, "totalSeats", e.target.value)
                        }
                        placeholder="Enter seats"
                        required
                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <button
              type="submit"
              disabled={loadingStations || Boolean(error) || submitting}
              className="w-full rounded-md bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating Train..." : "Create Train"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTrainPage;
