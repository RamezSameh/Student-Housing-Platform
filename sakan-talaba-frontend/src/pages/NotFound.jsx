import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <SearchX size={28} />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-500">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
      >
        <Home size={18} />
        Back to home
      </Link>
    </div>
  );
}
