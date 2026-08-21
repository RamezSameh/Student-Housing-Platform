import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHousingById } from "../../services/housingService";

function HousingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [housing, setHousing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHousing = async () => {
      try {
        const result = await getHousingById(id);

        console.log("Housing Details:", result);

        if (!result.success) {
          throw new Error("Failed to load housing.");
        }

        setHousing(result.data);
      } catch (err) {
        console.error("Housing Details Error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load housing."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHousing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-xl text-gray-600">
          Loading housing details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>

        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!housing) {
    return (
      <div className="p-10 text-center">
        Housing not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back to Housing
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          {/* Image Placeholder */}
          <div className="flex h-72 items-center justify-center bg-gray-200">
            <span className="text-gray-500">
              Housing Image
            </span>
          </div>

          <div className="p-8">

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {housing.title}
                </h1>

                <p className="mt-2 text-gray-600">
                  📍 {housing.city}
                </p>
              </div>

              {housing.isVerified && (
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  ✓ Verified
                </span>
              )}

            </div>

            {/* Information */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Monthly Price
                </p>

                <p className="mt-2 text-xl font-bold text-blue-600">
                  {housing.price?.toLocaleString()} EGP
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Distance
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {housing.distanceKm} km
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Rating
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {housing.rating > 0
                    ? `⭐ ${housing.rating.toFixed(1)}`
                    : "No ratings"}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {housing.city}
                </p>
              </div>

            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Request Booking
              </button>

              <button
                type="button"
                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                ❤️ Add to Favorites
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default HousingDetails;