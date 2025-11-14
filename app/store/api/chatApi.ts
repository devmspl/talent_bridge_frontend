import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl } from "../BaseUrl";
import Cookies from "js-cookie";

export interface RoomMember {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
}

export interface ChatRoom {
  _id: string;
  name: string;
  members: RoomMember[];
  messages: Message[];
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface Message {
  _id: string;
  message: string;
  attachments: Array<{
    url: string;
    name: string;
    type: string;
    size?: number;
  }>;
  timestamp: string;
  msgFrom: {
    _id: string;
    email: string;
    avatar?: string;
  };
  room: string;
  status?: string;
}

export interface Message {
  _id: string;
  message: string;
  attachments: Array<{
    url: string;
    name: string;
    type: string;
    size?: number;
  }>;
  timestamp: string;
  msgFrom: {
    _id: string;
    email: string;
    avatar?: string;
  };
  room: string;
  status?: string;
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
  tagTypes: ["Chat", "Message", "ChatRoom"],
  endpoints: (builder) => ({
    // Get all rooms
    getAllRooms: builder.query<{ data: ChatRoom[] }, void>({
      query: () => 'chat/rooms',
      providesTags: (result) => 
        result?.data 
          ? [...result.data.map(({ _id }) => ({ type: 'ChatRoom' as const, id: _id }))] 
          : ['ChatRoom']
    }),
    
    // Get user's chats (kept for backward compatibility)
    getChats: builder.query<Chat[], { page_no: number; page_size: number; userId: string }>({
      query: ({ page_no, page_size, userId }) =>
        `chat/rooms?page_no=${page_no}&page_size=${page_size}&userId=${userId}`,
    }),
    getRoomMessages: builder.query<{ data: Message[] }, string>({
      query: (roomId) => ({
        url: `chat/rooms/${roomId}/messages`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Message' as const, id: _id })),
              { type: 'Message', id: 'LIST' },
            ]
          : [{ type: 'Message', id: 'LIST' }],
    }),
    sendMessage: builder.mutation<any, { roomId: string; payload: SendMessagePayload }>({
      query: ({ roomId, payload }) => ({
        url: `chat/rooms/${roomId}/messages`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Message'],
    }),
    archiveRoom: builder.mutation<{ success: boolean }, string>({
      query: (roomId) => ({
        url: `chat/rooms/${roomId}/archive`,
        method: 'POST',
      }),
      invalidatesTags: ['Chat'],
    }),
    getArchivedRooms: builder.query<any, void>({
      query: () => 'chat/rooms/archived',
      providesTags: ['Chat'],
    }),
    createChatRoom: builder.mutation<{ data: ChatRoom }, { members: string[], type: string }>({
      query: (body) => ({
        url: 'chat/rooms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ChatRoom'],
    }),
  }),
});

export const { 
  useGetAllRoomsQuery,
  useGetChatsQuery, 
  useSendMessageMutation,
  useGetRoomMessagesQuery,
  useArchiveRoomMutation,
  useGetArchivedRoomsQuery,
  useCreateChatRoomMutation
} = chatApi;

export default chatApi;
