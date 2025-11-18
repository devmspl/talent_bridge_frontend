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

  // Room operations
  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave_room', roomId);
    }
  }

  // Message operations
  sendMessage(payload: SendMessagePayload) {
    if (this.socket) {
      this.socket.emit('send_message', payload);
    }
  }

  // Event listeners
  onMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onRoomJoined(callback: (roomId: string) => void) {
    if (this.socket) {
      this.socket.on('room_joined', callback);
    }
  }

  onRoomLeft(callback: (roomId: string) => void) {
    if (this.socket) {
      this.socket.on('room_left', callback);
    }
  }

  onUserJoined(callback: (user: RoomMember, roomId: string) => void) {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback: (userId: string, roomId: string) => void) {
    if (this.socket) {
      this.socket.on('user_left', callback);
    }
  }

  onTyping(callback: (user: RoomMember, roomId: string) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onStopTyping(callback: (user: RoomMember, roomId: string) => void) {
    if (this.socket) {
      this.socket.on('user_stop_typing', callback);
    }
  }

  // Typing indicators
  startTyping(roomId: string) {
    if (this.socket) {
      this.socket.emit('typing', roomId);
    }
  }

  stopTyping(roomId: string) {
    if (this.socket) {
      this.socket.emit('stop_typing', roomId);
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

  // Get all rooms (emit request and listen for response)
  getRooms(callback: (rooms: ChatRoom[]) => void) {
    if (this.socket) {
      // Use the correct event name that backend expects
      this.socket.emit('get_my_rooms');
      // Listen for the correct event name that backend emits
      this.socket.once('rooms_list', callback);
    }
  }

  // Get room messages (emit request and listen for response)
  getRoomMessages(roomId: string, callback: (messages: Message[]) => void) {
    if (this.socket) {
      this.socket.emit('get_room_messages', roomId);
      this.socket.once('room_messages', callback);
    }
  }

  // Get chat history for a room
  getChat(roomId: string, callback: (messages: Message[]) => void) {
    if (this.socket) {
      this.socket.emit('get_chat', roomId);
      this.socket.once('chat_history', callback);
    }
  }

  // Create chat room
  createRoom(userId: string, toUserId: string, callback: (room: ChatRoom) => void) {
    if (this.socket) {
      const payload = { userId, toUserId };
      this.socket.emit('create_room', payload);
      this.socket.once('room_created', callback);
    }
  }

  // Archive room
  archiveRoom(roomId: string, callback: (success: boolean) => void) {
    if (this.socket) {
      this.socket.emit('archive_room', roomId);
      this.socket.once('room_archived', callback);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;