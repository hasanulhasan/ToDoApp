import { useParams, useNavigate } from "react-router-dom";
import { useGetTodoQuery } from "../auth/api/todosApi";

export default function TodoSingle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: todo, isLoading, isError } = useGetTodoQuery(id!);
  
  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError || !todo) return <p className="p-4 text-red-600 text-center">Todo not found.</p>;

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{todo.title}</h1>
      {todo.description && <p className="mb-2">{todo.description}</p>}

      <div className="mb-2">
        <strong>Status:</strong> {todo.status}
      </div>
      {todo.priority && (
        <div className="mb-2">
          <strong>Priority:</strong> {todo.priority}
        </div>
      )}
      {Array.isArray(todo.tags) && todo.tags.length > 0 && (
        <div className="mb-2">
          <strong>Tags:</strong> {todo.tags.join(", ")}
        </div>
      )}
      {todo.dueDate && (
        <div className="mb-2">
          <strong>Due Date:</strong>{" "}
          {new Date(todo.dueDate).toLocaleDateString()}
        </div>
      )}

      <div className="mt-4">
        <button
          className="px-3 py-1 border rounded mr-2 cursor-pointer"
          onClick={() => navigate("/app/todos")}
        >
          Back
        </button>
      </div>
    </div>
  );
}
