import { useParams, useNavigate } from "react-router-dom";
import { useGetTodoQuery } from "../auth/api/todosApi";
import TodoForm from "./TodoForm";

export default function TodoUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: todo, isLoading, isError } = useGetTodoQuery(id!);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError || !todo)
    return <p className="p-4 text-red-600 text-center">Todo not found.</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Update Todo</h1>
      <TodoForm
        initialValues={{
          ...todo,
          priority: todo.priority !== undefined ? String(todo.priority) : undefined,
        }}
        onClose={() => navigate("/app/todos")}
      />
    </div>
  );
}
