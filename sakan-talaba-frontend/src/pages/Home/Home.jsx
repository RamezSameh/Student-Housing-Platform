import { useEffect, useState } from "react";

import {
  Search,
  MapPin,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Wallet,
  MapPinned,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import HousingCard from "../../components/housing/HousingCard";

import {
  getRecommendedHousing,
} from "../../services/housingService";

import NearbyHousing from "../../components/housing/NearbyHousing";

import {
  getUniversities,
} from "../../services/universityService";

function Home() {
  const navigate = useNavigate();

  // ==========================================================
  // State
  // ==========================================================

  const [
    recommendedHousing,
    setRecommendedHousing,
  ] = useState([]);

  const [
    universities,
    setUniversities,
  ] = useState([]);

  const [
    selectedUniversity,
    setSelectedUniversity,
  ] = useState("");

  const [
    location,
    setLocation,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    universitiesLoading,
    setUniversitiesLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // Load Recommended Housing
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const loadRecommendedHousing =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getRecommendedHousing(
              {},
              1,
              6
            );

          console.log(
            "Recommended Housing:",
            data
          );

          if (!isMounted) {
            return;
          }

          setRecommendedHousing(
            Array.isArray(data?.items)
              ? data.items
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load recommended housing:",
            err
          );

          if (!isMounted) {
            return;
          }

          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load recommended housing."
          );
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    loadRecommendedHousing();

    return () => {
      isMounted = false;
    };
  }, []);


  {
    selectedUniversity && (
      <NearbyHousing
        universityId={
          Number(selectedUniversity)
        }
        universityName={
          universities.find(
            (university) =>
              String(
                university.universityId
              ) ===
              String(
                selectedUniversity
              )
          )?.name
        }
      />
    )
  }
  // ==========================================================
  // Load Universities
  // ==========================================================

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setUniversitiesLoading(true);

        const data = await getUniversities(1, 100);

        console.log("HOME UNIVERSITIES DATA:", data);
        console.log("HOME UNIVERSITIES ITEMS:", data?.items);

        setUniversities(
          Array.isArray(data?.items)
            ? data.items
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load universities:",
          err
        );

        setUniversities([]);
      } finally {
        setUniversitiesLoading(false);
      }
    };

    loadUniversities();
  }, []);

  // ==========================================================
  // Search
  // ==========================================================

  const handleSearch = () => {
    const params =
      new URLSearchParams();

    if (selectedUniversity) {
      params.set(
        "universityId",
        selectedUniversity
      );
    }

    /*
      NOTE:

      The current Backend Search API does NOT
      have a "location" parameter.

      So we don't send it to the API yet.

      We keep the input in the UI because
      we can connect it later to a City filter.
    */

    const queryString =
      params.toString();

    navigate(
      queryString
        ? `/housing?${queryString}`
        : "/housing"
    );
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <div>

      {/* ======================================================
          Hero
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-950">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-3xl">

            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">

              <GraduationCap
                size={18}
              />

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

          {/* ==================================================
              Search Box
          ================================================== */}

          <div className="mt-10 max-w-5xl rounded-2xl bg-white p-3 shadow-2xl">

            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">

              {/* University */}

              <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">

                <GraduationCap
                  className="shrink-0 text-blue-600"
                  size={20}
                />

                <div className="flex-1">

                  <p className="text-xs font-medium text-slate-500">
                    University
                  </p>

                  <select
                    value={selectedUniversity}
                    onChange={(e) =>
                      setSelectedUniversity(e.target.value)
                    }
                    disabled={universitiesLoading}
                    className="mt-1 w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                  >
                    <option value="">
                      {universitiesLoading
                        ? "Loading universities..."
                        : universities.length === 0
                          ? "No universities found"
                          : "Select university"}
                    </option>

                    {universities.map((university) => (
                      <option
                        key={university.universityId}
                        value={university.universityId}
                      >
                        {university.name}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

              {/* Location */}

              <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">

                <MapPin
                  className="shrink-0 text-blue-600"
                  size={20}
                />

                <div className="flex-1">

                  <p className="text-xs font-medium text-slate-500">
                    Location
                  </p>

                  <input
                    type="text"
                    value={location}
                    onChange={(e) =>
                      setLocation(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        handleSearch();
                      }
                    }}
                    placeholder="City or area"
                    className="w-full bg-transparent text-sm font-medium outline-none"
                  />

                </div>

              </div>

              {/* Search Button */}

              <button
                type="button"
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >

                <Search
                  size={20}
                />

                Search

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          Features
      ====================================================== */}

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

      {/* ======================================================
          Recommended Housing
      ====================================================== */}

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
                Explore some of the best accommodation options.
              </p>

            </div>

            <Link
              to="/housing"
              className="hidden items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 sm:flex"
            >

              View All

              <ArrowRight
                size={18}
              />

            </Link>

          </div>

          {/* Loading */}

          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-96 animate-pulse rounded-2xl bg-slate-200"
                  />
                )
              )}

            </div>
          )}

          {/* Error */}

          {!loading &&
            error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Try Again
                </button>

              </div>
            )}

          {/* Empty */}

          {!loading &&
            !error &&
            recommendedHousing.length ===
            0 && (
              <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm">

                No recommended housing found.

              </div>
            )}

          {/* Housing */}

          {!loading &&
            !error &&
            recommendedHousing.length >
            0 && (

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {recommendedHousing.map(
                  (housing) => (

                    <HousingCard
                      key={
                        housing.housingId ??
                        housing.id
                      }
                      housing={
                        housing
                      }
                    />

                  )
                )}

              </div>

            )}

          {/* Mobile View All */}

          <div className="mt-8 flex justify-center sm:hidden">

            <Link
              to="/housing"
              className="flex items-center gap-2 font-semibold text-blue-600"
            >

              View All

              <ArrowRight
                size={18}
              />

            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

// ============================================================
// Feature
// ============================================================

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

export default Home;