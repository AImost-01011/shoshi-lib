import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserType } from "../globalType";

type UsersType = UserType[];

export const userApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.QUERY_BASE_URL }),
  endpoints: (builder) => ({
    getUsers: builder.query<UsersType, void>({
      query: () => `users`,
    }),

    getUserByEmail: builder.query<UserType, string>({
      query: (email) => `/api/user/get/${email}`,
    }),

    getUserByUserId: builder.query<UserType, string>({
      query: (userId) => `/api/user/get/userId/${userId}`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByEmailQuery,
  useGetUserByUserIdQuery,
} = userApi;
