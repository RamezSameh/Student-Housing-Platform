import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import HousingCard from "../../components/housing/HousingCard";
import HousingFilters from "../../components/housing/HousingFilters";

import {
  getHousings,
  getHousingTypes,
} from "../../services/housingService";

import {
  getUniversities,
} from "../../services/universityService";

const INITIAL_FILTERS = {
  universityId: "",
  minPrice: "",
  maxPrice: "",
  maxDistance: "",
  housingType: "",
  roomType: "",
  genderType: "",
  isFurnished: "",
  amenities: "",
  minimumRating: "",
  sortBy: "",
  sortDirection: "asc",
};

function HousingList() {
  const [searchParams] =
    useSearchParams();

  // ==========================================================
  // State
  // ==========================================================

  const [filters, setFilters] =
    useState(INITIAL_FILTERS);

  const [appliedFilters, setAppliedFilters] =
    useState(INITIAL_FILTERS);

  const [housings, setHousings] =
    useState([]);

  const [universities, setUniversities] =
    useState([]);

  const [housingTypes, setHousingTypes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingFilters, setLoadingFilters] =
    useState(true);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pageSize] =
    useState(20);

  const [totalPages, setTotalPages] =
    useState(0);

  const [totalCount, setTotalCount] =
    useState(0);

  // ==========================================================
  // Read filters from URL
  //
  // Example:
  // /housing?universityId=1
  // ==========================================================

  useEffect(() => {
    const universityId =
      searchParams.get(
        "universityId"
      ) || "";

    const location =
      searchParams.get(
        "location"
      ) || "";

    const urlFilters = {
      ...INITIAL_FILTERS,

      universityId,

      // Backend Search currently doesn't
      // have a "location" parameter.
      //
      // We keep it out of the API request.
      //
      // Location can be added later
      // when SearchAsync supports it.
    };

    setFilters(urlFilters);
    setAppliedFilters(urlFilters);
    setPage(1);

    console.log(
      "🔗 Filters from URL:",
      urlFilters
    );

    if (location) {
      console.log(
        "📍 Location from URL:",
        location
      );
    }
  }, [searchParams]);

  // ==========================================================
  // Load Universities + Housing Types
  // ==========================================================

  useEffect(() => {
    const loadFilterData =
      async () => {
        try {
          setLoadingFilters(true);

          const [
            universitiesResponse,
            housingTypesResponse,
          ] = await Promise.all([
            getUniversities(1, 100),
            getHousingTypes(),
          ]);

          console.log(
            "🎓 Universities:",
            universitiesResponse
          );

          console.log(
            "🏠 Housing Types:",
            housingTypesResponse
          );

          setUniversities(
            Array.isArray(
              universitiesResponse?.items
            )
              ? universitiesResponse.items
              : []
          );

          setHousingTypes(
            Array.isArray(
              housingTypesResponse?.items
            )
              ? housingTypesResponse.items
              : []
          );
        } catch (err) {
          console.error(
            "❌ Failed to load filter data:",
            err
          );
        } finally {
          setLoadingFilters(false);
        }
      };

    loadFilterData();
  }, []);

  // ==========================================================
  // Load Housings
  // ==========================================================

  useEffect(() => {
    const loadHousings =
      async () => {
        try {
          setLoading(true);
          setError("");

          console.log(
            "===================================="
          );

          console.log(
            "🏠 Loading Housing List"
          );

          console.log(
            "Applied Filters:",
            appliedFilters
          );

          console.log(
            "Page:",
            page
          );

          console.log(
            "===================================="
          );

          const result =
            await getHousings(
              appliedFilters,
              page,
              pageSize
            );

          console.log(
            "🏠 Housing Result:",
            result
          );

          setHousings(
            Array.isArray(result?.items)
              ? result.items
              : []
          );

          setTotalPages(
            Number(
              result?.totalPages ?? 0
            )
          );

          setTotalCount(
            Number(
              result?.totalCount ?? 0
            )
          );
        } catch (err) {
          console.error(
            "❌ Failed to load housings:",
            err
          );

          setHousings([]);

          setError(
            err?.response?.data
              ?.message ||
            err?.message ||
            "Failed to load housing."
          );
        } finally {
          setLoading(false);
        }
      };

    loadHousings();
  }, [
    appliedFilters,
    page,
    pageSize,
  ]);

  // ==========================================================
  // Search
  // ==========================================================

  const handleSearch = () => {
    console.log(
      "🔍 APPLY FILTERS:",
      filters
    );

    setPage(1);

    setAppliedFilters({
      ...filters,
    });
  };

  // ==========================================================
  // Reset
  // ==========================================================

  const handleReset = () => {
    console.log(
      "♻️ RESET FILTERS"
    );

    setFilters({
      ...INITIAL_FILTERS,
    });

    setAppliedFilters({
      ...INITIAL_FILTERS,
    });

    setPage(1);
  };

  // ==========================================================
  // Pagination
  // ==========================================================

  const handlePrevious =
    () => {
      setPage((current) =>
        Math.max(
          current - 1,
          1
        )
      );
    };

  const handleNext =
    () => {
      setPage((current) =>
        Math.min(
          current + 1,
          totalPages
        )
      );
    };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ====================================================
          Header
      ==================================================== */}

      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-14">

          <p className="font-semibold text-blue-400">
            STUDENT HOUSING
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-white">
            Find Your Perfect Housing
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Search and filter student housing
            based on your university, budget,
            distance and preferences.
          </p>
        </div>
      </section>

      {/* ====================================================
          Content
      ==================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Filters */}

        <HousingFilters
          filters={filters}
          setFilters={setFilters}
          universities={universities}
          housingTypes={housingTypes}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* ==================================================
            Results Header
        ================================================== */}

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Available Housing
            </h2>

            <p className="text-sm text-slate-500">
              {loading
                ? "Searching..."
                : `${totalCount} housing option${totalCount === 1
                  ? ""
                  : "s"
                } found`}
            </p>
          </div>

          {loadingFilters && (
            <p className="text-sm text-slate-400">
              Loading filters...
            </p>
          )}
        </div>

        {/* ==================================================
            Error
        ================================================== */}

        {!loading && error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setAppliedFilters({
                  ...appliedFilters,
                })
              }
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ==================================================
            Loading
        ================================================== */}

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>
        )}

        {/* ==================================================
            Empty
        ================================================== */}

        {!loading &&
          !error &&
          housings.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
                🏠
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No housing found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your filters
                or reset the search.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          )}

        {/* ==================================================
            Housing Grid
        ================================================== */}

        {!loading &&
          !error &&
          housings.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {housings.map(
                (housing) => (
                  <HousingCard
                    key={
                      housing.housingId ??
                      housing.id
                    }
                    housing={housing}
                  />
                )
              )}
            </div>
          )}

        {/* ==================================================
            Pagination
        ================================================== */}

        {!loading &&
          !error &&
          housings.length > 0 &&
          totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">

              <button
                type="button"
                disabled={page <= 1}
                onClick={
                  handlePrevious
                }
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="rounded-lg bg-slate-900 px-5 py-2 font-semibold text-white">
                Page {page} of{" "}
                {totalPages}
              </span>

              <button
                type="button"
                disabled={
                  page >= totalPages
                }
                onClick={
                  handleNext
                }
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
      </main>
    </div>
  );
}

export default HousingList;