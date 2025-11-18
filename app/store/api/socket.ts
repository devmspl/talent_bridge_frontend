import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

export interface RoomMember {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
}

export interface ChatRoom {
  _id: string;
  type: string;
  userPairKey: string;
  users: Array<{
    _id: string;
    fullname: string;
    email: string;
    avatar: string;
    contact_number?: string;
    dob?: string;
    created_at?: string;
    updated_at?: string;
    openForWork?: boolean;
    employmentType?: string[];
    industryType?: string[];
    __v?: number;
  }>;
  lastActive: string;
  unreadCount: number;
  is_archived: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
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

export interface Attachment {
  url: string;
  name: string;
  type: string;
  size?: number;
}

export interface SendMessagePayload {
  msg?: string;
  attachments?: Attachment[];
  roomId: string;
}

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private userId: string | null = null;

  constructor() {
    this.token = Cookies.get("tb_token") || null;
  }

  connect(userId: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.userId = userId;
    
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://backend.webridgetalent.com", {
      secure: true,
      transports: ["polling"],
      query: {
        token: this.token,
        userId: this.userId
      }
    });

    this.socket.on("connect", () => {
      console.log("✔ Connected: " + this.socket?.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Connect Error: " + err.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected: " + reason);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Room operations - Client → Server
  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join_room', { roomId });
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave_room', { roomId });
    }
  }

  createRoom(userId: string, toUserId: string, callback?: (room: ChatRoom) => void) {
    if (this.socket) {
      const payload = { userId, toUserId };
      this.socket.emit('create_room', payload);
      if (callback) {
        this.socket.once('room_created', callback);
      }
    }
  }

  deleteRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('delete_room', { roomId });
    }
  }

  getMyRooms(callback?: (rooms: ChatRoom[]) => void) {
    if (this.socket) {
      this.socket.emit('get_my_rooms');
      if (callback) {
        this.socket.once('rooms_list', callback);
      }
    }
  }

  // Message operations - Client → Server
  sendMessage(payload: SendMessagePayload) {
    if (this.socket) {
      this.socket.emit('send_message', payload);
    }
  }

  readMessage(messageId: string, roomId: string) {
    if (this.socket) {
      this.socket.emit('read_message', { messageId, roomId });
    }
  }

  readMassageLegacy(messageId: string, roomId: string) {
    if (this.socket) {
      this.socket.emit('read_massage', { messageId, roomId });
    }
  }

  editMessage(messageId: string, content: string, roomId: string) {
    if (this.socket) {
      this.socket.emit('edit_message', { messageId, content, roomId });
    }
  }

  deleteMessage(messageId: string, roomId: string) {
    if (this.socket) {
      this.socket.emit('delete_message', { messageId, roomId });
    }
  }

  replyMessage(messageId: string, content: string, roomId: string) {
    if (this.socket) {
      this.socket.emit('reply_message', { messageId, content, roomId });
    }
  }

  getChat(roomId: string, callback?: (messages: Message[]) => void) {
    if (this.socket) {
      this.socket.emit('get_chat', { roomId });
      if (callback) {
        this.socket.once('chat_history', callback);
      }
    }
  }

  // Event listeners
  onMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageDeliveryUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('message_delivery_updated', callback);
    }
  }

  onMessageRead(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('message_readed', callback);
      // Handle legacy event
      this.socket.on('massage_readed', callback);
    }
  }

  onMessageEdited(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('message_edited', callback);
    }
  }

  onMessageDeleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  onMessageReplied(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('message_replied', callback);
    }
  }

  onChatHistory(callback: (messages: Message[]) => void) {
    if (this.socket) {
      this.socket.on('chat_history', callback);
    }
  }

  onUserConnected(callback: (user: any) => void) {
    if (this.socket) {
      this.socket.on('user_connected', callback);
    }
  }

  onUserDisconnected(callback: (user: any) => void) {
    if (this.socket) {
      this.socket.on('user_disconnected', callback);
    }
  }

  onRoomsJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('rooms_joined', callback);
    }
  }

  onRoomsList(callback: (rooms: ChatRoom[]) => void) {
    if (this.socket) {
      this.socket.on('rooms_list', callback);
    }
  }

  onRoomCreated(callback: (room: ChatRoom) => void) {
    if (this.socket) {
      this.socket.on('room_created', callback);
    }
  }

  onRoomJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('room_joined', callback);
    }
  }

  onRoomLeft(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('room_left', callback);
    }
  }

  onRoomDeleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('room_deleted', callback);
    }
  }

  onUserTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStoppedTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_stopped_typing', callback);
    }
  }

  onArchiveCreated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('archive_created', callback);
    }
  }

  onAllArchivedRooms(callback: (rooms: ChatRoom[]) => void) {
    if (this.socket) {
      this.socket.on('all_archived_rooms', callback);
    }
  }

  onRoomUnarchived(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('room_unarchived', callback);
    }
  }

  onError(callback: (error: any) => void) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // Typing indicators - Client → Server
  startTyping(roomId: string) {
    if (this.socket) {
      this.socket.emit('typing_start', { roomId });
    }
  }

  stopTyping(roomId: string) {
    if (this.socket) {
      this.socket.emit('typing_stop', { roomId });
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // Remove event listeners
  removeListener(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  // Legacy methods for backward compatibility
  getRooms(callback: (rooms: ChatRoom[]) => void) {
    this.getMyRooms(callback);
  }

  getRoomMessages(roomId: string, callback: (messages: Message[]) => void) {
    this.getChat(roomId, callback);
  }

  // Create chat room (legacy)
  createRoomLegacy(userId: string, toUserId: string, callback: (room: ChatRoom) => void) {
    this.createRoom(userId, toUserId, callback);
  }

  // Archive operations
  createArchive(roomIds: string[]) {
    if (this.socket) {
      this.socket.emit('create_archive', { roomIds });
    }
  }

  getArchiveRooms(callback: (rooms: ChatRoom[]) => void) {
    if (this.socket) {
      this.socket.emit('get_archive_rooms');
      this.socket.once('all_archived_rooms', callback);
    }
  }

  unarchiveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('unarchive_room', { roomId });
    }
  }

  // Legacy archive method
  archiveRoom(roomId: string, callback: (success: boolean) => void) {
    if (this.socket) {
      this.createArchive([roomId]);
      this.socket.once('archive_created', callback);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;