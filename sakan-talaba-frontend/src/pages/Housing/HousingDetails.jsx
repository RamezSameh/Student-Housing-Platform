import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  Navigation,
  ShieldCheck,
  Heart,
  Share2,
} from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";

import { getHousingById } from "../../services/housingService";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";

function HousingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const favorites = useFavorites();

  const [housing, setHousing] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================================
  // Load Housing
  // ==========================================================
  useEffect(() => {
    const loadHousing = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getHousingById(id);

        console.log(
          "Housing Details:",
          result
        );

        /*
         * Backend currently returns:
         *
         * {
         *   success: true,
         *   data: {...}
         * }
         */

        if (
          result &&
          result.success === false
        ) {
          throw new Error(
            result.message ||
            "Failed to load housing."
          );
        }

        const data =
          result?.data ??
          result;

        if (!data) {
          throw new Error(
            "Housing not found."
          );
        }

        setHousing(data);
      } catch (err) {
        console.error(
          "Housing Details Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load housing."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadHousing();
    }
  }, [id]);

  // ==========================================================
  // Loading
  // ==========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">

          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-lg">

            <div className="h-72 animate-pulse bg-slate-200" />

            <div className="space-y-5 p-8">
              <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />

              <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-28 animate-pulse rounded-xl bg-slate-100"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // Error
  // ==========================================================
  if (error) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-5 bg-slate-50 px-6">

        <div className="rounded-full bg-red-100 p-4 text-red-600">
          <MapPin size={30} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          Unable to load housing
        </h2>

        <p className="max-w-md text-center text-slate-500">
          {error}
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          <ArrowLeft size={18} />

          Go Back
        </button>
      </div>
    );
  }

  // ==========================================================
  // Not Found
  // ==========================================================
  if (!housing) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Housing not found
          </h2>

          <button
            type="button"
            onClick={() => navigate("/housing")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white"
          >
            Browse Housing
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // Normalize DTO fields
  // ==========================================================
  const housingId =
    housing.housingId ??
    housing.id ??
    id;

  const favorite = favorites ? favorites.isFavorite(housingId) : false;

  const title =
    housing.title ||
    "Student Housing";

  const price =
    Number(housing.price) || 0;

  const rating =
    Number(housing.rating) || 0;

  const distance =
    Number(housing.distanceKm);

  const city =
    housing.city ||
    "Location not specified";

  const isVerified =
    housing.isVerified === true;

  const image =
    housing.imageUrl ||
    housing.primaryImageUrl ||
    housing.image ||
    null;
  
  const housingRoomId =
    housing.housingRoomId ??
    housing.roomId ??
    housing.rooms?.[0]?.housingRoomId ??
    housing.housingRooms?.[0]?.housingRoomId;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">

      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-medium text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={18} />

          Back to Housing
        </button>

        {/* ====================================================
            Main Card
        ==================================================== */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          {/* Image */}
          <div className="relative h-72 overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200">

            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">

                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 shadow">
                    <MapPin size={36} />
                  </div>

                  <p className="font-medium text-slate-500">
                    Student Housing
                  </p>
                </div>
              </div>
            )}

            {/* Favorite */}
            <button
              type="button"
              disabled={favorites?.isBusy(housingId)}
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login", { state: { from: `/housing/${housingId}` } });
                  return;
                }
                favorites?.toggleFavorite(housingId);
              }}
              className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow disabled:cursor-wait disabled:opacity-60 ${favorite
                  ? "text-red-500"
                  : "text-slate-600"
                }`}
            >
              <Heart
                size={21}
                className={
                  favorite
                    ? "fill-current"
                    : ""
                }
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">

            {/* Header */}
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4">

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {title}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-slate-500">
                  <MapPin size={17} />

                  {city}
                </div>
              </div>

              {isVerified && (
                <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  <ShieldCheck size={17} />

                  Verified Housing
                </span>
              )}
            </div>

            {/* =================================================
                Information
            ================================================= */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Price */}
              <InfoCard
                label="Monthly Price"
                value={`${price.toLocaleString()} EGP`}
                valueClass="text-blue-600"
              />

              {/* Distance */}
              <InfoCard
                label="Distance"
                value={
                  Number.isFinite(distance) &&
                    distance > 0
                    ? `${distance.toFixed(1)} km`
                    : "Not available"
                }
              />

              {/* Rating */}
              <InfoCard
                label="Rating"
                value={
                  rating > 0
                    ? `⭐ ${rating.toFixed(1)}`
                    : "No ratings"
                }
              />

              {/* Location */}
              <InfoCard
                label="Location"
                value={city}
              />
            </div>

            {/* =================================================
                Rating / Distance
            ================================================= */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 text-yellow-500">
                    <Star
                      size={20}
                      className="fill-current"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Housing Rating
                    </p>

                    <p className="font-bold text-slate-900">
                      {rating > 0
                        ? `${rating.toFixed(1)} / 5`
                        : "No ratings yet"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Navigation size={20} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Distance from University
                    </p>

                    <p className="font-bold text-slate-900">
                      {Number.isFinite(distance) &&
                        distance > 0
                        ? `${distance.toFixed(1)} km`
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                Actions
            ================================================= */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                disabled={!housingRoomId}
                onClick={() => {
                  if (!housingRoomId) {
                    alert(
                      "No available room was found for this housing."
                    );
                    return;
                  }

                  const params =
                    new URLSearchParams();

                  params.set(
                    "housingRoomId",
                    housingRoomId
                  );

                  params.set(
                    "housingTitle",
                    housing.title ||
                    "Student Housing"
                  );

                  navigate(
                    `/bookings/request?${params.toString()}`
                  );
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Request Booking
              </button>

              <button
                type="button"
                disabled={favorites?.isBusy(housingId)}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login", { state: { from: `/housing/${housingId}` } });
                    return;
                  }
                  favorites?.toggleFavorite(housingId);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
              >
                <Heart
                  size={18}
                  className={
                    favorite
                      ? "fill-red-500 text-red-500"
                      : ""
                  }
                />

                {favorite
                  ? "Saved"
                  : "Add to Favorites"}
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      window.location.href
                    );

                    alert(
                      "Housing link copied."
                    );
                  } catch {
                    alert(
                      "Unable to copy link."
                    );
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Share2 size={18} />

                Share
              </button>
            </div>

            {/* =================================================
                ID / Debug-free useful information
            ================================================= */}
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              <div className="flex items-center justify-between gap-4">
                <span>
                  Housing ID
                </span>

                <span className="font-semibold text-slate-700">
                  #{housingId}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Info Card
// ============================================================
function InfoCard({
  label,
  value,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 line-clamp-2 text-lg font-bold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

export default HousingDetails;