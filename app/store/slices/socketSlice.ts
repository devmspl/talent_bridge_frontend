// store/socketSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

type Message = {
  _id?: string;
  senderId: string;
  senderName?: string;
  text: string;
  roomId: string;
  timestamp: string;
  createdAt?: string;
};

type Room = {
  _id: string;
  roomId: string;
  members: string[];
  lastMessage?: Message;
};

type SocketState = {
  socket: Socket | null;
  onlineUsers: { id: string; online: boolean }[];
  messages: Record<string, Message[]>;
  rooms: Room[];
  currentRoomId: string | null;
};

const initialState: SocketState = {
  socket: null,
  onlineUsers: [],
  messages: {},
  rooms: [],
  currentRoomId: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket(state: any, action: PayloadAction<Socket>) {
      state.socket = action.payload;
    },
    addMessage(
      state,
      action: PayloadAction<{ roomId: string; message: Message }>
    ) {
      const { roomId, message } = action.payload;
      if (!state.messages[roomId]) state.messages[roomId] = [];
      state.messages[roomId].push(message);
    },
    setMessages(
      state,
      action: PayloadAction<{ roomId: string; messages: Message[] }>
    ) {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = messages;
    },
    setOnlineUsers(
      state,
      action: PayloadAction<{ id: string; online: boolean }[]>
    ) {
      state.onlineUsers = action.payload;
    },
    setRooms(state, action: PayloadAction<Room[]>) {
      state.rooms = action.payload;
    },
    addRoom(state, action: PayloadAction<Room>) {
      const existingRoom = state.rooms.find(room => room._id === action.payload._id);
      if (!existingRoom) {
        state.rooms.push(action.payload);
      }
    },
    setCurrentRoom(state, action: PayloadAction<string | null>) {
      state.currentRoomId = action.payload;
    },
  },
});

export const { 
  setSocket, 
  addMessage, 
  setMessages, 
  setOnlineUsers, 
  setRooms, 
  addRoom, 
  setCurrentRoom 
} = socketSlice.actions;
export default socketSlice.reducer;
export type { Message, Room };
