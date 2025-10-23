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
import call from "@/public/assets/icons/call12.svg";
import mail from "@/public/assets/icons/mail12.svg";
import deleteIcon from "@/public/assets/icons/un-archive.svg";
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
import Link from "next/link";

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
      {/* Breadcrumb */}
      <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 flex justify-between items-center">
        <div>
          <Link href="/smart-outreach" className="text-gray-800 font-semibold">Smart Outreach</Link> <span className="text-gray-800 font-semibold">/ Messages</span>
        </div>
      </div>

      {/* Mobile Layout (xs to md) */}
      <div className="block md:hidden">
        {!selectedContact ? (
          /* Mobile Contact List */
          <div className="h-[calc(100vh-120px)] w-full border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-3 sm:p-4 bg-white">
              <div className="flex justify-start items-center mb-4">
                <div className="flex gap-2 sm:gap-3 font-medium">
                  {["all", "unread", "archived"].map((tab) => (
                    <span
                      key={tab}
                      onClick={() => setFilter(tab as "all" | "unread" | "archived")}
                      className={`cursor-pointer px-3 py-1.5 rounded-full capitalize text-xs sm:text-sm ${
                        filter === tab ? "bg-teal-100 text-teal-700" : "text-gray-400"
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
                  contacts.map((contact) => (
                    <div
                      key={(contact as any)?.id}
                      className={`flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                        (selectedContact as any)?.id === (contact as any)?.id ? "bg-teal-50 border border-teal-200" : ""
                      }`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative flex-shrink-0 w-12 h-12">
                          <Image 
                            src={typeof contact.profile === 'string' ? contact.profile : contact.profile.src || contact.profile} 
                            className="rounded-full object-cover w-full h-full" 
                            alt={contact.name} 
                            width={48} 
                            height={48} 
                            onError={(e : any) => handleImageError(e, contact)}
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
                      <div className="text-gray-400 text-xs flex-shrink-0 ml-2">{contact.time}</div>
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
                    src={typeof selectedContact.profile === 'string' ? selectedContact.profile : selectedContact.profile.src || selectedContact.profile} 
                    alt="avatar" 
                    className="w-full h-full rounded-full object-cover" 
                    width={40} 
                    height={40} 
                    onError={(e : any) => handleImageError(e, selectedContact)}
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
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-2 text-gray-500 hover:text-gray-700"
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

            {/* Mobile Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex items-center justify-center my-3">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
                  </div>
                  {msgs.map((message : any , i : any) => (
                    <div 
                      key={message._id || i} 
                      className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"} mb-3`}
                    >
                      <div className={`flex flex-col ${message.senderId === userId ? "items-end" : "items-start"} max-w-[85%]`}>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          {message.senderId === userId ? (
                            <>
                              <span>You {formatMessageTime(message.timestamp)}</span>
                              <Image src={user} alt="Your avatar" width={20} height={20} className="rounded-full" />
                            </>
                            ) : (
                              <>
                                <div className="relative w-5 h-5">
                                  <Image 
                                    src={typeof selectedContact.profile === 'string' ? selectedContact.profile : selectedContact.profile.src || selectedContact.profile} 
                                    alt="Sender avatar" 
                                    width={20} 
                                    height={20} 
                                    className="w-full h-full rounded-full object-cover"
                                    onError={(e:any) => handleImageError(e, selectedContact)}
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
                        <div className={`px-3 py-2 text-sm leading-relaxed ${
                          message.senderId === userId 
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
              <div ref={messagesEndRef} />
            </div>

            {/* Mobile Message Input */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-end gap-2">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 h-12 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                  rows={1}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <FiSend size={16} />
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
                {["all", "unread", "archived"].map((tab) => (
                  <span
                    key={tab}
                    onClick={() => setFilter(tab as "all" | "unread" | "archived")}
                    className={`cursor-pointer px-3 py-1.5 rounded-full capitalize text-sm ${
                      filter === tab ? "bg-teal-100 text-teal-700" : "text-gray-400"
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
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? "bg-teal-50 border-l-[4px] border-teal-300" : ""
                    }`}
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0 w-12 h-12">
                        <Image 
                          src={typeof contact.profile === 'string' ? contact.profile : contact.profile.src || contact.profile} 
                          className="rounded-full object-cover w-full h-full" 
                          alt={contact.name} 
                          width={48} 
                          height={48} 
                          onError={(e : any) => handleImageError(e, contact)}
                        />
                        <div className="absolute inset-0 rounded-full hidden">
                          {generateAvatar(contact)}
                        </div>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{contact.name}</div>
                        <div className="text-gray-500 text-sm truncate">{contact.message}</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs flex-shrink-0 ml-2">{contact.time}</div>
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
                      src={typeof selectedContact.profile === 'string' ? selectedContact.profile : selectedContact.profile.src || selectedContact.profile} 
                      alt="avatar" 
                      className="w-full h-full rounded-full object-cover" 
                      width={48} 
                      height={48} 
                      onError={(e : any) => handleImageError(e, selectedContact)}
                    />
                    <div className="absolute inset-0 rounded-full hidden">
                      {generateAvatar(selectedContact)}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedContact.name}</div>
                    <div className="text-sm text-gray-500">
                      {selectedContact.email || `${selectedContact.name.toLowerCase().replace(/\s+/g, "")}@gmail.com`}
                    </div>
                  </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center gap-3 text-gray-500">
                    <button className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors">
                      <Image  src={call} alt="Call" width={20} />
                    </button>
                    <button className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors">
                      <Image src={mail} alt="Mail" width={20} />
                    </button>
                    <button className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setModalOpen(true)}>
                      <Image src={deleteIcon} alt="Delete" width={20 } />
                    </button>
                    {/* <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <BsThreeDotsVertical />
                    </button> */}
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
                        <div className={`flex flex-col ${message.senderId === userId ? "items-end" : "items-start"} max-w-md`}>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            {message.senderId === userId ? (
                              <>
                                <span>{formatMessageTime(message.timestamp)} You</span>
                                <Image src={user} alt="Your avatar" width={24} height={24} className="rounded-full" />
                              </>
                            ) : (
                              <>
                                <div className="relative w-6 h-6">
                                  <Image 
                                    src={typeof selectedContact.profile === 'string' ? selectedContact.profile : selectedContact.profile.src || selectedContact.profile} 
                                    alt="Sender avatar" 
                                    width={24} 
                                    height={24} 
                                    className="w-full h-full rounded-full object-cover"
                                    onError={(e:any) => handleImageError(e, selectedContact)}
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
                          <div className={`px-4 py-3 text-sm leading-relaxed ${
                            message.senderId === userId 
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
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 h-12 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                    rows={1}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
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
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">Select a contact to start chatting</p>
                <p className="text-sm mt-2">Choose someone from the sidebar to begin your conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && <ArchiveModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

