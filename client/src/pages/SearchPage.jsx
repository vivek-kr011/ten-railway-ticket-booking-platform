import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { fetchStations } from "../api/StationApi";
import { searchTrains } from "../api/TrainApi";

function SearchPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    journeyDate: "",
  });

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await fetchStations();

        console.log("Stations Response:", response);

        setStations(response.stations || []);
      } catch (error) {
        console.error("Failed to fetch stations:", error);

        toast.error(
          error.response?.data?.message || "Failed to load stations."
        );
      }
    };

    loadStations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { source, destination, journeyDate } = formData;

    // Validation
    if (!source || !destination || !journeyDate) {
      toast.error("Please fill all fields.");
      return;
    }

    if (source === destination) {
      toast.error("Source and destination cannot be same.");
      return;
    }

    try { 
      setLoading(true);

      console.log("Search Data:", formData);

      // Call search API
      const response = await searchTrains(formData);

      console.log("Search Response:", response);

      // Navigate to Search Results
      navigate("/search/results", {
        state: {
          searchData: formData,
          results: response,
        },
      });
    } catch (error) {
      console.error("Failed to search trains:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to search trains."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Search Trains
          </h1>

          <p className="mt-2 text-gray-600">
            Find trains for your journey
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-md"
        >
          <div className="grid gap-5 md:grid-cols-3">

            {/* Source */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                From
              </label>

              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select source
                </option>

                {stations.map((station) => (
                  <option
                    key={station._id}
                    value={station._id}
                  >
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                To
              </label>

              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Select destination
                </option>

                {stations.map((station) => (
                  <option
                    key={station._id}
                    value={station._id}
                  >
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Journey Date
              </label>

              <input
                type="date"
                name="journeyDate"
                value={formData.journeyDate}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search Trains"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SearchPage;