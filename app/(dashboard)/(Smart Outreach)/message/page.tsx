"use client";
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
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
import call from "@/public/assets/media/Button with icon only.png";
import mail from "@/public/assets/media/Button with icon only (1).png";
import deleteIcon from "@/public/assets/media/Button with icon only (2).png";
import link from "@/public/assets/icons/link.png";
import smile from "@/public/assets/icons/smile.png";
import ArchiveModal from "@/app/component/modals/message/ArchiveModal";
import { useAppDispatch, useAppSelector } from "@/app/store/reduxHook";
import { 
  addMessage, 
  setMessages, 
  setRooms, 
  setCurrentRoom, 
  type Message, 
  type Room 
} from "@/app/store/slices/socketSlice";
import { useGetAllUsersQuery } from "@/app/store/api/userApi";

type Contact = {
  id: string;
  profile: any;
  name: string;
  time: string;
  message: string;
  online: boolean;
  img: any;
  unread: boolean;
  archived: boolean;
  roomId?: string;
  email?: string;
};

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const { socket, messages, rooms, currentRoomId } = useAppSelector(state => state.socket);
  const { userId } = useAppSelector(state => state.user);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch users from API
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetAllUsersQuery({
    page_no: 1,
    page_size: 50
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Transform API users to contacts format
  const transformUsersToContacts = (users: any[]): Contact[] => {
    if (!users || !Array.isArray(users)) return [];
    console.log("users==>",users);
    return users
      .filter(apiUser => apiUser._id !== userId) // Exclude current user
      .map((apiUser, index) => ({
        id: apiUser._id,
        profile: apiUser?.avatar ? `https://backend.webridgetalent.com/assets/images/${apiUser?.avatar}` : user1, // Use full URL for profile image
        name: apiUser.fullname || 'Unknown User',
        time: new Date(apiUser.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: "Available for chat",
        online: Math.random() > 0.5, // Random online status for demo
        img: user,
        unread: Math.random() > 0.7, // Random unread status
        archived: false,
        email: apiUser.email,
      }));
  };

  const handleCreateRoom = async (user1: string, user2: string, members: string[]) => {
    if (!socket) return;

    socket.emit('set-room', {
      name1: `${user1}-${user2}`,
      name2: `${user2}-${user1}`,
      members: members
    }, (response: any) => {
      console.log("Room created:", response);
      if (response.roomId) {
        setContacts(prev => prev.map(contact => 
          contact.id === user2 ? { ...contact, roomId: response.roomId } : contact
        ));
      }
    });
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`https://backend.webridgetalent.com/chat/getAllRooms`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();
      if (res.isSuccess && res.data) {
        const formattedRooms: Room[] = res.data.map((room: any) => ({
          _id: room._id,
          roomId: room._id,
          members: room.members,
        }));

        dispatch(setRooms(formattedRooms));
        
        setContacts(prev => prev.map(contact => {
          const room = formattedRooms.find(r => 
            r.members.includes(contact.id) && r.members.includes(userId!)
          );
          return room ? { ...contact, roomId: room._id } : contact;
        }));
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const response = await fetch(`https://backend.webridgetalent.com/chat/getMessages/${roomId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();
      if (res.isSuccess && res.data) {
        const formattedMessages: Message[] = res.data.map((msg: any) => ({
          _id: msg._id,
          senderId: msg.senderId,
          senderName: msg.senderName,
          text: msg.text,
          roomId: msg.roomId,
          timestamp: msg.createdAt,
          createdAt: msg.createdAt,
        }));

        dispatch(setMessages({ roomId, messages: formattedMessages }));
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // const handleContactSelect = (contact: Contact) => {
  //   setSelectedContact(contact);
  //   if (contact.roomId) {
  //     dispatch(setCurrentRoom(contact.roomId));
  //     fetchMessages(contact.roomId);
  //   }
  // };

  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
  
    if (!socket || !userId) return;
  
    if (contact.roomId) {
      // Room already exists
      dispatch(setCurrentRoom(contact.roomId));
  
      // **Join the room explicitly**
      socket.emit("join-room", contact.roomId);
  
      // Fetch chat history
      await fetchMessages(contact.roomId);
  
    } else {
      // Room create karna hoga
      socket.emit(
        "set-room",
        {
          name1: `${userId}-${contact.id}`,
          name2: `${contact.id}-${userId}`,
          members: [userId, contact.id],
        },
        async (response: any) => {
          if (response.roomId) {
            dispatch(setCurrentRoom(response.roomId));
            console.log("response.roomId",response.roomId);
            // Update contacts
            setContacts((prev) =>
              prev.map((c) =>
                c.id === contact.id ? { ...c, roomId: response.roomId } : c
              )
            );
  
            // **Join the new room**
            socket.emit("join-room", response.roomId);
  
            // Fetch chat history
            await fetchMessages(response.roomId);
          }
        }
      );
    }
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !socket || !currentRoomId || !userId) return;
  
    const messageData = {
      roomId: currentRoomId,
      senderId: userId,
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
    };
  
    socket.emit("chatMsg", messageData);
  
    dispatch(
      addMessage({
        roomId: currentRoomId,
        message: {
          ...messageData,
          _id: Date.now().toString(),
        },
      })
    );
  
    setMessageText("");
  };
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Update contacts when users data is available
  useEffect(() => {
    if (usersData && Array.isArray(usersData)) {
      const transformedContacts = transformUsersToContacts(usersData);
      console.log("transformedContacts",transformedContacts);
      setContacts(transformedContacts);
      
      // Create rooms for each contact
      if (socket && userId) {
        transformedContacts.forEach(contact => {
          handleCreateRoom(userId, contact.id, [userId, contact.id]);
        });
      }
    }
  }, [usersData, socket, userId]);

  useEffect(() => {
    if (socket && userId) {
      fetchRooms();
    }
  }, [socket, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentRoomId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!socket) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p>Connecting to chat server...</p>
        </div>
      </div>
    );
  }

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <p>Error loading users. Please try again.</p>
        </div>
      </div>
    );
  }

  const filteredContacts = contacts.filter((c) => {
    if (filter === "unread") return c.unread;
    if (filter === "archived") return c.archived;
    return true;
  });
console.log("filteredContacts",filteredContacts);


  const currentMessages = currentRoomId ? messages[currentRoomId] || [] : [];

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupedMessages = currentMessages.reduce((groups: Record<string, Message[]>, message : any) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  console.log("contacts",contacts);
  // console.log(" contact.profile",contacts[0].profile);
  

  return (
    <>
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
          Smart Outreach <span className="text-gray-800 font-semibold">/ Messages</span>
        </div>
      </div>

      <div className="h-screen w-full flex text-sm font-sans gap-2">
        {/* Sidebar */}
        <div className="w-1/3 max-w-sm border border-gray-200 p-4 overflow-y-auto rounded">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-5 font-medium p-2">
              {["all", "unread", "archived"].map((tab) => (
                <span
                  key={tab}
                  onClick={() => setFilter(tab as "all" | "unread" | "archived")}
                  className={`cursor-pointer px-2 py-1 rounded-2xl capitalize ${
                    filter === tab ? "bg-gray-200 text-black" : "text-gray-400"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>
          
          <input 
            placeholder="Search" 
            className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50" 
          />
          
          <div className="space-y-4">
            {filteredContacts.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-10">No contacts found</div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image 
                        src={typeof contact.profile === 'string' ? contact.profile : contact.profile.src || contact.profile} 
                        className="rounded-full object-cover" 
                        alt={contact.name} 
                        width={40} 
                        height={40} 
                        onError={(e : any) => {
                          e.currentTarget.src = user1.src || user1;
                        }}
                        style={{ objectFit: 'cover', width: '40px', height: '40px' }}
                      />
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-white border" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{contact.name}</div>
                      <div className="text-gray-500 text-xs truncate w-40">{contact.message}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">{contact.time}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col border border-gray-200 rounded">
          {selectedContact ? (
            <div className="flex flex-col h-full bg-white">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Image 
                    src={typeof selectedContact.profile === 'string' ? selectedContact.profile : selectedContact.profile.src || selectedContact.profile} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-full object-cover" 
                    width={40} 
                    height={40} 
                    onError={(e : any) => {
                      e.currentTarget.src = user1.src || user1;
                    }}
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{selectedContact.name}</div>
                    <div className="text-sm text-gray-500">
                      {selectedContact.email || `${selectedContact.name.toLowerCase().replace(/\s+/g, "")}@gmail.com`}
                    </div>
                  </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center gap-4 text-gray-500">
                    <Image src={call} alt="Call" width={40} />
                    <Image src={mail} alt="Mail" width={40} />
                    <Image src={deleteIcon} alt="Delete" width={40} />
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="focus:outline-none border border-gray-200 h-[40px] w-[40px] flex justify-center items-center rounded"
                    >
                      <BsThreeDotsVertical />
                    </button>
                  </div>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <ul className="py-1 text-sm text-gray-700">
                        <li 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                          onClick={() => setModalOpen(true)}
                        >
                          Archive
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
                  <div key={date}>
                    <div className="flex items-center justify-center my-4">
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
                    </div>
                    {msgs.map((message : any , i : any) => (
                      <div 
                        key={message._id || i} 
                        className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"} mb-4`}
                      >
                        <div className={`flex flex-col ${message.senderId === userId ? "items-end" : "items-start"} max-w-sm`}>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            {message.senderId === userId ? (
                              <>
                                <span>{formatMessageTime(message.timestamp)} You</span>
                                <Image src={user} alt="Your avatar" width={24} height={24} className="rounded-full" />
                              </>
                            ) : (
                              <>
                                <Image 
                                  src={typeof selectedContact.profile === 'string' ? selectedContact.profile : selectedContact.profile.src || selectedContact.profile} 
                                  alt="Sender avatar" 
                                  width={24} 
                                  height={24} 
                                  className="rounded-full object-cover"
                                  onError={(e:any) => {
                                    e.currentTarget.src = user1.src || user1;
                                  }}
                                />
                                <span>{selectedContact.name} {formatMessageTime(message.timestamp)}</span>
                              </>
                            )}
                          </div>
                          <div className={`px-4 py-2 text-sm leading-snug ${
                            message.senderId === userId 
                              ? "bg-teal-600 text-white rounded-tl-[12px] rounded-tr-none rounded-br-[12px] rounded-bl-[12px]" 
                              : "bg-gray-100 text-gray-900 rounded-tl-none rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px]"
                          }`}>
                            {message.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type something..."
                    className="w-full h-[80px] px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-sm resize-none"
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <button className="text-gray-500">
                      <Image src={link} alt="Link" width={20} />
                    </button>
                    <button className="text-gray-500">
                      <Image src={smile} alt="Emoji" width={20} />
                    </button>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="text-white review px-4 py-2 rounded-full hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                  >
                    <FiSend size={16} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p>Select a contact to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && <ArchiveModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

