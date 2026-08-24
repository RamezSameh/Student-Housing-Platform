export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center gap-3 text-slate-600">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
      <span>{text}</span>
    </div>
  );
}
