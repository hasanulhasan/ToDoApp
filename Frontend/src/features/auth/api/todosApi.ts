import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../app/store";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface Todo {
  _id: string;
  user: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority?: number;
  tags?: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type TodosListResponse = {
  items: Todo[];
  total: number;
  page: number;
  pages: number;
};

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Todos"],
  endpoints: (build) => ({
   getTodos: build.query<TodosListResponse, Partial<{
    page: number;
    limit: number;
    status: string;
    search: string;
    sort: string;
    sortDir: string;
  }>>({
    query: ({ page = 1, limit = 10, status, search, sort, sortDir } = {}) => ({
      url: "/todos",
      params: { page, limit, status, search, sort, sortDir },
    }),
    providesTags: (result) =>
      result
        ? [
            { type: "Todos" as const, id: "LIST" },
            ...result.items.map((t) => ({ type: "Todos" as const, id: t._id })),
          ]
        : [{ type: "Todos" as const, id: "LIST" }],
  }),
    getTodo: build.query<Todo, string>({
  query: (id) => `/todos/${id}`,
  providesTags: (_, __, id) => [{ type: "Todos", id }],
}),
    addTodo: build.mutation<Todo, Partial<Todo>>({
      query: (body) => ({ url: "/todos", method: "POST", body }),
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
      async onQueryStarted(newTodo, { dispatch, queryFulfilled }) {
        // optimistic update: insert into cached list
        const patchResult = dispatch(
          todosApi.util.updateQueryData(
            "getTodos",
            { page: 1, limit: 10 },
            (draft: any) => {
              if (!draft) return;
              draft.docs.unshift({
                ...newTodo,
                _id: "temp-" + Math.random().toString(36).slice(2),
              });
              draft.total = (draft.total || 0) + 1;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
updateTodo: build.mutation<Todo, Partial<Todo> & { id: string }>({
  query: ({ id, ...body }) => ({
    url: `/todos/${id}`,
    method: "PATCH",
    body,
  }),
  invalidatesTags: (_, __, { id }) => [{ type: "Todos", id }],
}),
    deleteTodo: build.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
