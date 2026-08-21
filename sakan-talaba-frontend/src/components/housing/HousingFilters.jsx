function HousingFilters({
  filters,
  setFilters,
  universities = [],
  housingTypes = [],
  onSearch,
  onReset,
}) {
  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          Search & Filters
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Find the housing that matches your needs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {/* University */}
<div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      University
    </label>

    <select
      value={filters.universityId}
      onChange={(e) =>
        updateFilter("universityId", e.target.value)
      }
      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
    >
      <option value="">
        All Universities
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

{/* Maximum Distance */}
<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Maximum Distance (km)
  </label>

  <input
    type="number"
    min="0"
    step="0.5"
    placeholder="e.g. 5"
    value={filters.maxDistance}
    onChange={(e) =>
      updateFilter("maxDistance", e.target.value)
    }
    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
  />
</div>
        {/* Housing Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Housing Type
          </label>

          <select
            value={filters.housingType}
            onChange={(e) =>
              updateFilter("housingType", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">
              All Housing Types
            </option>

            {housingTypes.map((type) => (
              <option
                key={type.housingTypeIdDto}
                value={type.housingTypeNameDto}
              >
                {type.housingTypeNameDto}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Minimum Price
          </label>

          <input
            type="number"
            min="0"
            placeholder="e.g. 1500"
            value={filters.minPrice}
            onChange={(e) =>
              updateFilter("minPrice", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Maximum Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Maximum Price
          </label>

          <input
            type="number"
            min="0"
            placeholder="e.g. 3000"
            value={filters.maxPrice}
            onChange={(e) =>
              updateFilter("maxPrice", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Minimum Rating
          </label>

          <select
            value={filters.minimumRating}
            onChange={(e) =>
              updateFilter("minimumRating", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Any Rating</option>
            <option value="1">⭐ 1+</option>
            <option value="2">⭐ 2+</option>
            <option value="3">⭐ 3+</option>
            <option value="4">⭐ 4+</option>
            <option value="4.5">⭐ 4.5+</option>
          </select>
        </div>

        {/* Furnished */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Furnished
          </label>

          <select
            value={filters.isFurnished}
            onChange={(e) =>
              updateFilter("isFurnished", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Any</option>
            <option value="true">Furnished</option>
            <option value="false">Not Furnished</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Sort By
          </label>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              updateFilter("sortBy", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Default</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="distance">Distance</option>
          </select>
        </div>

        {/* Sort Direction */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Sort Direction
          </label>

          <select
            value={filters.sortDirection}
            onChange={(e) =>
              updateFilter("sortDirection", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="asc">
              Low → High
            </option>

            <option value="desc">
              High → Low
            </option>
          </select>
        </div>

      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">

        <button
          type="button"
          onClick={onSearch}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          🔍 Search
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Reset Filters
        </button>

      </div>
    </div>
  );
}

export default HousingFilters;