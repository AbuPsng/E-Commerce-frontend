import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import {
  AllUsersResponse,
  DeleteUserRequest,
  MessageResponse,
  UserResponse,
} from "../../types/api-types";
import { User } from "../../types/types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/user/`,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
    allUsers: builder.query<AllUsersResponse, string>({
      query: (userId) => `all?id=${userId}`,
      providesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/user/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } =
  userApi;
