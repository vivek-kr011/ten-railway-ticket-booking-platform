import { useEffect, useState } from "react";
import { fetchStations, createStation } from "../../api/StationApi";

function AdminStationsPage() {
  const [stationName, setStationName] = useState("");
  const [stationCode, setStationCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetchStations();
        setStations(response.stations || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load stations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setSuccess("");

    const stationData = {
      name: stationName.trim(),
      code: stationCode.trim().toUpperCase(),
      city: city.trim(),
      state: state.trim(),
    };

    if (
      !stationData.name ||
      !stationData.code ||
      !stationData.city ||
      !stationData.state
    ) {
      setFormError("Please fill in all station fields.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createStation(stationData);

      if (response.station) {
        setStations((prevStations) => [
          ...prevStations,
          response.station,
        ]);
      }

      setStationName("");
      setStationCode("");
      setCity("");
      setState("");

      setSuccess(response.message || "Station created successfully.");
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create station."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Stations
          </h1>
          <p className="mt-2 text-gray-600">
            Add and manage railway stations in the system.
          </p>
        </div>

        {/* Add Station Form */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">
            Add New Station
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Station Name
              </label>
              <input
                type="text"
                required
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="e.g. Mumbai Central"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Station Code
              </label>
              <input
                type="text"
                required
                value={stationCode}
                onChange={(e) => setStationCode(e.target.value)}
                placeholder="e.g. MMCT"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 uppercase outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter state"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {formError && (
              <p
                role="alert"
                className="text-sm text-red-600 md:col-span-2"
              >
                {formError}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="text-sm text-green-600 md:col-span-2"
              >
                {success}
              </p>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Adding Station..." : "+ Add Station"}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Stations */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Existing Stations
            </h2>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {loading ? "Loading..." : `${stations.length} Stations`}
            </span>
          </div>

          {loading ? (
            <p className="p-6 text-gray-600">
              Loading stations...
            </p>
          ) : error ? (
            <p role="alert" className="p-6 text-red-600">
              {error}
            </p>
          ) : stations.length === 0 ? (
            <p className="p-6 text-gray-600">
              No stations found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Station Name
                    </th>
                    <th className="px-6 py-4 font-semibold">Code</th>
                    <th className="px-6 py-4 font-semibold">City</th>
                    <th className="px-6 py-4 font-semibold">State</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {stations.map((station) => (
                    <tr key={station._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {station.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700">
                          {station.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {station.city}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {station.state}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminStationsPage;
