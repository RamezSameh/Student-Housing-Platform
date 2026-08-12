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

import { Link } from "react-router-dom";
import HousingCard from "../../components/housing/HousingCard";
import { getRecommendedHousing } from "../../services/housingService";

function Home() {
  const [recommendedHousing, setRecommendedHousing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecommendedHousing = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRecommendedHousing(1, 6);

        setRecommendedHousing(data.items ?? []);
      } catch (err) {
        console.error(
          "Failed to load recommended housing:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load recommended housing."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedHousing();
  }, []);

  return (
    <div>
      {/* Hero */}
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

          {/* Search */}
          <div className="mt-10 max-w-5xl rounded-2xl bg-white p-3 shadow-2xl">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
                <GraduationCap
                  className="text-blue-600"
                  size={20}
                />

                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    University
                  </p>

                  <input
                    type="text"
                    placeholder="Enter university"
                    className="w-full bg-transparent text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
                <MapPin
                  className="text-blue-600"
                  size={20}
                />

                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    Location
                  </p>

                  <input
                    type="text"
                    placeholder="City or area"
                    className="w-full bg-transparent text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <Link
                to="/housing"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <Search size={20} />
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
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

      {/* Recommended Housing */}
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
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Loading */}
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

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            recommendedHousing.length === 0 && (
              <div className="rounded-xl bg-white p-10 text-center text-slate-500">
                No recommended housing found.
              </div>
            )}

          {/* Housing */}
          {!loading &&
            !error &&
            recommendedHousing.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendedHousing.map((housing) => (
                  <HousingCard
                    key={housing.housingId}
                    housing={housing}
                  />
                ))}
              </div>
            )}
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, description }) {
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