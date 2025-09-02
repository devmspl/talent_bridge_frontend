import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl } from "../BaseUrl";

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: BaseUrl }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getChats: builder.query<Chat[], { page_no: number; page_size: number; userId: string }>({
      query: ({ page_no, page_size, userId }) =>
        `chat/getAllRooms?page_no=${page_no}&page_size=${page_size}&userId=${userId}`,
    }),
    createChat: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => `chat/createChat?userId=${userId}`,
    }),
    sendMessage: builder.mutation<any, { roomId: string; message: string }>({
      query: ({ roomId, message }) => `chat/sendMessage?roomId=${roomId}&message=${message}`,
    }),
  }),
});

export const { useGetChatsQuery, useCreateChatMutation } = chatApi;
export default chatApi;
