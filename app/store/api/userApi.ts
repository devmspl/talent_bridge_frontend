import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserData } from '../../types/user';
import { BaseUrl } from '../BaseUrl';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    createUser: builder.mutation<any, UserData>({
      query: (userData) => {
        const payload = {
          fullname: userData.fullName,
          email: userData.email,
          contact_number: String(userData.phone ?? ''),
          country: userData.country,
          city: userData.city,
          password: userData.password,
          dob: userData.dob,
          industryType: Array.isArray(userData.industry) ? userData.industry : [userData.industry],
          employmentType: Array.isArray(userData.employmentType) ? userData.employmentType : [userData.employmentType],
          openForWork: !!userData.selfEmployed,
          // profile_image: userData.profileImage,
        };
        return {
          url: 'User/create',
          method: 'POST',
          body: payload,
        };
      },
    }),
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: 'User/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        return response?.data || response;
      },
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (payload) => ({
        url: 'User/forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),
    uploadProfile: builder.mutation<any, { userKey: string; file: Blob; filename?: string }>({
      query: ({ userKey, file, filename }) => {
        const inferredExt = file.type?.includes('png') ? 'png' : file.type?.includes('jpeg') || file.type?.includes('jpg') ? 'jpg' : 'jpg';
        const name = filename || `profile.${inferredExt}`;
        const form = new FormData();
        form.append('image', file, name);
        return {
          url: `User/uploadProfile/${encodeURIComponent(userKey)}`,
          method: 'PUT',
          body: form,
        }},
         invalidatesTags: (result, error, { userKey }) => [
    { type: "User", id: userKey },
  ],
    }),
    googleSignin: builder.mutation<any, { token: string }>({
      query: ({ token }) => ({
        url: 'User/login/google',
        method: 'POST',
        body: { token },
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    // in userApi endpoints
    linkedinSignin: builder.mutation<any, { token: string }>({
      query: ({ token }) => ({
        url: 'User/login/linkedin',
        method: 'POST',
        body: { token },
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    googleSignUp: builder.mutation<any, { token: string }>({
      query: ({ token }) => ({
        url: 'User/login/google',
        method: 'POST',
        body: { token },
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    facebookRegister: builder.mutation<any, { accessToken: string }>({
      query: ({ accessToken }) => ({
        url: 'User/register/facebook',
        method: 'POST',
        body: { accessToken },
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    getAllUsers: builder.query<any, { page_no: number; page_size: number }>({
      query: ({ page_no, page_size }) => ({
        url: `User/getall?page_no=${page_no}&page_size=${page_size}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    changePassword: builder.mutation<
      any,
      { userId: string; currentPassword: string; newPassword: string }
    >({
      query: ({ userId, currentPassword, newPassword }) => ({
        url: `User/changePassword/${encodeURIComponent(userId)}`,
        method: "POST",
        body: {
          oldPassword: currentPassword,
          newPassword,
        },
      }),
      transformResponse: (response: any) => response?.data || response,
    }),

    updateProfile: builder.mutation<
      any,
      {
        userKey: string;
        fullname: string;
        contact_number: string;
        email: string;
        dob?: string;
        industryType: string[];
        employmentType: string[];
        openForWork?: boolean;
        country?: string;
        city?: string;
      }
    >({
      query: ({ userKey, ...rest }) => ({
        url: `User/update/${encodeURIComponent(userKey)}`,
        method: "PUT",
        body: rest,
      }),
       invalidatesTags: (result, error, { userKey }) => [
    { type: "User", id: userKey },
  ],
    }),

    deleteAccount: builder.mutation<any, string>({
      query: (userId) => ({
        url: `User/remove/${encodeURIComponent(userId)}`,
        method: "DELETE",
      }),
    }),
   getUserById: builder.query<any, string>({
  query: (userId) => ({
    url: `User/getById/${encodeURIComponent(userId)}`,
    method: "GET",
  }),
  providesTags: (result, error, userId) => [{ type: "User", id: userId }],
   transformResponse: (response: any) => response?.data?.[0] || null,
}),



  }),
});

export const { useCreateUserMutation, useLoginMutation, useForgotPasswordMutation, useUploadProfileMutation, useGoogleSigninMutation,
  useLinkedinSigninMutation, useGoogleSignUpMutation, useFacebookRegisterMutation, useGetAllUsersQuery, useChangePasswordMutation,
  useUpdateProfileMutation, useDeleteAccountMutation,  useGetUserByIdQuery
} = userApi; 