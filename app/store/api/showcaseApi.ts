import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl } from "../BaseUrl";
import Cookies from "js-cookie";

export interface CreateShowcaseRoomPayload {
  userId: string;
  showcaseRoomName: string;
  showcaseRoomSummary: string;
  coverImage?: string;
  videoIntro?: string;
  role: string;
  qualification?: string;
  coreCompetencies: string[];
  insightsId: Array<{
    companyName: string;
    website: string;
    industry: string;
    duration: string;
    teamSize: string;
    valueAddedSummary: string;
    technicalSkills: string[];
    transferableSkills: string[];
    insightsFile?: string[];
  }>;
}

export const showcaseApi = createApi({
  reducerPath: "showcaseApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: BaseUrl,
    prepareHeaders: (headers) => {
      const token = Cookies.get("tb_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["ShowcaseRoom"],
  endpoints: (builder) => ({
    getShowcaseRooms: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `showcase-rooms?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["ShowcaseRoom"],
    }),
    getDraftsByUser: builder.query<any, string>({
      query: (userId) => ({
        url: `showcase-rooms/defaultAllbyuserId/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["ShowcaseRoom"],
    }),
    getShowcaseRoomById: builder.query<any, string>({
      query: (id) => ({
        url: `showcase-rooms/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["ShowcaseRoom"],
    }),
    createShowcaseRoomWithInsights: builder.mutation<any, CreateShowcaseRoomPayload>({
      query: (payload) => ({
        url: "showcase-rooms/create-with-insights",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    createDefaultShowcaseRoom: builder.mutation<any, Record<string, any> | void>({
      query: (body) => ({
        url: "showcase-rooms/create-default",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["ShowcaseRoom"],
    }),
    uploadShowcaseCover: builder.mutation<any, { id: string; file: File }>({
      query: ({ id, file }) => {
        const form = new FormData();
        form.append("file", file);
        return {
          url: `showcase-rooms/${id}/upload-image`,
          method: "POST",
          body: form,
        };
      },
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["ShowcaseRoom"],
    }),
    uploadShowcaseVideo: builder.mutation<any, { id: string; file: File }>({
      query: ({ id, file }) => {
        const form = new FormData();
        form.append("file", file);
        return {
          url: `showcase-rooms/${id}/upload-video`,
          method: "POST",
          body: form,
        };
      },
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["ShowcaseRoom"],
    }),
    deleteShowcaseRoom: builder.mutation<any, string>({
      query: (id) => ({
        url: `showcase-rooms/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["ShowcaseRoom"],
    }),
    uploadInsightFile: builder.mutation<any, { insightId: string; file: File }>({
      query: ({ insightId, file }) => {
        const form = new FormData();
        form.append("file", file);
        return {
          url: `insights/${insightId}/upload-files`,
          method: "POST",
          body: form,
        };
      },
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["ShowcaseRoom"],
    }),
  }),
});

export const { 
  useGetShowcaseRoomsQuery, 
  useGetDraftsByUserQuery, 
  useGetShowcaseRoomByIdQuery, 
  useCreateShowcaseRoomWithInsightsMutation, 
  useCreateDefaultShowcaseRoomMutation, 
  useUploadShowcaseCoverMutation,
  useDeleteShowcaseRoomMutation ,
  useUploadShowcaseVideoMutation,
  useUploadInsightFileMutation
} = showcaseApi;
export default showcaseApi;
