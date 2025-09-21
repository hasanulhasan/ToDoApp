import { useState } from "react";
import { useDeleteTodoMutation, useGetTodosQuery } from "../auth/api/todosApi";
import { useDebounce } from "../../hooks/useDebounce";
import Pagination from "../../components/Pagination";
import TodoCard from "./TodoCard";
import TodoForm from "./TodoForm";

export default function TodosPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [sortDir, setSortDir] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isFetching, isError } = useGetTodosQuery({
    page,
    limit: 10,
    status,
    search: debouncedSearch,
    sortDir,
  });
  const [deleteTodo] = useDeleteTodoMutation();
  
  if (isLoading) return <div className="grid gap-3 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded bg-gray-100 dark:bg-slate-700 animate-pulse"
              />
            ))}
          </div>;
  if (isError || !data)
    return <p className="p-4 text-red-600 text-center">There is an server error </p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Todos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
          >
            New Todo
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <select
          value={status ?? ""}
          onChange={(e) => setStatus(e.target.value || undefined)}
          className="border rounded px-2 py-1"
        >
          <option className="bg-gray-200 dark:bg-gray-700" value="">All Status</option>
          <option className="bg-gray-700" value="todo">Todo</option>
          <option className="bg-gray-700" value="in_progress">In Progress</option>
          <option className="bg-gray-700" value="done">Done</option>
        </select>
        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option className="bg-gray-700" value="desc">Newest</option>
          <option className="bg-gray-700" value="asc">Oldest</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title..."
          className="border rounded px-2 py-1"
        />
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-3 rounded shadow">
          <TodoForm onClose={() => setShowForm(false)} />
        </div>
      )}

      <div>
        {isLoading || isFetching ? (
          <div className="grid gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded bg-gray-100 dark:bg-slate-700 animate-pulse"
              />
            ))}
          </div>
        ) : data && data.items.length ? (
          <div className="grid gap-3">
            {data.items.map((t) => (
              <TodoCard
                key={t._id}
                todo={{
                  ...t,
                  priority: t.priority !== undefined ? String(t.priority) : undefined,
                }}
                onDelete={() => {
                  if (confirm("Delete this todo?")) deleteTodo(t._id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white dark:bg-slate-800 rounded">
            <p className="text-lg">No todos found</p>
          </div>
        )}
      </div>

      <div>
        {data && (
          <Pagination
            page={data.page}
            pages={data.pages}
            onChange={(p) => setPage(p)}
          />
        )}
      </div>
    </div>
  );
}
