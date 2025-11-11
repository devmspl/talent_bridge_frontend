import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, chatApi } from "../api/chatApi";
import { Message, Room } from "./socketSlice";

interface ChatState {
  loadingChats: boolean;
  chats: Chat[];
  loadingMessages: boolean;
  messages: Message[];
  currentRoomId: string | null;
  rooms: Room[];
}

const initialState: ChatState = {
  loadingChats: false,
  chats: [],
  loadingMessages: false,
  messages: [],
  currentRoomId: null,
  rooms: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
      loadingMessages(state) {
        state.loadingMessages = true;
      },
      loadedMessages(state) {
        state.loadingMessages = false;
      },
      setMessages(state, action: PayloadAction<Message[]>) {
        state.messages = action.payload;
      },
      updateMessageStatus(
        state,
        action: PayloadAction<{ roomId: string; messageId: string; status: string }>
      ) {
        const { roomId, messageId, status } = action.payload;
        
        // Update message in messages array
        const messageIndex = state.messages.findIndex(
          (msg) => msg._id === messageId
        );
        
        if (messageIndex !== -1) {
          state.messages[messageIndex] = {
            ...state.messages[messageIndex],
            status: status
          };
        }
        
        // If the message is in a room's messages, update it there as well
        const roomIndex = state.rooms.findIndex(room => room._id === roomId);
        if (roomIndex !== -1) {
          const roomMessageIndex = state.rooms[roomIndex].messages.findIndex(
            msg => msg._id === messageId
          );
          
          if (roomMessageIndex !== -1) {
            state.rooms[roomIndex].messages[roomMessageIndex] = {
              ...state.rooms[roomIndex].messages[roomMessageIndex],
              status: status
            };
          }
        }
      },
    },
    extraReducers: (builder) => {
      // getChats
      builder.addMatcher(
        chatApi.endpoints.getChats.matchPending,
        (state) => {
          state.loadingChats = true;
        }
      );
      builder.addMatcher(
        chatApi.endpoints.getChats.matchFulfilled,
        (state, action) => {
          state.loadingChats = false;
          state.chats = action.payload;
        }
      );
      builder.addMatcher(
        chatApi.endpoints.getChats.matchRejected,
        (state) => {
          state.loadingChats = false;
        }
      );
  
      // createChat
      builder.addMatcher(
        chatApi.endpoints.createChat.matchFulfilled,
        (state, action) => {
          state.chats.push(action.payload); // add new chat to state
        }
      );
  
      // sendMessage
      builder.addMatcher(
        chatApi.endpoints.sendMessage.matchFulfilled,
        (state, action) => {
          state.messages.push(action.payload); // add new message to state
        }
      );
    },
  });

  export const { loadingMessages, loadedMessages, setMessages } = chatSlice.actions;
  export default chatSlice.reducer;
