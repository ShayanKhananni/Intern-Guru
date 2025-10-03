import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authActions } from "./auth-slice";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithAuthCheck = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    switch (result.error.status) {
      case 401:
        api.dispatch(authActions.signOut());
        break;

      case 404:
        const refreshResult = await api.dispatch(
          todoApi.endpoints.refresh.initiate({})
        );

        if (refreshResult.error) {
          api.dispatch(authActions.signOut());
          return;
        }
        result = await baseQuery(args, api, extraOptions);
        break;
    }
  }
  return result;
};

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Todos"],

  endpoints: (builder) => ({
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        credentials: "include",
      }),
    }),

    getTodos: builder.query({
      query: (userId) => `/todo/get-todo/${userId}`,
      providesTags: ["Todos"],
    }),

    addTodo: builder.mutation({
      query: (todo) => ({
        url: "/todo/add-todo",
        method: "POST",
        body: todo,
      }),

      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        try {

          const { data: newTodo } = await queryFulfilled;

          dispatch(
            todoApi.util.updateQueryData("getTodos", todo.user_id, (draft) => {
              draft.push(newTodo);
            })
          );
        } catch (error) {
          console.error("Failed to add todo:", error);        
          toast.error("Failed to Update Todo!",error);
        }
      },
    }),

    updateTodo: builder.mutation({
      query: (updated) => ({
        url: "/todo/update-todo",
        method: "PUT",
        body: updated,
      }),
      async onQueryStarted(updated, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Todo Updated successfully!");

          dispatch(
            todoApi.util.updateQueryData(
              "getTodos",
              updated.user_id,
              (draft) => {
                const index = draft.findIndex(
                  (todo) => todo._id === updated._id
                );
                if (index !== -1) {
                  draft[index] = { ...draft[index], ...updated };
                }
              }
            )
          );
        } catch (error) {
          toast.error("Failed to Update Todo!");
          console.error("Failed to update todo:", error);
        }
      },
    }),

    deleteTodo: builder.mutation({
      query: (todo) => ({
        url: `/todo/delete-todo/${todo._id}`,
        method: "DELETE",
      }),

      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        try {

          await queryFulfilled;

          toast.success("Todo deleted successfully!");

          dispatch(
            todoApi.util.updateQueryData("getTodos", todo.user_id, (draft) => {
              const index = draft.findIndex((t) => t._id === todo._id);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            })
          );
        } catch (err) {
          toast.error("Failed to Delete Todo!");
          console.error("Failed to delete todo:", err);
        }
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
