import type { Todo } from "./types";
import { useNavigate } from "react-router-dom";

export default function TodoCard({
  todo,
  onDelete,
}: {
  todo: Todo;
  onDelete: () => void;
}) {
  const navigate = useNavigate();

  const handleSingleTodo = () => {
    navigate(`/app/todos/details/${todo._id}`);
  };

  return (
    <article className="bg-white dark:bg-slate-800 p-3 rounded shadow flex justify-between items-start cursor-pointer">
      <div>
        <h3 className="font-semibold text-lg">{todo.title}</h3>
        {todo.description && (
          <p className="text-sm opacity-80 mt-1">{todo.description}</p>
        )}
        <div className="mt-2 flex gap-2 items-center text-xs">
          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
            {todo.status}
          </span>
          {todo.priority && (
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
              {todo.priority}
            </span>
          )}
          {todo.dueDate && (
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate(`/app/todos/${todo._id}`)}
          className="px-2 py-1 border rounded cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete()}
          className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
        >
          Delete
        </button>
        <button
          onClick={() => handleSingleTodo()}
          className="px-2 py-1 border rounded cursor-pointer"
        >
          Details
        </button>
      </div>
    </article>
  );
}
