import { useEffect, useState } from "react";
import {
  getAllTrains,
  updateTrain,
  fetchStations,
  deleteTrain,
} from "@/api/AdminApi";

function ManageTrainsPage() {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [updatedFormData, setUpdatedFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trainResponse, stationResponse] = await Promise.all([
          getAllTrains(),
          fetchStations(),
        ]);

        setTrains(trainResponse.trains || []);
        setStations(stationResponse.stations || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load trains.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateClick = (train) => {
    const formData = {
      trainNumber: train.trainNumber ?? "",
      trainName: train.trainName ?? "",
      source: train.source?._id ?? train.source ?? "",
      destination: train.destination?._id ?? train.destination ?? "",
      classes: (train.classes || []).map((item) => ({
        classType: item.classType ?? "",
        fare: item.fare ?? "",
        totalSeats: item.totalSeats ?? "",
      })),
    };

    setSelectedTrain(train);
    setUpdatedFormData(formData);
    setSubmitError("");
    setSuccessMessage("");
    setIsUpdateFormOpen(true);
  };

  /* Ye function train number, train name, source aur destination 
    jaise fields ko update karta hai. 
  */
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setUpdatedFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* fare aur seats ko change karna */
  const handleClassChange = (index, field, value) => {
    setUpdatedFormData((prev) => ({
      ...prev,
      classes: prev.classes.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTrain) {
      setSubmitError("Please select a train to update.");
      return;
    }

    setSubmitError("");
    setSuccessMessage("");

    const { trainNumber, trainName, source, destination, classes } =
      updatedFormData;

    if (
      String(trainNumber).trim() === "" ||
      !trainName?.trim() ||
      !source ||
      !destination
    ) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    if (String(source) === String(destination)) {
      setSubmitError("Source and destination cannot be the same.");
      return;
    }

    if (!Array.isArray(classes) || classes.length === 0) {
      setSubmitError("At least one train class is required.");
      return;
    }

    const invalidClass = classes.some(
      (item) =>
        !item.classType ||
        item.fare === "" ||
        !Number.isFinite(Number(item.fare)) ||
        Number(item.fare) <= 0 ||
        item.totalSeats === "" ||
        !Number.isInteger(Number(item.totalSeats)) ||
        Number(item.totalSeats) < 1,
    );

    if (invalidClass) {
      setSubmitError("Please enter valid fares and seat counts.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...updatedFormData,
        trainNumber: Number(trainNumber),
        trainName: trainName.trim(),
        classes: classes.map((item) => ({
          classType: item.classType,
          fare: Number(item.fare),
          totalSeats: Number(item.totalSeats),
        })),
      };

      // Update train through API
      const response = await updateTrain(selectedTrain._id, payload);

      if (!response.train) {
        throw new Error("The API response does not contain the updated train.");
      }

      // Fetch trains again so source and destination are populated
      const updatedTrainsResponse = await getAllTrains();

      setTrains(updatedTrainsResponse.trains || []);

      setIsUpdateFormOpen(false);
      setSelectedTrain(null);
      setUpdatedFormData({});

      setSuccessMessage(response.message || "Train updated successfully.");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Failed to update train.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdateFormOpen(false);
    setSelectedTrain(null);
    setUpdatedFormData({});
    setSubmitError("");
  };

  const handleDeleteTrain = async (train) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${train.trainNumber}`,
    );

    if (!confirmed) {
      return;
    }

    setSubmitError("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);

      const response = await deleteTrain(train._id);

      setTrains((prevTrains) =>
        prevTrains.filter((item) => item._id !== train._id),
      );

      setSuccessMessage(response.message || "Train delted successfully.");
    } catch (error) {
      submitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete train.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Trains</h1>
          <p className="mt-2 text-gray-600">
            View and manage all trains in the system.
          </p>
        </div>

        {successMessage && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-green-100 p-3 text-green-700"
          >
            {successMessage}
          </p>
        )}

        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-xl font-semibold text-gray-800">All Trains</h2>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
              Total Trains: {trains.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-4">Train Number</th>
                  <th className="px-5 py-4">Train Name</th>
                  <th className="px-5 py-4">Source</th>
                  <th className="px-5 py-4">Destination</th>
                  <th className="px-5 py-4">Classes</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-gray-500"
                    >
                      Loading trains...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-red-500"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : trains.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-gray-500"
                    >
                      No trains to display yet.
                    </td>
                  </tr>
                ) : (
                  trains.map((train) => (
                    <tr key={train._id}>
                      <td className="px-5 py-4 font-medium">
                        {train.trainNumber}
                      </td>
                      <td className="px-5 py-4">{train.trainName}</td>
                      <td className="px-5 py-4">{train.source?.name}</td>
                      <td className="px-5 py-4">{train.destination?.name}</td>
                      <td className="px-5 py-4">
                        {train.classes
                          ?.map((item) => item.classType)
                          .join(", ")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateClick(train)}
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            Update
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTrain(train)}
                            disabled={isSubmitting}
                            title="Delete this train"
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isUpdateFormOpen && selectedTrain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="my-6 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
              <h2 className="mb-5 text-2xl font-bold text-gray-800">
                Update Train
              </h2>

              {submitError && (
                <p
                  role="alert"
                  className="mb-4 rounded-lg bg-red-100 p-3 text-red-700"
                >
                  {submitError}
                </p>
              )}

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Train Number
                  </label>
                  <input
                    type="number"
                    name="trainNumber"
                    value={updatedFormData.trainNumber ?? ""}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-md border p-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Train Name
                  </label>
                  <input
                    type="text"
                    name="trainName"
                    value={updatedFormData.trainName ?? ""}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-md border p-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Source Station
                  </label>
                  <select
                    name="source"
                    value={updatedFormData.source ?? ""}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-md border p-2"
                  >
                    <option value="">Select source</option>
                    {stations.map((station) => (
                      <option key={station._id} value={station._id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Destination Station
                  </label>
                  <select
                    name="destination"
                    value={updatedFormData.destination ?? ""}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-md border p-2"
                  >
                    <option value="">Select destination</option>
                    {stations.map((station) => (
                      <option key={station._id} value={station._id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Classes and Fares</h3>
                  {updatedFormData.classes?.map((item, index) => (
                    <div
                      key={`${item.classType}-${index}`}
                      className="mb-3 grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-3"
                    >
                      <div>
                        <label className="mb-1 block text-sm">Class</label>
                        <input
                          value={item.classType}
                          readOnly
                          className="w-full rounded-md border bg-gray-100 p-2"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm">Fare</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.fare}
                          onChange={(e) =>
                            handleClassChange(index, "fare", e.target.value)
                          }
                          required
                          className="w-full rounded-md border p-2"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm">
                          Total Seats
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.totalSeats}
                          onChange={(e) =>
                            handleClassChange(
                              index,
                              "totalSeats",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full rounded-md border p-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleCancelUpdate}
                    disabled={isSubmitting}
                    className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageTrainsPage;
