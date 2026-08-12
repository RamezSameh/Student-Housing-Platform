import { useEffect, useState } from "react";
import { getHousings } from "../../services/housingService";

function HousingList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHousing = async () => {
      try {
        const result = await getHousings(1, 9);

        console.log("Housing API Response:", result);

        setData(result);
      } catch (err) {
        console.error("Housing API Error:", err);

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
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading housing...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="mb-6 text-3xl font-bold">
        Student Housing
      </h1>

      <pre className="overflow-auto rounded-xl bg-slate-900 p-6 text-white">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default HousingList;