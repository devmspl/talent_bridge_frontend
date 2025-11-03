import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl } from "../BaseUrl";
import Cookies from "js-cookie";

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
}

export interface Attachment {
  url: string;
  name: string;
  type: string;
  size?: number;
}

export interface SendMessagePayload {
  msg?: string;
  attachments?: Attachment[];
}

export const chatApi = createApi({
  reducerPath: "chatApi",
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
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getChats: builder.query<Chat[], { page_no: number; page_size: number; userId: string }>({
      query: ({ page_no, page_size, userId }) =>
        `chat/rooms?page_no=${page_no}&page_size=${page_size}&userId=${userId}`,
    }),
    createChat: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => `chat/createChat?userId=${userId}`,
    }),
    sendMessage: builder.mutation<any, { roomId: string; payload: SendMessagePayload }>({
      query: ({ roomId, payload }) => ({
        url: `chat/rooms/${roomId}/messages`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const { useGetChatsQuery, useCreateChatMutation, useSendMessageMutation } = chatApi;
export default chatApi;
