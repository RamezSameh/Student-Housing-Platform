import { useEffect, useState } from "react";

import {
  MapPin,
  Star,
  Heart,
  Navigation,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  isFavorite,
  toggleFavorite,
} from "../../services/favoritesService";

function HousingCard({ housing }) {
  const housingId =
    housing?.housingId ??
    housing?.id;

  const [favorite, setFavorite] =
    useState(false);

  useEffect(() => {
    setFavorite(
      isFavorite(housingId)
    );
  }, [housingId]);

  if (!housing) {
    return null;
  }

  const title =
    housing.title ||
    "Student Housing";

  const price =
    Number(housing.price) || 0;

  const rating =
    Number(housing.rating) || 0;

  const distance =
    Number(housing.distanceKm);

  const isVerified =
    housing.isVerified === true;

  const image =
    housing.imageUrl ||
    housing.primaryImageUrl ||
    housing.image ||
    null;

  const matchScore =
    housing.matchScore !==
      undefined &&
      housing.matchScore !== null
      ? Number(housing.matchScore)
      : null;

  const handleFavorite = () => {
    const updated =
      toggleFavorite(housing);

    const exists = updated.some(
      (item) =>
        String(
          item.id ??
          item.housingId
        ) ===
        String(housingId)
    );

    setFavorite(exists);

    window.dispatchEvent(
      new Event("favoritesChanged")
    );
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200">

        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow">
                <MapPin size={30} />
              </div>

              <p className="text-sm font-medium text-slate-500">
                Student Housing
              </p>
            </div>
          </div>
        )}

        {/* Match */}
        {matchScore !== null && (
          <span className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow">
            {Math.round(
              matchScore
            )}
            % Match
          </span>
        )}

        {/* Verified */}
        {isVerified && (
          <span className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-green-700 shadow">
            <ShieldCheck
              size={14}
            />
            Verified
          </span>
        )}

        {/* Favorite */}
        <button
          type="button"
          aria-label={
            favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          onClick={handleFavorite}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow transition ${favorite
              ? "text-red-500"
              : "text-slate-600 hover:text-red-500"
            }`}
        >
          <Heart
            size={20}
            className={
              favorite
                ? "fill-current"
                : ""
            }
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
          {title}
        </h3>

        {housing.city && (
          <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={15} />

            <span className="line-clamp-1">
              {housing.city}
            </span>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">

          {Number.isFinite(
            distance
          ) &&
            distance >= 0 && (
              <span className="flex items-center gap-1">
                <Navigation
                  size={15}
                />

                {distance.toFixed(
                  1
                )}{" "}
                km away
              </span>
            )}

          <span className="flex items-center gap-1">
            <Star
              size={15}
              className="fill-yellow-400 text-yellow-400"
            />

            {rating > 0
              ? rating.toFixed(1)
              : "No ratings"}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">

          <div>
            <span className="text-xl font-bold text-blue-600">
              {price.toLocaleString()}
            </span>

            <span className="ml-1 text-sm text-slate-500">
              EGP / month
            </span>
          </div>

          <Link
            to={`/housing/${housingId}`}
            className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HousingCard;