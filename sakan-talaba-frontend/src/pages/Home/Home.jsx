import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Wallet,
  MapPinned,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import HousingCard from "../../components/housing/HousingCard";

import {
  getRecommendedHousing,
  getHousingTypes,
} from "../../services/housingService";

import { getUniversities } from "../../services/universityService";

function Home() {
  // ==========================================
  // Universities
  // ==========================================
  const [universities, setUniversities] = useState([]);

  const [selectedUniversityId, setSelectedUniversityId] =
    useState("");

  const [universitiesLoading, setUniversitiesLoading] =
    useState(true);

  const [universitiesError, setUniversitiesError] =
    useState("");

  // ==========================================
  // Housing Types
  // ==========================================
  const [housingTypes, setHousingTypes] = useState([]);

  const [housingTypesLoading, setHousingTypesLoading] =
    useState(true);

  // ==========================================
  // Filters
  // ==========================================
  const [maxDistance, setMaxDistance] = useState("");

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  const [selectedHousingType, setSelectedHousingType] =
    useState("");

  const [isFurnished, setIsFurnished] = useState("");

  const [sortBy, setSortBy] = useState("distance");

  const [sortDirection, setSortDirection] =
    useState("asc");

  // ==========================================
  // Recommended Housing
  // ==========================================
  const [recommendedHousing, setRecommendedHousing] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // Show More Filters
  // ==========================================
  const [showFilters, setShowFilters] = useState(false);

  // ==========================================
  // Load Universities
  // ==========================================
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setUniversitiesLoading(true);
        setUniversitiesError("");

        const data = await getUniversities(1, 100);

        console.log(
          "Universities Response:",
          data
        );

        setUniversities(data?.items ?? []);
      } catch (err) {
        console.error(
          "Failed to load universities:",
          err
        );

        setUniversitiesError(
          err.response?.data?.message ||
            "Failed to load universities."
        );

        setUniversities([]);
      } finally {
        setUniversitiesLoading(false);
      }
    };

    loadUniversities();
  }, []);

  // ==========================================
  // Load Housing Types
  // ==========================================
  useEffect(() => {
    const loadHousingTypes = async () => {
      try {
        setHousingTypesLoading(true);

        const data = await getHousingTypes();

        console.log(
          "Housing Types Response:",
          data
        );

        setHousingTypes(data?.items ?? []);
      } catch (err) {
        console.error(
          "Failed to load housing types:",
          err
        );

        setHousingTypes([]);
      } finally {
        setHousingTypesLoading(false);
      }
    };

    loadHousingTypes();
  }, []);

  // ==========================================
  // Load Recommended Housing
  //
  // SAME API:
  // /Housings/search
  // ==========================================
  useEffect(() => {
    const loadRecommendedHousing = async () => {
      try {
        setLoading(true);
        setError("");

        const filters = {};

        // University
        if (selectedUniversityId) {
          filters.universityId = Number(
            selectedUniversityId
          );
        }

        // Distance
        if (maxDistance !== "") {
          filters.maxDistance = Number(maxDistance);
        }

        // Minimum Price
        if (minPrice !== "") {
          filters.minPrice = Number(minPrice);
        }

        // Maximum Price
        if (maxPrice !== "") {
          filters.maxPrice = Number(maxPrice);
        }

        // Housing Type
        if (selectedHousingType !== "") {
          filters.housingType = selectedHousingType;
        }

        // Furnished
        if (isFurnished !== "") {
          filters.isFurnished =
            isFurnished === "true";
        }

        // Sorting
        if (sortBy !== "") {
          filters.sortBy = sortBy;
          filters.sortDirection = sortDirection;
        }

        console.log(
          "Housing Search Filters:",
          filters
        );

        const data = await getRecommendedHousing(
          filters,
          1,
          6
        );

        console.log(
          "Recommended Housing Response:",
          data
        );

        const items = data?.items ?? [];

        /*
         * Compatibility with the existing HousingCard.
         *
         * HousingListItemDto uses:
         * id
         *
         * Older HousingCard versions may use:
         * housingId
         */
        const normalizedItems = items.map(
          (housing) => ({
            ...housing,

            housingId:
              housing.housingId ??
              housing.id,
          })
        );

        setRecommendedHousing(
          normalizedItems
        );
      } catch (err) {
        console.error(
          "Failed to load recommended housing:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load recommended housing."
        );

        setRecommendedHousing([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedHousing();
  }, [
    selectedUniversityId,
    maxDistance,
    minPrice,
    maxPrice,
    selectedHousingType,
    isFurnished,
    sortBy,
    sortDirection,
  ]);

  // ==========================================
  // Build Housing Search URL
  // ==========================================
  const buildSearchUrl = () => {
    const params = new URLSearchParams();

    if (selectedUniversityId) {
      params.set(
        "universityId",
        selectedUniversityId
      );
    }

    if (minPrice !== "") {
      params.set("minPrice", minPrice);
    }

    if (maxPrice !== "") {
      params.set("maxPrice", maxPrice);
    }

    if (maxDistance !== "") {
      params.set(
        "maxDistance",
        maxDistance
      );
    }

    if (selectedHousingType !== "") {
      params.set(
        "housingType",
        selectedHousingType
      );
    }

    if (isFurnished !== "") {
      params.set(
        "isFurnished",
        isFurnished
      );
    }

    if (sortBy !== "") {
      params.set("sortBy", sortBy);
      params.set(
        "sortDirection",
        sortDirection
      );
    }

    const queryString =
      params.toString();

    return queryString
      ? `/housing?${queryString}`
      : "/housing";
  };

  // ==========================================
  // Reset Filters
  // ==========================================
  const resetFilters = () => {
    setSelectedUniversityId("");
    setMaxDistance("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedHousingType("");
    setIsFurnished("");
    setSortBy("distance");
    setSortDirection("asc");
  };

  // ==========================================
  // Number Formatter
  // ==========================================
  const formatNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "";
    }

    return Number(value).toLocaleString();
  };

  return (
    <div>
      {/* ======================================
          Hero
      ====================================== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <GraduationCap size={18} />

              Find housing near your university
            </span>

            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Find Your Perfect

              <span className="block text-blue-400">
                Student Home
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Discover safe, affordable, and comfortable
              student housing close to your university.
            </p>
          </div>

          {/* ======================================
              Search Box
          ====================================== */}
          <div className="mt-10 max-w-5xl rounded-2xl bg-white p-3 shadow-2xl">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">

              {/* University */}
              <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
                <GraduationCap
                  className="text-blue-600"
                  size={20}
                />

                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    University
                  </p>

                  <select
                    value={selectedUniversityId}
                    onChange={(event) =>
                      setSelectedUniversityId(
                        event.target.value
                      )
                    }
                    disabled={
                      universitiesLoading
                    }
                    className="w-full bg-transparent text-sm font-medium outline-none"
                  >
                    <option value="">
                      {universitiesLoading
                        ? "Loading universities..."
                        : "Select university"}
                    </option>

                    {universities.map(
                      (university) => (
                        <option
                          key={
                            university.universityId
                          }
                          value={
                            university.universityId
                          }
                        >
                          {university.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Maximum Distance */}
              <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
                <MapPin
                  className="text-blue-600"
                  size={20}
                />

                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    Maximum Distance
                  </p>

                  <select
                    value={maxDistance}
                    onChange={(event) =>
                      setMaxDistance(
                        event.target.value
                      )
                    }
                    className="w-full bg-transparent text-sm font-medium outline-none"
                  >
                    <option value="">
                      Any distance
                    </option>

                    <option value="1">
                      Within 1 km
                    </option>

                    <option value="2">
                      Within 2 km
                    </option>

                    <option value="3">
                      Within 3 km
                    </option>

                    <option value="5">
                      Within 5 km
                    </option>

                    <option value="10">
                      Within 10 km
                    </option>
                  </select>
                </div>
              </div>

              {/* Search */}
              <Link
                to={buildSearchUrl()}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <Search size={20} />

                Search
              </Link>
            </div>

            {/* University Error */}
            {universitiesError && (
              <p className="mt-2 px-2 text-sm text-red-500">
                {universitiesError}
              </p>
            )}

            {/* ======================================
                Advanced Filters Toggle
            ====================================== */}
            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (previous) => !previous
                )
              }
              className="mt-4 flex items-center gap-2 px-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <SlidersHorizontal size={17} />

              {showFilters
                ? "Hide Filters"
                : "More Filters"}
            </button>

            {/* ======================================
                Advanced Filters
            ====================================== */}
            {showFilters && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                  {/* Minimum Price */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Minimum Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(event) =>
                        setMinPrice(
                          event.target.value
                        )
                      }
                      placeholder="e.g. 1000"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Maximum Price */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Maximum Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(event) =>
                        setMaxPrice(
                          event.target.value
                        )
                      }
                      placeholder="e.g. 5000"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Housing Type */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Housing Type
                    </label>

                    <select
                      value={
                        selectedHousingType
                      }
                      onChange={(event) =>
                        setSelectedHousingType(
                          event.target.value
                        )
                      }
                      disabled={
                        housingTypesLoading
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">
                        All types
                      </option>

                      {housingTypes.map(
                        (type) => {
                          const id =
                            type.housingTypeId ??
                            type.id;

                          const name =
                            type.housingTypeName ??
                            type.name ??
                            type.title;

                          return (
                            <option
                              key={id}
                              value={name}
                            >
                              {name}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>

                  {/* Furnished */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Furnished
                    </label>

                    <select
                      value={isFurnished}
                      onChange={(event) =>
                        setIsFurnished(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">
                        Any
                      </option>

                      <option value="true">
                        Furnished
                      </option>

                      <option value="false">
                        Unfurnished
                      </option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Sort By
                    </label>

                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="distance">
                        Distance
                      </option>

                      <option value="price">
                        Price
                      </option>

                      <option value="rating">
                        Rating
                      </option>
                    </select>
                  </div>

                  {/* Sort Direction */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Order
                    </label>

                    <select
                      value={sortDirection}
                      onChange={(event) =>
                        setSortDirection(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="asc">
                        Lowest / Closest
                      </option>

                      <option value="desc">
                        Highest / Farthest
                      </option>
                    </select>
                  </div>

                  {/* Reset */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      <X size={16} />

                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================
          Features
      ====================================== */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
          <Feature
            icon={<MapPinned />}
            title="Near Your University"
            description="Find housing based on distance from your university."
          />

          <Feature
            icon={<Wallet />}
            title="Fits Your Budget"
            description="Compare housing options and find accommodation within your budget."
          />

          <Feature
            icon={<ShieldCheck />}
            title="Verified Housing"
            description="Discover verified and trusted accommodation options."
          />
        </div>
      </section>

      {/* ======================================
          Recommended Housing
      ====================================== */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-semibold text-blue-600">
                DISCOVER
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Recommended Housing
              </h2>

              <p className="mt-2 text-slate-500">
                {selectedUniversityId
                  ? "Housing options based on your selected university and preferences."
                  : "Explore some of the best accommodation options."}
              </p>
            </div>

            <Link
              to={buildSearchUrl()}
              className="hidden items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 sm:flex"
            >
              View All

              <ArrowRight size={18} />
            </Link>
          </div>

          {/* ======================================
              Active Filters
          ====================================== */}
          {(selectedUniversityId ||
            maxDistance ||
            minPrice ||
            maxPrice ||
            selectedHousingType ||
            isFurnished) && (
            <div className="mb-6 flex flex-wrap gap-2">

              {selectedUniversityId && (
                <FilterBadge
                  label={
                    universities.find(
                      (university) =>
                        String(
                          university.universityId
                        ) ===
                        String(
                          selectedUniversityId
                        )
                    )?.name ||
                    "Selected University"
                  }
                />
              )}

              {maxDistance && (
                <FilterBadge
                  label={`Within ${maxDistance} km`}
                />
              )}

              {minPrice && (
                <FilterBadge
                  label={`From ${formatNumber(
                    minPrice
                  )} EGP`}
                />
              )}

              {maxPrice && (
                <FilterBadge
                  label={`Up to ${formatNumber(
                    maxPrice
                  )} EGP`}
                />
              )}

              {selectedHousingType && (
                <FilterBadge
                  label={
                    selectedHousingType
                  }
                />
              )}

              {isFurnished && (
                <FilterBadge
                  label={
                    isFurnished === "true"
                      ? "Furnished"
                      : "Unfurnished"
                  }
                />
              )}
            </div>
          )}

          {/* ======================================
              Loading
          ====================================== */}
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          )}

          {/* ======================================
              Error
          ====================================== */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          )}

          {/* ======================================
              Empty
          ====================================== */}
          {!loading &&
            !error &&
            recommendedHousing.length === 0 && (
              <div className="rounded-xl bg-white p-10 text-center text-slate-500">
                <div className="mb-3 text-4xl">
                  🏠
                </div>

                <h3 className="font-bold text-slate-800">
                  No housing found
                </h3>

                <p className="mt-2">
                  Try changing your filters
                  or selecting another university.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

          {/* ======================================
              Housing
          ====================================== */}
          {!loading &&
            !error &&
            recommendedHousing.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendedHousing.map(
                  (housing) => (
                    <HousingCard
                      key={
                        housing.id ??
                        housing.housingId
                      }
                      housing={housing}
                    />
                  )
                )}
              </div>
            )}

          {/* ======================================
              View All Mobile
          ====================================== */}
          <div className="mt-8 sm:hidden">
            <Link
              to={buildSearchUrl()}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              View All Housing

              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// Feature Component
// ==========================================
function Feature({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

// ==========================================
// Filter Badge
// ==========================================
function FilterBadge({ label }) {
  return (
    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
      {label}
    </span>
  );
}

export default Home;