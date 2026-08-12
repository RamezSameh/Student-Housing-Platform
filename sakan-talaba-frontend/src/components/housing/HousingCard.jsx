import { Link } from "react-router-dom";
import { MapPin, Star, Heart, Navigation } from "lucide-react";

function HousingCard({ housing }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      {/* Image Placeholder */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200">

        <div className="text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow">
            <MapPin size={30} />
          </div>

          <p className="text-sm font-medium text-slate-500">
            Student Housing
          </p>
        </div>

        {/* Match Score */}
        <span className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
          {housing.matchScore}% Match
        </span>

        {/* Favorite */}
        <button
          type="button"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow transition hover:text-red-500"
        >
          <Heart size={20} />
        </button>

      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
          {housing.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">

          <span className="flex items-center gap-1">
            <Navigation size={15} />
            {housing.distanceKm} km away
          </span>

          <span className="flex items-center gap-1">
            <Star
              size={15}
              className="fill-yellow-400 text-yellow-400"
            />

            {housing.rating > 0
              ? housing.rating.toFixed(1)
              : "No ratings"}
          </span>

        </div>

        <div className="mt-5 flex items-end justify-between">

          <div>
            <span className="text-xl font-bold text-blue-600">
              {housing.price.toLocaleString()}
            </span>

            <span className="ml-1 text-sm text-slate-500">
              EGP / month
            </span>
          </div>

          <Link
            to={`/housing/${housing.housingId}`}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            View Details
          </Link>

        </div>

      </div>
    </div>
  );
}

export default HousingCard;