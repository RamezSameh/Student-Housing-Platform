export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onChange(1)} className="rounded-lg border px-3 py-2 text-sm">1</button>
          {start > 2 && <span className="px-1 text-slate-400">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`rounded-lg px-3 py-2 text-sm ${
            p === page ? "bg-slate-900 text-white" : "border hover:bg-slate-50"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
          <button onClick={() => onChange(totalPages)} className="rounded-lg border px-3 py-2 text-sm">
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
