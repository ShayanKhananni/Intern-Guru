import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`, 
    credentials: "include",  
  }),
  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (newUser) => ({
        url: "/auth/signup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      }),
    }),
    signinUser: builder.mutation({
      query: (user) => ({
        url: "/auth/signin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }),
    }),
    googleAuth: builder.mutation({
      query: (user) => ({
        url: "/auth/google/signin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }),
    }),
    updateUser: builder.mutation({
      query: (updatedUser) => ({
        url: "/user/updateProfile",
        method: "PUT",
        body: updatedUser,
      }),
    }),
    logOut: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useSigninUserMutation,
  useGoogleAuthMutation,
  useUpdateUserMutation,
  useLogOutMutation,
} = authApi;
