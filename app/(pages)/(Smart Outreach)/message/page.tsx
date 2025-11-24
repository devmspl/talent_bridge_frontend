"use client";
import { useEffect, useRef, useState, useCallback } from "react";
// import { FiSend } from "react-icons/fi";
// import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import user from "@/public/assets/profile/user.png";
import user1 from "@/public/assets/profile/Avatar (1).png";
import user2 from "@/public/assets/profile/Avatar (2).png";
import user3 from "@/public/assets/profile/Avatar (12).png";
import user4 from "@/public/assets/profile/Avatar (4).png";
import user5 from "@/public/assets/profile/Avatar (5).png";
import user6 from "@/public/assets/profile/Avatar (6).png";
import user7 from "@/public/assets/profile/Avatar (9).png";
import user8 from "@/public/assets/profile/Avatar (10).png";
import user9 from "@/public/assets/profile/Avatar (11).png";
import call from "@/public/assets/icons/call12.svg";
import mail from "@/public/assets/icons/mail12.svg";
import deleteIcon from "@/public/assets/icons/un-archive.svg";
import link from "@/public/assets/icons/link.png";
import smile from "@/public/assets/icons/smile.png";
import { useAppDispatch } from "@/app/store/reduxHook";
import socketService from "@/app/store/api/socket";
import type { ChatRoom, Message as MessageType } from "@/app/store/api/socket";
import Cookies from "js-cookie";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { BaseUrl } from "@/app/store/BaseUrl";
import { log } from "console";

  // Helper to format contact ISO timestamps safely
  const formatContactDate = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return '';
    }
  };

type Contact = {
  id: string;
  profile: any;
  name: string;
  // store canonical ISO timestamp for the last activity
  time?: string; // keep for backwards compatibility but ensure it's an ISO string
  timeIso?: string;
  message: string;
  online: boolean;
  img: any;
  unread: boolean;
  unreadCount?: number;
  archived: boolean;
  roomId?: string;
  email?: string;
};

export default function ChatPage() {
  const dispatch = useAppDispatch();
  // Read userId directly from cookies as it's the source of truth
  const userId: string = Cookies.get("tb_userId") || "";
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [archivedRooms, setArchivedRooms] = useState<ChatRoom[]>([]);
  const [suppressInitialUnread, setSuppressInitialUnread] = useState<boolean>(true);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [archivedOpen, setArchivedOpen] = useState<boolean>(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Normalize archived rooms payloads from server
  const normalizeArchivedPayload = (payload: any): ChatRoom[] => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.rooms)) return payload.rooms;
    if (Array.isArray(payload.data)) return payload.data;
    // If payload has a nested structure like { archivedRooms: [...] }
    if (Array.isArray(payload.archivedRooms)) return payload.archivedRooms;
    // If server returns object keyed by id -> room, convert to array
    if (typeof payload === 'object') {
      try {
        return Object.values(payload).filter((v: any) => v && v._id) as ChatRoom[];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  // Deduplicate ChatRoom array by _id
  const dedupeChatRooms = (rooms: ChatRoom[] = []) => {
    const map = new Map<string, ChatRoom>();
    rooms.forEach(r => {
      if (r && r._id) {
        if (!map.has(r._id)) map.set(r._id, r);
      }
    });
    return Array.from(map.values());
  };

// Function to scroll to bottom of chat
const scrollToBottom = useCallback((force = false) => {
  if (!messagesEndRef.current) return;
  
  const chatContainer = messagesEndRef.current.parentElement;
  if (!chatContainer) return;
  
  // Only auto-scroll if forced or if already near bottom
  const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100;
  if (force || isNearBottom) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, []);


  // Initialize socket connection
  useEffect(() => {
    if (userId) {
      const token = Cookies.get("tb_token");
      const socket = socketService.connect(userId);
      setIsSocketConnected(true);
      setSocketInstance(socket);


      // Listen for incoming messages
      socket.on('new_message', (data: any) => {
        
        const message = data.message || data; // Handle both direct message and wrapped message
        const roomId = data.roomId || message.roomId;
        
        // Format the message to match the expected structure
        const formattedMessage: MessageType = {
          _id: message._id,
          message: message.msg || message.message,
          attachments: message.attachments || [],
          timestamp: message.createdAt || new Date().toISOString(),
          msgFrom: {
            _id: message.msgFrom?._id,
            email: message.msgFrom?.email || '',
            fullname: message.msgFrom?.fullname || 'Unknown',
            avatar: message.msgFrom?.avatar || message.msgFrom?.photo || ''
          },
          room: roomId,
          status: message.read ? 'read' : 'delivered',
          isEdited: message.isEdited || false,
          isDeleted: message.isDeleted || false
        };
       
        
        // Add message if it's for the current selected room
        if (selectedRoomId && roomId === selectedRoomId) {
          setMessages(prev => {
            // Check if message already exists (by ID or by content + timestamp)
            const messageExists = prev.some(m => 
              m._id === formattedMessage._id || 
              (m.message === formattedMessage.message && 
               m.timestamp === formattedMessage.timestamp)
            );
            
            if (messageExists) {
              return prev;
            }
            
            return [...prev, formattedMessage];
          });
          
          // Mark as read if this is the current user's room
          if (socket && message.msgFrom?._id !== userId) {
            socket.emit('mark_as_read', { 
              messageId: message._id, 
              roomId: roomId 
            });
          }
        } else {
          // Message is for another room - update the contact's last message
          // Determine sender id from multiple possible shapes
          const possibleSender = message.msgFrom ?? data.msgFrom ?? data.sender ?? message.sender ?? data.userId ?? message.from;
          let senderId = '';
          if (typeof possibleSender === 'string') {
            senderId = possibleSender;
          } else if (typeof possibleSender === 'object' && possibleSender) {
            senderId = possibleSender._id || possibleSender.id || '';
          }
          const isFromCurrentUser = String(senderId) === String(userId);

          setContacts(prev => prev.map(contact => {
            if (contact.roomId === roomId) {
              return {
                ...contact,
                message: formattedMessage.message,
                time: new Date(formattedMessage.timestamp).toISOString(),
                timeIso: new Date(formattedMessage.timestamp).toISOString(),
                // Only mark unread/increment count if the message is NOT from current user
                unread: isFromCurrentUser ? contact.unread : true,
                unreadCount: isFromCurrentUser ? (contact.unreadCount || 0) : ((contact.unreadCount || 0) + 1)
              };
            }
            return contact;
          }));
        }
      });

      // Listen for message delivery updates
      socket.on('message_delivery_updated', (data: any) => {
        if (selectedRoomId && data.roomId === selectedRoomId) {
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId ? { ...msg, status: data.status } : msg
          ));
        }
      });

      // Listen for message read events (both current and legacy)
      socket.on('message_readed', (data: any) => {
        if (selectedRoomId && data.roomId === selectedRoomId) {
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId ? { ...msg, status: 'read' } : msg
          ));
        }
        // Clear unread count for the room when server notifies messages were read
        if (data && data.roomId) {
          setContacts(prev => prev.map(c => c.roomId === data.roomId ? { ...c, unread: false, unreadCount: 0 } : c));
        }
      });

      socket.on('massage_readed', (data: any) => {
        if (selectedRoomId && data.roomId === selectedRoomId) {
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId ? { ...msg, status: 'read' } : msg
          ));
        }
        if (data && data.roomId) {
          setContacts(prev => prev.map(c => c.roomId === data.roomId ? { ...c, unread: false, unreadCount: 0 } : c));
        }
      });

      // Listen for message edits
      socket.on('message_edited', (data: any) => {
        if (selectedRoomId && data.roomId === selectedRoomId) {
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId ? { ...msg, message: data.content, status: 'edited' } : msg
          ));
        }
      });

      // Listen for message deletions
      socket.on('message_deleted', (data: any) => {
        if (selectedRoomId && data.roomId === selectedRoomId) {
          setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
        }
      });

      // Listen for message replies
      socket.on('message_replied', (data: any) => {
        if (selectedRoomId && data.roomId === selectedRoomId) {
          setMessages(prev => [...prev, data.replyMessage]);
        }
      });

      // Listen for chat history
      socket.on('get_chat', (messages: MessageType[]) => {
        if (selectedRoomId && messages.length > 0 && messages[0].room === selectedRoomId) {
          setMessages(messages);
        }
      });
      
      // For backward compatibility
      socket.on('chat_history', (messages: MessageType[]) => {
        if (selectedRoomId && messages.length > 0 && messages[0].room === selectedRoomId) {
          setMessages(messages);
        }
      });

      // Listen for typing indicators
      socket.on('user_typing', (data: any) => {
        if (selectedRoomId && data.roomId === selectedRoomId) {
          setTypingUsers(prev => [...prev.filter(u => u._id !== data.user._id), data.user]);
        }
      });

      socket.on('user_stopped_typing', (data: any) => {
        if (selectedRoomId && data.roomId === selectedRoomId) {
          setTypingUsers(prev => prev.filter(u => u._id !== data.user._id));
        }
      });

      // Listen for archive events
      socket.on('archive_created', (data: any) => {
        // Refresh rooms list and archived rooms
        socketService.getMyRooms((roomsList: ChatRoom[]) => {
          setRooms(roomsList);
        });
        socketService.getArchiveRooms((archived: ChatRoom[]) => {
          setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(archived)));
        });
      });

      socket.on('room_unarchived', (data: any) => {
        // Refresh rooms list and archived rooms
        socketService.getMyRooms((roomsList: ChatRoom[]) => {
          setRooms(roomsList);
        });
        socketService.getArchiveRooms((archived: ChatRoom[]) => {
          setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(archived)));
        });
      });

      socket.on('all_archived_rooms', (archived: ChatRoom[]) => {
        setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(archived)));
      });

      // Listen for user connection events
      socket.on('user_connected', (user: any) => {
        // Update UI to show user is online
        setContacts(prev => prev.map(contact => {
          if (contact.id === user._id || contact.email === user.email) {
            return { ...contact, isOnline: true };
          }
          return contact;
        }));
      });

      socket.on('user_disconnected', (user: any) => {
        // Update UI to show user is offline
        setContacts(prev => prev.map(contact => {
          if (contact.id === user._id || contact.email === user.email) {
            return { ...contact, isOnline: false };
          }
          return contact;
        }));
      });

      // Listen for room events
      socket.on('rooms_joined', (data: any) => {
        // Update rooms list if needed
      });

      socket.on('room_created', (room: ChatRoom) => {
        setRooms(prev => [...prev, room]);
      });

      socket.on('room_joined', (data: any) => {
        // Update room members or UI state
      });

      socket.on('room_left', (data: any) => {
        // Update UI state
        if (data.roomId === selectedRoomId) {
          setSelectedRoomId(null);
          setMessages([]);
        }
      });

      socket.on('room_deleted', (data: any) => {
        // Remove room from list and update UI
        setRooms(prev => prev.filter(room => room._id !== data.roomId));
        if (data.roomId === selectedRoomId) {
          setSelectedRoomId(null);
          setMessages([]);
        }
      });

      // Listen for errors
      socket.on('error', (error: any) => {
        // Handle error appropriately
      });

      // Handle incoming messages from socket
      socketService.onMessage((socketMessage: any) => {
        
        // Check if this is a new_message event with the expected structure
        if (socketMessage.message) {
          const message = socketMessage; 
          // Add message if it's for the current selected room
          if (selectedRoomId && message.room === selectedRoomId) {
            
            // Format the message to match your expected structure
            const formattedMessage = {
              _id: message._id,
              content: message.msg,
              sender: message.msgFrom?._id || '',
              room: message.roomId,
              createdAt: message.createdAt,
              updatedAt: message.updatedAt,
              read: message.read,
              // Include the full sender info if needed
              senderInfo: message.msgFrom,
              // Include any other fields your UI expects
            };
            
            setMessages((prevMessages :any) => [...prevMessages, formattedMessage]);
            
            // Scroll to bottom after adding new message
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          } else {
                // Message is for another room - update messages list only here.
                // Contact unread handling is done in the primary socket 'new_message' handler to avoid duplicate increments.
                setMessages((prevMessages :any) => [...prevMessages, message]);
          }
        }
      });

      // Listen for room join events
      socketService.onRoomJoined((roomId: string) => {
      });

      socketService.onRoomLeft((roomId: string) => {
      });

      // Listen for room creation events
      if (socket) {
        socket.on('room_created', (newRoom: ChatRoom) => {
          setRooms(prev => {
            const exists = prev.find(r => r._id === newRoom._id);
            if (!exists) {
              return [...prev, newRoom];
            }
            return prev;
          });
        });
      }

      // Get archived rooms on initial connect
      setTimeout(() => {
        socketService.getArchiveRooms((archived: ChatRoom[]) => {
          setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(archived)));
        });
      }, 1200);

      // Add event listeners for debugging
      if (socket) {
        socket.onAny((event, data) => {
          
          // Catch any room-related events that might be missed
          if (event.includes('room') || event.includes('Room')) {
          }
        });

        // Listen for all possible room list events
        socket.on('rooms_list', (rooms: ChatRoom[]) => {
          setRooms(rooms);
          // Auto-join all rooms to ensure we receive messages
          rooms.forEach(room => {
            if (room._id) {
              socketService.joinRoom(room._id);
            }
          });
        });
        
        socket.on('rooms', (rooms: ChatRoom[]) => {
          setRooms(rooms);
        });
        
        socket.on('all_rooms', (rooms: ChatRoom[]) => {
          setRooms(rooms);
        });
        
        socket.on('user_rooms', (rooms: ChatRoom[]) => {
          setRooms(rooms);
        });

        // Wait for connection then get rooms
        socket.on("connect", () => {
          setIsSocketConnected(true);
          
          setTimeout(() => {
            socketService.getMyRooms((roomsList: ChatRoom[]) => {
              setRooms(roomsList || []);
              // suppress server-provided unread counts on initial load
              setTimeout(() => setSuppressInitialUnread(false), 50);
            });
          }, 1000);
        });

        // Listen for room-related events using your exact event names
        socket.on('rooms_joined', (data: any) => {
          if (data.roomIds && data.roomIds.length > 0) {
            // Refresh rooms list after joining
            socketService.getRooms((roomsList: ChatRoom[]) => {
              setRooms(roomsList);
            });
          }
        });

        socket.on('rooms_list', (rooms: ChatRoom[]) => {
          setRooms(rooms);
          // Auto-join all rooms to ensure we receive messages
          rooms.forEach(room => {
            if (room._id) {
              socketService.joinRoom(room._id);
            }
          });
        });

        socket.on('room_created', (newRoom: ChatRoom) => {
          
          setRooms(prev => {
            const updatedRooms = [...prev, newRoom];
            return updatedRooms;
          });
          
          // Auto-join the new room to receive messages
          if (newRoom._id) {
            socketService.joinRoom(newRoom._id);
          }
        });

        socket.on('room_joined', (data: any) => {
          if (data.roomId) {
          }
        });

        socket.on('room_left', (data: any) => {
          if (data.roomId) {
          }
        });
      }

      return () => {
        socketService.disconnect();
        setIsSocketConnected(false);
        setSocketInstance(null);
      };
    }
  }, [userId]);

  // Listen to socketService convenience listeners (cleanup-safe)
  useEffect(() => {
    if (!isSocketConnected) return;

    const onArchiveCreated = (data: any) => {
      socketService.getMyRooms((roomsList: ChatRoom[]) => setRooms(roomsList));
  socketService.getArchiveRooms((archived: ChatRoom[]) => setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(archived))));
    };

  const onAllArchived = (rooms: ChatRoom[]) => setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(rooms)));

    const onRoomUnarchived = (data: any) => {
      socketService.getMyRooms((roomsList: ChatRoom[]) => setRooms(roomsList));
  socketService.getArchiveRooms((archived: ChatRoom[]) => setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(archived))));
    };

    socketService.onArchiveCreated(onArchiveCreated);
    socketService.onAllArchivedRooms(onAllArchived);
    socketService.onRoomUnarchived(onRoomUnarchived);

    return () => {
      socketService.removeListener('archive_created', onArchiveCreated);
      socketService.removeListener('all_archived_rooms', onAllArchived);
      socketService.removeListener('room_unarchived', onRoomUnarchived);
    };
  }, [isSocketConnected]);

  // Get room messages when room is selected
  useEffect(() => {
    if (selectedRoomId && isSocketConnected) {
      
      // Clear previous messages first
      setMessages([]);
      
      // Join the room to receive live messages
      socketService.joinRoom(selectedRoomId);
      
      // Get existing messages with timeout
      let messageReceived = false;
      
      socketService.getChat(selectedRoomId, (messages: MessageType[]) => {
        messageReceived = true;
        setMessages(messages);
        
        // Scroll to bottom when messages change or room changes
        useEffect(() => {
          scrollToBottom();
        }, [messages, selectedRoomId]);
      });
      
      // Add timeout to check if messages were received
      setTimeout(() => {
        if (!messageReceived) {
        } else if (messagesEndRef.current) {
          // One more scroll attempt after timeout to ensure we're at the bottom
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [selectedRoomId, isSocketConnected]);

  // Manual refresh rooms function
  const refreshRooms = () => {
    if (isSocketConnected && socketInstance) {
      
      // Use the correct event name that backend expects
      socketInstance.emit('get_my_rooms');
      
      // Listen for the response
      socketInstance.once('rooms_list', (rooms: ChatRoom[]) => {
        if (rooms && rooms.length > 0) {
        setRooms(rooms);
        
        // Re-join all rooms after refresh
        if (rooms && rooms.length > 0) {
          rooms.forEach(room => {
            socketService.joinRoom(room._id);
          });
        }
      }
      })
      
      socketService.getRooms((roomsList: ChatRoom[]) => {
        setRooms(roomsList);
      });
      
      // Also try to get rooms after a short delay
      setTimeout(() => {
        socketInstance.emit('get_my_rooms');
      }, 2000);
    }
  };

  // Transform API users to contacts format
  const transformUsersToContacts = (users: any[]): Contact[] => {
    if (!users || !Array.isArray(users)) return [];
    return users
      .filter(apiUser => apiUser._id !== userId) // Exclude current user
      .map((apiUser, index) => ({
        id: apiUser._id,
        profile: apiUser?.avatar ? `${BaseUrl}/assets/images/${apiUser?.avatar}` : user1, // Use full URL for profile image
        name: apiUser.fullname || 'Unknown User',
        time: new Date(apiUser.createdAt || Date.now()).toISOString(),
        timeIso: new Date(apiUser.createdAt || Date.now()).toISOString(),
        message: "Available for chat",
        online: Math.random() > 0.5, // Random online status for demo
        img: user,
        unread: Math.random() > 0.7, // Random unread status
        unreadCount: 0,
        archived: false,
        email: apiUser.email,
        roomId: undefined // Will be set when room is created
      }));
  };

// ... (rest of the code remains the same)
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      const formattedRooms = rooms;
      setContacts(prev => {
        const newContacts = [...prev];
        formattedRooms.forEach((room: any) => {
          const existingContact = newContacts.find(c => c.roomId === room._id);
          if (!existingContact && room.users && room.users.length === 2) {
            // Find the other user (not the current user)
            const otherUser = room.users.find((user: any) => user._id !== userId);
            if (otherUser) {
              const newContact = {
                id: otherUser._id || '',
                roomId: room._id,
                name: otherUser.fullname || 'Unknown User',
                email: otherUser.email || '',
                profile: otherUser.avatar || null,
                time: room.lastActive || new Date().toISOString(),
                timeIso: room.lastActive || new Date().toISOString(),
                message: '',
                online: false,
                img: null,
                unread: !suppressInitialUnread && room.unreadCount > 0,
                unreadCount: suppressInitialUnread ? 0 : (room.unreadCount || 0),
                archived: room.is_archived || false
              };
              newContacts.push(newContact);
            }
          }
        });
        return newContacts;
      });

      // Set the first room as selected by default if none is selected
      if (formattedRooms.length > 0 && !selectedRoomId) {
        setSelectedRoomId(formattedRooms[0]._id);
      }
    }
  }, [rooms, userId]);

  // Format message date for grouping
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Group messages by date
  
  
  // Track message IDs to prevent duplicates
  const seenMessageIds = new Set();
  
  const groupedMessages = messages?.reduce((groups: Record<string, any[]>, message: any) => {
    if (!message || !message._id) return groups;
    
    // Skip if we've already seen this message ID
    if (seenMessageIds.has(message._id)) {
      return groups;
    }
    
    // Add message ID to the set of seen messages
    seenMessageIds.add(message._id);
    
    const date = formatMessageDate(message.timestamp || message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    
    const senderInfo = message.msgFrom || message.senderInfo || {};
    const formattedMessage = {
      ...message,
      _id: message._id,
      senderId: senderInfo._id || message.sender,
      senderName: senderInfo.fullname || senderInfo.email || 'Unknown',
      text: message.message || message.text || '',
      timestamp: message.timestamp || message.createdAt,
      roomId: message.room || message.roomId,
      attachments: message.attachments || [],
      status: message.status || 'sent'
    };
    
    groups[date].push(formattedMessage);
    return groups;
  }, {}) || {};

  // Update messages when messages data is loaded
  useEffect(() => {
    if (messages && messages.length > 0 && selectedRoomId) {
      const formattedMessages = messages.map((msg: any) => ({
        _id: msg._id,
        senderId: msg.msgFrom._id,
        senderName: msg.msgFrom.fullname || msg.msgFrom.email,
        text: msg.message,
        roomId: msg.room,
        timestamp: msg.timestamp,
        createdAt: msg.timestamp,
      }));
    }
  }, [messages, selectedRoomId, dispatch]);


  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.roomId) {
      setSelectedRoomId(contact.roomId);
      // Mark messages as read in UI for this contact
      setContacts(prev => prev.map(c => c.roomId === contact.roomId ? { ...c, unread: false, unreadCount: 0 } : c));

      // Inform server that messages in this room are read (best-effort)
      if (socketInstance) {
        try {
          socketInstance.emit('mark_as_read', { roomId: contact.roomId });
        } catch (e) {
          // ignore
        }
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact) return;
    
    try {
      let currentRoomId = selectedRoomId;
      
      // If no room exists, create one first
      if (!currentRoomId && selectedContact.id && userId) {
        socketService.createRoom(userId, selectedContact.id, (newRoom: ChatRoom) => {
          setSelectedRoomId(newRoom._id);
          setRooms(prev => {
            return [...prev, newRoom];
          });
          
          // Refresh room list to ensure all users get the new room
          setTimeout(() => {
            refreshRooms();
          }, 1000);
          
          // Send the message after room is created
          const payload = {
            roomId: newRoom._id,
            message: messageText
          };
          
          if (socketInstance) {
            socketInstance.emit('send_message', payload);
          }
          
          // Add message to UI immediately for better UX
          const tempMessage: MessageType = {
            _id: Date.now().toString(),
            message: messageText,
            attachments: [],
            timestamp: new Date().toISOString(),
            msgFrom: {
              _id: userId,
              email: '',
              avatar: ''
            },
            room: newRoom._id
          };
          
          setMessages(prev => [...prev, tempMessage]);
        });
      } else if (currentRoomId) {
        // Send message to existing room
        const payload = {
          roomId: currentRoomId,
          message: messageText
        };
        
        if (socketInstance) {
          socketInstance.emit('send_message', payload);
        }
        
        // Add message to UI immediately for better UX
        // const tempMessage: MessageType = {
        //   _id: Date.now().toString(),
        //   message: messageText,
        //   attachments: [],
        //   timestamp: new Date().toISOString(),
        //   msgFrom: {
        //     _id: userId,
        //     email: '',
        //     avatar: ""
        //   },
        //   room: currentRoomId
        // };
        
        // setMessages(prev => [...prev, tempMessage]);
      }
      
      setMessageText('');
      setAttachments([]);
      
      // Stop typing indicator
      if (selectedRoomId) {
        socketService.stopTyping(selectedRoomId);
      }
      
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 100);
      
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  // Function to handle typing indicators
  const handleTypingStart = () => {
    if (selectedRoomId && messageText.trim()) {
      socketService.startTyping(selectedRoomId);
    }
  };

  const handleTypingStop = () => {
    if (selectedRoomId) {
      socketService.stopTyping(selectedRoomId);
    }
  };

  // Function to mark message as read
  const markMessageAsRead = (messageId: string) => {
    if (selectedRoomId) {
      socketService.readMessage(messageId, selectedRoomId);
    }
  };

  // Function to edit message
  const editMessage = (messageId: string, newContent: string) => {
    if (selectedRoomId) {
      socketService.editMessage(messageId, newContent, selectedRoomId);
    }
  };

  // Function to delete message
  const deleteMessage = (messageId: string) => {
    if (selectedRoomId) {
      socketService.deleteMessage(messageId, selectedRoomId);
    }
  };

  // Function to reply to message
  const replyToMessage = (messageId: string, content: string) => {
    if (selectedRoomId) {
      socketService.replyMessage(messageId, content, selectedRoomId);
    }
  };

  // Function to create archive (uses socketService callback)
  const createArchive = (roomIds: string[], callback?: (data: any) => void) => {
    socketService.createArchive(roomIds, (data: any) => {
      // Server confirmed archive; refresh lists
      socketService.getArchiveRooms((rooms: ChatRoom[]) => {
        setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(rooms)));
      });
      socketService.getMyRooms((roomsList: ChatRoom[]) => {
        setRooms(roomsList || []);
      });
      // Show archived tab and open archived list
      setFilter('archived');
      setArchivedOpen(true);
      if (callback) callback(data);
    });
    // optimistic refresh in case server doesn't immediately respond
    setTimeout(() => {
      socketService.getArchiveRooms((rooms: ChatRoom[]) => setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(rooms))));
    }, 800);
  };

  // Function to unarchive room (optimistic)
  const unarchiveRoom = (roomId: string) => {
    // Optimistic remove
    setArchivedRooms(prev => prev.filter(r => r._id !== roomId));
    socketService.unarchiveRoom(roomId);
    // Refresh lists after a short delay
    setTimeout(() => {
      socketService.getArchiveRooms((rooms: ChatRoom[]) => {
        setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(rooms)));
      });
      socketService.getMyRooms((roomsList: ChatRoom[]) => {
        setRooms(roomsList || []);
      });
    }, 600);
  };

  // Function to get archived rooms
  const getArchivedRooms = () => {
    socketService.getArchiveRooms((rooms: ChatRoom[]) => {
      setArchivedRooms(dedupeChatRooms(normalizeArchivedPayload(rooms)));
    });
  };

  const handleArchive = () => {
    const roomToArchive = selectedRoomId || selectedContact?.roomId;
    if (!roomToArchive) {
      console.warn('No room selected to archive');
      return;
    }
    // Use socketService with callback to wait for server confirmation
    createArchive([roomToArchive], (data: any) => {
      if (selectedRoomId === roomToArchive) {
        setSelectedRoomId(null);
        setMessages([]);
        setSelectedContact(null);
      }
    });
  };

  const handleUnarchive = (roomId: string) => {
    if (!roomId) return;
    unarchiveRoom(roomId);
  };

  const isRoomArchived = (roomId?: string | null) => {
    if (!roomId) return false;
    return archivedRooms && Array.isArray(archivedRooms) && archivedRooms.some(r => r._id === roomId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };




  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const filteredContacts = (filter === 'archived')
    ? archivedRooms.map((room) => {
        const other = room.users?.find((u: any) => u._id !== userId) || room.users?.[0] || {};
        return {
          id: other._id || room._id,
          profile: other.avatar || null,
          name: other.fullname || other.email || 'Unknown',
          time: room.lastActive || room.createdAt || new Date().toISOString(),
          timeIso: room.lastActive || room.createdAt || new Date().toISOString(),
          message: '',
          online: false,
          img: null,
            unread: !suppressInitialUnread && room.unreadCount > 0,
            unreadCount: suppressInitialUnread ? 0 : (room.unreadCount || 0),
          archived: true,
          roomId: room._id,
          email: other.email || ''
        } as Contact;
      })
    : contacts.filter((c) => {
        if (filter === "unread") return c.unread;
        return true;
      });


  // Get messages for the selected room from socket state
  const currentMessages = messages || [];

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };



  // Generate avatar with first letter fallback
  const generateAvatar = (contact: Contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
    ];
    const colorIndex = contact.name.length % colors.length;
    const bgColor = colors[colorIndex];

    return (
      <div className={`w-full h-full rounded-full ${bgColor} flex items-center justify-center text-white font-semibold text-lg`}>
        {firstLetter}
      </div>
    );
  };

  // Check if image failed to load
  const handleImageError = (e: any, contact: Contact) => {
    e.currentTarget.style.display = 'none';
    const fallbackDiv = e.currentTarget.nextSibling;
    if (fallbackDiv) {
      fallbackDiv.style.display = 'flex';
    }
  };


  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 flex justify-between items-center">
        <div>
          <Link href="/smart-outreach" className="text-gray-800 font-semibold">Smart Outreach</Link> <span className="text-gray-800 font-semibold">/ Messages</span>
        </div>
        
      </div>
      <div className="block md:hidden">
        {!selectedContact ? (
          /* Mobile Contact List */
          <div className="h-[calc(100vh-120px)] w-full border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-3 sm:p-4 bg-white">
              <div className="flex justify-start items-center mb-4">
                <div className="flex gap-2 sm:gap-3 font-medium">
                  {["all", "unread", "archived"].map((tab,index) => (
                    <span
                      key={index}
                      onClick={() => setFilter(tab as "all" | "unread" | "archived")}
                      className={`cursor-pointer px-3 py-1.5 rounded-full capitalize text-xs sm:text-sm ${filter === tab ? "bg-teal-100 text-teal-700" : "text-gray-400"
                        }`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>

              <input
                placeholder="Search contacts..."
                className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
              />

              <div className="space-y-2">
                {filteredContacts.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-10">No contacts found</div>
                ) : (
                  filteredContacts.map((contact,index) => (
                    <div
                      key={`contact-${contact.id}`}
                      className={`flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors ${(selectedContact as any)?.id === (contact as any)?.id ? "bg-teal-50 border border-teal-200" : ""
                        }`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative flex-shrink-0 w-12 h-12">
                          <Image
                            src={`${BaseUrl}/assets/images/${contact.profile}`}
                            className="rounded-full object-cover w-full h-full"
                            alt={contact.name}
                            width={48}
                            height={48}
                            onError={(e: any) => handleImageError(e, contact)}
                          />
                          <div className="absolute inset-0 rounded-full hidden">
                            {generateAvatar(contact)}
                          </div>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{contact.name}</div>
                          <div className="text-gray-500 text-xs sm:text-sm truncate">{contact.message}</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-xs flex-shrink-0 ml-2 flex items-center gap-2">
                        <div>{formatContactDate(contact.timeIso || contact.time)}</div>
                        {(contact.unreadCount || 0) > 0 && (
                          <div className="inline-flex items-center justify-center bg-teal-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            {contact.unreadCount || 0}
                          </div>
                        )}
                        {/* Archive button for quick archiving without selecting (icon for parity with desktop) */}
                        <button
                          onClick={(e) => { e.stopPropagation(); if (contact.roomId) createArchive([contact.roomId]); }}
                          className="ml-2 text-xs text-gray-500 hover:text-teal-600 px-2 py-1 rounded"
                          title="Archive"
                        >
                          <Image src={deleteIcon} alt="Archive" width={18} height={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Chat View */
          <div className="h-[calc(100vh-120px)] flex flex-col border border-gray-200 rounded-lg overflow-hidden">
            {/* Mobile Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  ←
                </button>
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={
                      selectedContact.profile ? `${BaseUrl}/assets/images/${selectedContact.profile}` : user3}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                    width={40}
                    height={40}
                    onError={(e: any) => handleImageError(e, selectedContact)}
                  />
                  <div className="absolute inset-0 rounded-full hidden">
                    {generateAvatar(selectedContact)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedContact.name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {selectedContact.email || `${selectedContact.name.toLowerCase().replace(/\s+/g, "")}@gmail.com`}
                  </div>
                </div>
              </div>

              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Image src={call} alt="Call" width={20} />
                  </button>
                  <button className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" onClick={() => {
                      const rid = selectedContact?.roomId || selectedRoomId;
                      if (rid && isRoomArchived(rid)) {
                        handleUnarchive(rid);
                      } else {
                        handleArchive();
                      }
                    }} title="Archive">
                    <Image src={deleteIcon} alt="Archive" width={20} />
                  </button>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    {/* <BsThreeDotsVertical /> */}
                  <span>⋮</span>
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ul className="py-1 text-sm text-gray-700">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                           const rid = selectedContact?.roomId || selectedRoomId;
                            if (rid && isRoomArchived(rid)) {
                              handleUnarchive(rid);
                            } else {
                              handleArchive();
                            }
                        }}
                      >
                        { (selectedContact?.roomId && isRoomArchived(selectedContact.roomId)) || (selectedRoomId && isRoomArchived(selectedRoomId)) ? 'Unarchive' : 'Archive' }
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Share</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">Block</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex items-center justify-center my-3">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
                  </div>
                  {(msgs as any[]).map((message: any, i: number) => (
                    <div
                      key={`message-${message._id || message.timestamp}`}
                      className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"} mb-3`}
                    >
                      <div className={`flex flex-col ${message.senderId === userId ? "items-end" : "items-start"} max-w-[85%]`}>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          {message.senderId === userId ? (
                            <>
                              <span>You {formatMessageTime(message.timestamp)}</span>
                              <Image src={`${BaseUrl}/assets/images/${message?.msgFrom?.avatar || user}`} alt="Your avatar" width={20} height={20} className="rounded-full" />
                            </>
                          ) : (
                            <>
                              <div className="relative w-5 h-5">
                                <Image
                                  src={selectedContact.profile ? `${BaseUrl}/assets/images/${selectedContact.profile}` : user3}
                                  alt="Sender avatar"
                                  width={20}
                                  height={20}
                                  className="w-full h-full rounded-full object-cover"
                                  onError={(e: any) => handleImageError(e, selectedContact)}
                                />
                                <div className="absolute inset-0 rounded-full hidden">
                                  <div className="w-full h-full rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold text-xs">
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                              </div>
                              <span>{selectedContact.name} {formatMessageTime(message.timestamp)}</span>
                            </>
                          )}
                        </div>
                        <div className={`px-3 py-2 text-sm leading-relaxed ${message.msgFrom._id === userId
                            ? "bg-teal-600 text-white rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-lg"
                            : "bg-gray-100 text-gray-900 rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg"
                          }`}>
                          {message.message}
                          {message.attachments?.length > 0 && (
                            <div className="mt-2">
                              {message.attachments.map((file: any, idx: number) => (
                                <div key={`attachment-${idx}`} className="mt-1">
                                  {file.type?.startsWith('image/') ? (
                                    <Image
                                      src={file.url?.startsWith('http') ? file.url : `${BaseUrl}${file.url?.startsWith('/') ? '' : '/'}${file.url}`}
                                      alt={file.name || 'Attachment'}
                                      width={200}
                                      height={150}
                                      className="rounded-lg max-h-40 object-cover"
                                    />
                                  ) : (
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      {file.name}
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {/* Typing Indicators */}
              {typingUsers.length > 0 && (
                <div className="px-4 py-2 text-sm text-gray-500 italic">
                  {typingUsers.length === 1 
                    ? `${typingUsers[0].name || typingUsers[0].email} is typing...`
                    : `${typingUsers.map(u => u.name || u.email).join(', ')} are typing...`
                  }
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Mobile Message Input */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-end gap-2">
                <textarea
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    handleTypingStart();
                  }}
                  onBlur={handleTypingStop}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 h-12 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={(!messageText.trim() && (!attachments || attachments.length === 0))}
                  className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {/* <FiSend size={16} /> */}
                  <span>Send</span>
                  {/* {isSendingMessage ? "Sending..." : "Send"} */}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Layout (md+) */}
      <div className="hidden md:flex h-[calc(100vh-120px)] w-full text-sm font-sans gap-3">
        {/* Sidebar */}
        <div className="w-80 lg:w-96 border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 bg-white">
            <div className="flex justify-start items-center mb-4">
              <div className="flex gap-3 font-medium">
                {["all", "unread", "archived"].map((tab,index) => (
                  <span
                    key={index}
                    onClick={() => setFilter(tab as "all" | "unread" | "archived")}
                    className={`cursor-pointer px-3 py-1.5 rounded-full capitalize text-sm ${filter === tab ? "bg-teal-100 text-teal-700" : "text-gray-400"
                      }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>
            </div>

            <input
              placeholder="Search contacts..."
              className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {filteredContacts.length === 0 ? (
                <div className="text-center text-gray-400 text-sm mt-10">No contacts found</div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={`filtered-contact-${contact.id}`}
                    className={`flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 transition-colors ${selectedContact?.id === contact.id ? "bg-teal-50 border-l-[4px] border-teal-300" : ""
                      }`}
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0 w-12 h-12">
                        <Image
                          src={`${BaseUrl}/assets/images/${contact.profile}`}
                          className="rounded-full object-cover w-full h-full"
                          alt={contact.name}
                          width={48}
                          height={48}
                          onError={(e: any) => handleImageError(e, contact)}
                        />
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{contact.name}</div>
                        <div className="text-gray-500 text-sm truncate">{contact.message}</div>
                      </div>
                    </div>
                      <div className="text-gray-400 text-xs flex-shrink-0 ml-2 flex items-center gap-2">
                     <div>{formatContactDate(contact.timeIso || contact.time)}</div>
                        {(contact.unreadCount || 0) > 0 && (
                          <div className="inline-flex items-center justify-center bg-teal-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            {contact.unreadCount || 0}
                          </div>
                        )}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col border border-gray-200 rounded-lg overflow-hidden">
          {selectedContact ? (
            <div className="flex flex-col h-full bg-white">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src={selectedContact.profile ? `${BaseUrl}/assets/images/${selectedContact.profile}` : user3}
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                      width={48}
                      height={48}
                      onError={(e: any) => handleImageError(e, selectedContact)}
                    />
                    {/* <div className="absolute inset-0 rounded-full hidden">
                      {generateAvatar(selectedContact)}
                    </div> */}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedContact.name}</div>
                    <div className="text-sm text-gray-500">
                      {selectedContact.email}
                    </div>
                  </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center gap-3 text-gray-500">
                    <button className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors">
                      <Image src={call} alt="Call" width={20} />
                    </button>
                    <button className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors">
                      <Image src={mail} alt="Mail" width={20} />
                    </button>
                    <button className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" onClick={() => {
                      const rid = selectedContact?.roomId || selectedRoomId;
                      if (rid && isRoomArchived(rid)) {
                        handleUnarchive(rid);
                      } else {
                        handleArchive();
                      }
                    }}>
                      <Image src={deleteIcon} alt="Delete" width={20} />
                    </button>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      {/* <BsThreeDotsVertical /> */}
                      <span>⋮</span>
                    </button>
                  </div>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <ul className="py-1 text-sm text-gray-700">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            const rid = selectedContact?.roomId || selectedRoomId;
                            if (rid && isRoomArchived(rid)) {
                              handleUnarchive(rid);
                            } else {
                              handleArchive();
                            }
                          }}
                        >
                          { (selectedContact?.roomId && isRoomArchived(selectedContact.roomId)) || (selectedRoomId && isRoomArchived(selectedRoomId)) ? 'Unarchive' : 'Archive' }
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Share</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">Block</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={`date-${date}`}>
                    <div className="flex items-center justify-center my-4">
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
                    </div>
                    {msgs.map((message: any, i: any) => (
                      <div
                        key={`message-${message._id || message.timestamp}`}
                        className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"} mb-4`}
                      >
                        <div className={`flex flex-col ${message.senderId === userId ? "items-end" : "items-start"} max-w-md`}>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            {message.senderId === userId ? (
                              <>
                                <span>{formatMessageTime(message.timestamp)} You</span>
                                <Image src={`${BaseUrl}/assets/images/${message?.msgFrom?.avatar || user}`} alt="Your avatar" width={24} height={24} className="rounded-full" />
                              </>
                            ) : (
                              <>
                                <div className="relative w-6 h-6">
                                  <Image
                                    src={`${BaseUrl}/assets/images/${selectedContact.profile}`}
                                    alt="Sender avatar"
                                    width={24}
                                    height={24}
                                    className="w-full h-full rounded-full object-cover"
                                    onError={(e: any) => handleImageError(e, selectedContact)}
                                  />
                                  <div className="absolute inset-0 rounded-full hidden">
                                    <div className="w-full h-full rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold text-xs">
                                      {selectedContact.name.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                                <span>{selectedContact.name} {formatMessageTime(message.timestamp)}</span>
                              </>
                            )}
                          </div>
                          <div className={`px-4 py-3 text-sm leading-relaxed ${message.senderId === userId
                              ? "bg-teal-600 text-white rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-lg"
                              : "bg-gray-100 text-gray-900 rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg"
                            }`}>
                            {message.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                {/* Typing Indicators */}
                {typingUsers.length > 0 && (
                  <div className="px-4 py-2 text-sm text-gray-500 italic">
                    {typingUsers.length === 1 
                      ? `${typingUsers[0].name || typingUsers[0].email} is typing...`
                      : `${typingUsers.map(u => u.name || u.email).join(', ')} are typing...`
                    }
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-end gap-3">
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Image src={link} alt="Link" width={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Image src={smile} alt="Emoji" width={20} />
                    </button>
                  </div>
                  <textarea
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      handleTypingStart();
                    }}
                    onBlur={handleTypingStop}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 h-12 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={(!messageText.trim() && (!attachments || attachments.length === 0)) }
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                  >
                    {/* <FiSend size={16} /> */}
                  <span>Send</span>
                    {/* {isSendingMessage ? "Sending..." : "Send"} */}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">Select a contact to start chatting</p>
                <p className="text-sm mt-2">Choose someone from the sidebar to begin your conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* {modalOpen && <ArchiveModal onClose={() => setModalOpen(false)} />} */}
    </>
  );
}

