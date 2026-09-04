import { useEffect, useState } from "react";

import {
  Search,
  MapPin,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Wallet,
  MapPinned,
  Wifi,
  UtensilsCrossed,
  Dumbbell,
  CreditCard,
  Headset,
  BedSingle,
  BedDouble,
  Users,
  Snowflake,
  Phone,
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
import { useAuth } from "../../context/AuthContext";

import {
  getUniversities,
} from "../../services/universityService";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isOwner, isAdmin, loading: authLoading } = useAuth();

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
    if (authLoading || !isAuthenticated || isOwner || isAdmin) {
      setLoading(false);
      setRecommendedHousing([]);
      return undefined;
    }
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
  }, [authLoading, isAuthenticated, isOwner, isAdmin]);


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

      {isAuthenticated && !isOwner && !isAdmin && (
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
      )}

      {/* ======================================================
          Why Choose Us
      ====================================================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-blue-600">WHY CHOOSE US</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Why Choose Our Housing?
            </h2>
            <p className="mt-3 text-slate-500">
              Every listing on Sakan Talaba is picked with student life in mind —
              here's what you get.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={<Wifi />} title="High-Speed Internet" description="Stay connected for classes, assignments, and everything in between." />
            <Feature icon={<MapPinned />} title="Prime Location" description="Minutes from your university, transport, and daily essentials." />
            <Feature icon={<UtensilsCrossed />} title="Ready Kitchen" description="Fully-equipped kitchens so you can cook your own meals easily." />
            <Feature icon={<ShieldCheck />} title="Security & Guards" description="24/7 security so you and your belongings stay safe." />
            <Feature icon={<Dumbbell />} title="Nearby Gym" description="Stay active with gyms and fitness spaces close to your housing." />
            <Feature icon={<CreditCard />} title="Flexible Payment" description="Pay by cash, card, or mobile wallet — whatever works for you." />
            <Feature icon={<Wallet />} title="Budget-Friendly" description="Options for every budget, all clearly priced upfront." />
            <Feature icon={<Headset />} title="Dedicated Support" description="Our team is here to help before, during, and after you move in." />
          </div>
        </div>
      </section>

      {/* ======================================================
          Room Types
      ====================================================== */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-blue-600">FIND YOUR FIT</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Room Types for Every Budget
            </h2>
            <p className="mt-3 text-slate-500">
              From a private studio to a shared room, pick the setup that suits
              you and your budget.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <BedSingle size={26} />,
                title: "Single Room",
                budget: "Budget-friendly",
                description: "Your own private room — ideal if you want full privacy on a tighter budget.",
                image: "https://picsum.photos/seed/room-single/500/350",
              },
              {
                icon: <BedDouble size={26} />,
                title: "Double Room",
                budget: "Mid-range",
                description: "Shared with one roommate — a balance of cost and privacy.",
                image: "https://picsum.photos/seed/room-double/500/350",
              },
              {
                icon: <Users size={26} />,
                title: "Triple / Shared Room",
                budget: "Most affordable",
                description: "Shared with two or more roommates — the most economical option.",
                image: "https://picsum.photos/seed/room-triple/500/350",
              },
              {
                icon: <Snowflake size={26} />,
                title: "Studio",
                budget: "Premium",
                description: "A fully self-contained private unit with its own kitchenette.",
                image: "https://picsum.photos/seed/room-studio/500/350",
              },
            ].map((room) => (
              <div key={room.title} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="h-36 overflow-hidden bg-slate-100">
                  <img src={room.image} alt={room.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    {room.icon}
                  </div>
                  <h3 className="mt-3 font-bold text-slate-900">{room.title}</h3>
                  <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {room.budget}
                  </span>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{room.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/housing"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Browse All Room Types
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          About Us
      ====================================================== */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-semibold text-blue-400">ABOUT SAKAN TALABA</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Who We Are</h2>
          <p className="mt-5 leading-7 text-slate-300">
            Sakan Talaba connects students with verified, affordable housing near
            their universities. We started with a simple goal: make finding safe,
            trustworthy student housing as easy as a few clicks — no guesswork,
            no scams, no wasted trips across town.
          </p>

          <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
            <div className="rounded-xl bg-white/5 p-5">
              <h3 className="font-bold">Our Values</h3>
              <p className="mt-2 text-sm text-slate-400">
                Transparency, trust, and putting students' safety and comfort first
                in every listing we verify.
              </p>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <h3 className="font-bold">Our Mission</h3>
              <p className="mt-2 text-sm text-slate-400">
                To make quality student housing accessible and stress-free, one
                verified listing at a time.
              </p>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <h3 className="font-bold">Our Standards</h3>
              <p className="mt-2 text-sm text-slate-400">
                Every housing option is reviewed before it's marked verified —
                owners agree to our listing policies and house rules upfront.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-slate-300">
            Ready to find your next home away from home? Book your room today.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/housing"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Book Now
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              <Phone size={18} />
              Contact Us
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