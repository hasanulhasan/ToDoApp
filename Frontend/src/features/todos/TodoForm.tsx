import { useForm } from "react-hook-form";
import type { Todo } from "./types";
import { useAddTodoMutation, useUpdateTodoMutation } from "../auth/api/todosApi";

type Props = { initialValues?: Partial<Todo>; onClose?: () => void };

export default function TodoForm({ initialValues, onClose }: Props) {
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<Partial<Todo>>({
  defaultValues: {
    status: "todo",
    tags: initialValues?.tags ?? [],
    ...initialValues,
    dueDate: initialValues?.dueDate
      ? new Date(initialValues.dueDate).toISOString().split("T")[0]
      : "",
  },
});

  const [addTodo, { isLoading: creating }] = useAddTodoMutation();
  const [updateTodo, { isLoading: updating }] = useUpdateTodoMutation();

  async function onSubmit(values: Partial<Todo>) {
    try {
      const tagsArray =
        typeof values.tags === "string"
          ? (values.tags as string)
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];
      const payload = {
        ...values,
        tags: tagsArray,
        priority:
          typeof values.priority === "string"
            ? Number(values.priority)
            : values.priority,
        dueDate: values.dueDate === null ? undefined : values.dueDate,
      };

      if (initialValues && initialValues._id) {
        await updateTodo({ id: initialValues._id, ...payload }).unwrap();
      } else {
        await addTodo(payload).unwrap();
      }
      onClose?.();
    } catch (err: any) {
      alert(err?.message || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Title */}
      <div>
        <label className="block text-sm">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description (optional) */}
      <div>
        <label className="block text-sm">Description</label>
        <textarea
          {...register("description")}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm">Tags (comma separated)</label>
        <input
          {...register("tags", { required: "At least one tag is required" })}
          placeholder="e.g. work, important"
          className="w-full border rounded px-2 py-1"
        />
        {errors.tags && (
          <p className="text-red-600 text-sm mt-1">{errors.tags.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        {/* Status */}
        <select
          {...register("status", { required: "Status is required" })}
          className="border rounded px-2 py-1"
        >
          <option className="bg-gray-700" value="todo">Todo</option>
          <option className="bg-gray-700" value="in_progress">In Progress</option>
          <option className="bg-gray-700" value="done">Done</option>
        </select>
        {errors.status && (
          <p className="text-red-600 text-sm">{errors.status.message}</p>
        )}

        {/* Priority */}
        <select
          {...register("priority", { required: "Priority is required" })}
          className="border rounded px-2 py-1"
        >
          <option className="bg-gray-700" value="">Priority</option>
          {[1, 2, 3, 4, 5].map((p) => (
            <option className="bg-gray-700" key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.priority && (
          <p className="text-red-600 text-sm">{errors.priority.message}</p>
        )}

        {/* Due Date */}
        <input
          type="date"
          {...register("dueDate", { required: "Due date is required" })}
          className="border rounded px-2 py-1"
        />
        {errors.dueDate && (
          <p className="text-red-600 text-sm">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="px-3 py-1 border rounded cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
          disabled={creating || updating}
        >
          Save
        </button>
      </div>
    </form>
  );
}
