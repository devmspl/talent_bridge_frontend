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

import { useGetAllUsersQuery } from "@/app/store/api/userApi";
import {
  useGetAllRoomsQuery,
  useGetRoomMessagesQuery,
  useSendMessageMutation,
  type ChatRoom,
  type Message as MessageType
} from "@/app/store/api/chatApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { BaseUrl } from "@/app/store/BaseUrl";

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
  // Read userId directly from cookies as it's the source of truth
  const userId = Cookies.get("tb_userId");
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
  // RTK Query hooks
  const { data: roomsData, isLoading: isLoadingRooms } = useGetAllRoomsQuery();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { data: messagesData, isLoading: isLoadingMessages } = useGetRoomMessagesQuery(
    selectedRoomId || '',
    { skip: !selectedRoomId }
  );
  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
  useEffect(() => {
    if (roomsData?.data) {
      const formattedRooms = roomsData.data
=======
  // Transform API users to contacts format
  const transformUsersToContacts = (users: any[]): Contact[] => {
    if (!users || !Array.isArray(users)) return [];
    console.log("users==>",users);
    return users
      .filter(apiUser => apiUser._id !== userId) // Exclude current user
      .map((apiUser, index) => ({
        id: apiUser._id,
        profile: apiUser?.avatar ? `${BaseUrl}/assets/images/${apiUser?.avatar}` : user1, // Use full URL for profile image
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
>>>>>>> 6dd8142f35f330855707846d4501a5cbf21c3505

      setContacts(prev => {
        const newContacts = [...prev];
        formattedRooms.forEach((room: any) => {
          const existingContact = newContacts.find(c => c.roomId === room.roomId);
          if (!existingContact) {
            newContacts.push({
              id: room.members.find((m: any) => m._id !== userId)?._id || '',
              roomId: room._id,
              name: room.members.find((m: any) => m._id !== userId)?.fullname || 'Unknown User',
              email: room.members.find((m: any) => m._id !== userId)?.email || '',
              profile: room.members.find((m: any) => m._id !== userId)?.avatar || null,
              time: new Date().toISOString(),
              message: '',
              online: false,
              img: null,
              unread: false,
              archived: false
            });
          }
        });
        return newContacts;
      });

      // Set the first room as selected by default if none is selected
      if (formattedRooms.length > 0 && !selectedRoomId) {
        setSelectedRoomId(formattedRooms[0]._id);
      }
    }
  }, [roomsData, userId]);

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
  const groupedMessages = messagesData?.data?.reduce((groups: Record<string, any[]>, message: any) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({
      ...message,
      senderId: message.msgFrom._id,
      senderName: message.msgFrom.fullname || message.msgFrom.email,
      text: message.message,
      timestamp: message.timestamp,
      roomId: message.room,
      attachments: message.attachments || []
    });
    return groups;
  }, {}) || {};


  // Update messages when messages data is loaded
  useEffect(() => {
    if (messagesData?.data && selectedRoomId) {
      const formattedMessages = messagesData.data.map((msg: any) => ({
        _id: msg._id,
        senderId: msg.msgFrom._id,
        senderName: msg.msgFrom.fullname || msg.msgFrom.email,
        text: msg.message,
        roomId: msg.room,
        timestamp: msg.timestamp,
        createdAt: msg.timestamp,
      }));
    }
  }, [messagesData, selectedRoomId, dispatch]);


  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.roomId) {
      setSelectedRoomId(contact.roomId);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedRoomId) return;

    try {
      const payload = {
        msg: messageText,
        attachments: attachments.map(attachment => ({
          url: attachment.url,
          name: attachment.name,
          type: attachment.type
        }))
      };

      await sendMessage({ roomId: selectedRoomId, payload }).unwrap();
      setMessageText('');
      setAttachments([]);
      
      // Scroll to bottom after sending message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
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



  const filteredContacts = contacts.filter((c) => {
    if (filter === "unread") return c.unread;
    if (filter === "archived") return c.archived;
    return true;
  });


  // Get messages for the selected room from the API response
  const currentMessages = messagesData?.data || [];

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

      {/* Mobile Layout (xs to md) */}
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
                  contacts.map((contact,index) => (
                    <div
                      key={`contact-${contact.id}`}
                      className={`flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors ${(selectedContact as any)?.id === (contact as any)?.id ? "bg-teal-50 border border-teal-200" : ""
                        }`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative flex-shrink-0 w-12 h-12">
                          <Image
                            src={contact.profile?.startsWith('http') ? contact.profile : `${BaseUrl}${contact.profile.startsWith('/') ? '' : '/'}${contact.profile}`}
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
                    src={
                      selectedContact.profile || user3}
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
                              <Image src={user} alt="Your avatar" width={20} height={20} className="rounded-full" />
                            </>
                          ) : (
                            <>
                              <div className="relative w-5 h-5">
                                <Image
                                  src={selectedContact.profile?.startsWith('http') ? selectedContact.profile : `${BaseUrl}${selectedContact.profile.startsWith('/') ? '' : '/'}${selectedContact.profile}`}
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
                                  {file.type.startsWith('image/') ? (
                                    <Image
                                      src={file.url.startsWith('http') ? file.url : `${BaseUrl}${file.url.startsWith('/') ? '' : '/'}${file.url}`}
                                      alt={file.name}
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
                  disabled={(!messageText.trim() && (!attachments || attachments.length === 0)) || isSendingMessage}
                  className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <FiSend size={16} />
                  {isSendingMessage ? "Sending..." : "Send"}
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
                    <div className="text-gray-400 text-xs flex-shrink-0 ml-2">
                      {new Date(contact.time).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
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
                      src={`${BaseUrl}/assets/images/${selectedContact.profile}`}
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
                    <button className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" onClick={() => setModalOpen(true)}>
                      <Image src={deleteIcon} alt="Delete" width={20} />
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
                                <Image src={user} alt="Your avatar" width={24} height={24} className="rounded-full" />
                              </>
                            ) : (
                              <>
                                <div className="relative w-6 h-6">
                                  <Image
                                    src={selectedContact.profile || user3}
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
                    disabled={(!messageText.trim() && (!attachments || attachments.length === 0)) || isSendingMessage}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                  >
                    <FiSend size={16} />
                    {isSendingMessage ? "Sending..." : "Send"}
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

