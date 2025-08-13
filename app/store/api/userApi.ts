import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserData } from '../../types/user';
import { BaseUrl } from '../BaseUrl';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
  }),
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
        };
      },
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




  }),
});

export const { useCreateUserMutation, useLoginMutation, useForgotPasswordMutation, useUploadProfileMutation, useGoogleSigninMutation,
   useLinkedinSigninMutation, useGoogleSignUpMutation,useFacebookRegisterMutation
    } = userApi; 