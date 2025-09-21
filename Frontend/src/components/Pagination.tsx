export default function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  if (pages <= 1) return null;
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(pages, page + 1));
  return (
    <div className="flex items-center gap-2">
      <button onClick={prev} className="px-2 py-1 border rounded bg-blue-500 text-white cursor-pointer">
        Prev
      </button>
      <span>
        Page {page} of {pages}
      </span>
      <button onClick={next} className="px-2 py-1 border rounded bg-blue-500 text-white cursor-pointer">
        Next
      </button>
    </div>
  );
}
