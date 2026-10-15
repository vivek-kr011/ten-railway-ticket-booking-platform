import { useLocation, useNavigate } from "react-router-dom";

import { fetchStations } from "@/api/StationApi";
import { useEffect, useState } from "react";

function SearchResultsPage() {
  const [stations, setStations] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results;
  const searchData = location.state?.searchData;

  const sourceStation = stations.find(
    (station) => station._id === searchData?.source,
  );

  const destinationStation = stations.find(
    (station) => station._id === searchData?.destination,
  );

  useEffect(() => {
    const fetchStationsData = async () => {
      try {
        const response = await fetchStations();

        if (response.stations) {
          setStations(response.stations);
        } else {
          setStations([]);
        }
      } catch (error) {
        console.log("Failed to fetch stations:", error);
      }
    };

    fetchStationsData();
  }, []);

  if (!results) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">No Search Data</h1>

          <p className="mt-2 text-gray-600">Please search for trains first.</p>

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

  // Backend response:
  // results.results = [{ train, schedule }]

  const trainResults = results.results || [];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">
                {sourceStation
                  ? `${sourceStation.name} (${sourceStation.code})`
                  : searchData?.source}
              </span>
              {" → "}
              <span className="font-medium text-gray-800">
                {destinationStation
                  ? `${destinationStation.name} (${destinationStation.code})`
                  : searchData?.destination}
              </span>
            </p>

            <p>
              Journey Date:{" "}
              <span className="font-medium text-gray-800">
                {searchData?.journeyDate}
              </span>
            </p>
          </div>
        </div>

        {/* No Results */}
        {trainResults.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">
              No Trains Found
            </h2>

            <p className="mt-2 text-gray-600">
              No trains are available for the selected journey.
            </p>

            <button
              onClick={() => navigate("/search")}
              className="mt-5 rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Search Again
            </button>
          </div>
        ) : (
          /* Train Results */
          <div className="space-y-5">
            {trainResults.map((result) => {
              const train = result.train;
              const schedule = result.schedule;

              return (
                <div
                  key={schedule._id}
                  className="rounded-xl bg-white p-6 shadow-md"
                >
                  {/* Train Header */}
                  <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {train.trainName}
                      </h2>

                      <p className="mt-1 text-gray-600">
                        Train No: {train.trainNumber}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      {schedule.status}
                    </span>
                  </div>

                  {/* Journey Details */}
                  <div className="border-b py-5">
                    <div className="grid gap-6 md:grid-cols-3">
                      {/* Departure */}
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {schedule.departureTime || "--:--"}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {train.source?.name || "Source"}
                        </p>
                      </div>

                      {/* Journey Date */}
                      <div>
                        <p className="text-sm text-gray-500">Journey Date</p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {new Date(schedule.journeyDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      {/* Arrival */}
                      <div>
                        <p className="text-sm text-gray-500">Arrival</p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {schedule.arrivalTime || "--:--"}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {train.destination?.name || "Destination"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Classes */}
                  <div className="pt-5">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Available Classes
                    </h3>

                    <div className="grid gap-3 md:grid-cols-2">
                      {train.classes?.map((trainClass) => (
                        <div
                          key={trainClass._id}
                          className="rounded-lg border bg-gray-50 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {trainClass.classType}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                {trainClass.totalSeats} seats
                              </p>
                            </div>

                            <p className="text-lg font-bold text-gray-900">
                              ₹{trainClass.fare}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() =>
                        navigate(`/trains/${train._id}`, {
                          state: {
                            train,
                            schedule,
                            searchData,
                          },
                        })
                      }
                      className="rounded-md bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
                    >
                      View Train
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;
