"use client"
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import mail from "@/public/assets/icons/Mail1.svg";
import edit from "@/public/assets/icons/pencil.svg";
import deleteI from "@/public/assets/icons/archive.svg";
import up_down from "@/public/assets/icons/updown.svg";
import Image from "next/image";
import { useState, useEffect } from "react";
import socketService from '@/app/store/api/socket';
import Cookies from 'js-cookie';
import EmailModal from "@/app/component/modals/network/EmailModal";
import Link from "next/link";
import { BaseUrl } from "@/app/store/BaseUrl";

export default function page() {
    const [showEmail, setShowEmail] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
  const [roomsFetched, setRoomsFetched] = useState<boolean>(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10; // show 10 rooms per page

    useEffect(() => {
        // Ensure socket connection and fetch rooms when component mounts
        try {
          const uid = Cookies.get('tb_userId') || '';

          // Connect if not already connected
          if (uid && !socketService.isConnected()) {
            socketService.connect(uid);
          }

          // Fetch rooms immediately (will noop if socket not ready)
          socketService.getMyRooms((roomsList: any[]) => {
            console.debug('[socket] getMyRooms -> roomsList', roomsList);
            setRooms(Array.isArray(roomsList) ? roomsList : []);
            setRoomsFetched(true);
          });

          // Also listen for rooms_list updates
          const onRooms = (roomsList: any[]) => {
            console.debug('[socket] rooms_list event ->', roomsList);
            setRooms(Array.isArray(roomsList) ? roomsList : []);
            setRoomsFetched(true);
          };
          socketService.onRoomsList(onRooms);

          // As a fallback, request rooms again after a short delay in case connect wasn't ready yet
          const retry = setTimeout(() => {
            socketService.getMyRooms((roomsList: any[]) => {
              setRooms(Array.isArray(roomsList) ? roomsList : []);
            });
          }, 1200);

          return () => {
            clearTimeout(retry);
            socketService.removeListener('rooms_list', onRooms);
          };
        } catch (e) {
          console.warn('Failed to fetch rooms', e);
        }
    }, []);

  // removed demo/dummy messages - show a concise loading UI while fetching real rooms

  const userId = Cookies.get('tb_userId') || '';

  const transformRoomToItem = (room: any) => {
    // pick the other participant by comparing ids as strings to be defensive about types
    const other = room.users?.find((u: any) => u && u._id && u._id.toString() !== userId.toString()) || room.users?.[0] || {};

    // Derive the last message from multiple possible server fields
    const lastMsg = room.lastMessage?.message || room.lastMessage?.msg || room.lastMessageText || room.last_message || room.lastMessage || (room.messages && room.messages[room.messages.length - 1]?.message) || '';

    // Derive last interaction time
    const lastInteraction = room.lastActive || room.lastMessage?.createdAt || room.lastMessage?.timestamp || room.last_message_time || '';

    return {
      name: other.fullname || other.email || 'Unknown',
      company: other.company || (other.role ? `${other.role}` : ''),
      avatar: other.avatar || `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
      message: lastMsg,
      status: room.is_archived ? 'Archived' : (room.unreadCount > 0 ? 'Unread' : 'Responded'),
      lastInteraction: lastInteraction ? new Date(lastInteraction).toLocaleString() : '' ,
      roomId: room._id,
    };
  };

  // If we haven't fetched rooms yet, temporarily show the placeholder messages.
  // Once rooms are fetched (even if empty) we show the real data (or empty list) to avoid showing stale dummy data after first load.
  // Filter out rooms that do not have any other participant besides the current user
  const filteredRooms = (rooms && rooms.length > 0)
    ? rooms.filter((room: any) => {
        const usersArr = room.users || [];
        const other = usersArr.find((u: any) => u && u._id && u._id.toString() !== userId.toString());
        return !!other; // include only rooms that have another participant
      })
    : [];

  const transformedRooms = roomsFetched ? (filteredRooms.map(transformRoomToItem)) : [];

  // paginated view when rooms are fetched
  const totalRoomsCount = transformedRooms.length;
  const totalPages = Math.max(1, Math.ceil(totalRoomsCount / PAGE_SIZE));

  // ensure currentPage in valid range when rooms change
  useEffect(() => {
    if (!roomsFetched) return;
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [roomsFetched, totalRoomsCount, totalPages]);

  const paginatedRooms = roomsFetched ? transformedRooms.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) : [];

  const displayItems = roomsFetched ? (paginatedRooms || []) : [];

  const getStatusStyle = (status : any) => {
    if (status === "Awaiting Response")
      return "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] ";
    if (status === "Responded")
      return "bg-[#E6F7F780] text-[#028081] border border-[#B1E5E5]";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <>
    <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-white rounded-lg shadow-md mx-2 sm:mx-0">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-4 sm:mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-[24px] font-semibold text-gray-900">Smart Outreach</h1>
          <p className="text-[14px] sm:text-base text-gray-500 mt-1">Manage your professional conversations</p>
        </div>
        <button className="review text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-teal-700 cursor-pointer transition-colors text-sm sm:text-base font-medium w-full sm:w-auto min-w-[120px]"
        onClick={()=>setShowEmail(true)}>
          <Image src={mail} alt="" width={20} height={20} />
          <span>Compose</span>
        </button>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-hidden">
        {/* Mobile Layout (xs to md) */}
        <div className="block md:hidden space-y-3">
          {!roomsFetched ? (
            // simple loading state while rooms are fetched (no dummy items)
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600 animate-pulse">Loading recent messages...</div>
          ) : (
            // rooms fetched; if none, show empty state message
            displayItems.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600">
                No recent messages found
              </div>
            ) : (
              displayItems.map((msg, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <Link href={"/message"} className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={msg.avatar} alt="avatar" className="w-12 h-12 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-base truncate">{msg.name}</div>
                        <div className="text-sm text-gray-500 truncate">{msg.company}</div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Image src={edit} alt="Edit" width={18} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Image src={deleteI} alt="Delete" width={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{msg.message}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[12px] font-medium px-2 py-1.5 rounded-full ${getStatusStyle(msg.status)}`}>
                      {msg.status}
                    </span>
                    <Link href={"/message"} className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-gray-500 font-medium">{msg.lastInteraction}</span>
                    </Link>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Tablet Layout (md to lg) */}
        <div className="hidden md:block lg:hidden">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 gap-4">
              {!roomsFetched ? (
                // simple loading state while rooms are fetched (no dummy items)
                <div className="bg-white rounded-lg p-6 text-center text-gray-600 animate-pulse">Loading recent messages...</div>
              ) : (
                // rooms fetched
                displayItems.length === 0 ? (
                  <div className="bg-white rounded-lg p-6 text-center text-gray-600">No recent messages found</div>
                ) : (
                  displayItems.map((msg, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <Link href={"/message"} className="flex items-center gap-4 flex-1">
                          <img src={msg.avatar} alt="avatar" className="w-14 h-14 rounded-full" />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-lg">{msg.name}</div>
                            <div className="text-sm text-gray-500">{msg.company}</div>
                          </div>
                        </Link>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-medium px-3 py-1.5 rounded-full  ${getStatusStyle(msg.status)}`}>
                            {msg.status}
                          </span>
                          <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-100 rounded">
                              <Image src={edit} alt="Edit" width={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded">
                              <Image src={deleteI} alt="Delete" width={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-700">{msg.message}</p>
                      </div>
                      <div className="text-sm text-gray-500">Last interaction: {msg.lastInteraction}</div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>

        {/* Desktop Table Layout (lg+) */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            </div>
            <div className="overflow-x-auto">
              {!roomsFetched ? (
                // simple loading state while rooms are fetched (no dummy items)
                <div className="p-6 text-center text-gray-600 animate-pulse">Loading recent messages...</div>
              ) : (
                // rooms fetched
                displayItems.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">No recent messages found</div>
                ) : (
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-6 font-medium text-gray-600 text-sm">Name</th>
                        <th className="py-3 px-6 font-medium text-gray-600 text-sm">Message</th>
                        <th className="py-3 px-6 font-medium text-gray-600 text-sm">Status</th>
                        <th className="py-3 px-6 font-medium text-gray-600 text-sm">Last Interaction</th>
                        <th className="py-3 px-6 font-medium text-gray-600 text-sm text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayItems.map((msg, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <Link href={"/message"} className="flex items-center gap-3">
                              <img src={`${BaseUrl}/assets/images/${msg.avatar}`} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{msg.name}</div>
                                <div className="text-xs text-gray-500">{msg.company}</div>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 px-6"><div className="max-w-xs"><p className="text-gray-700 text-sm leading-relaxed">{msg.message}</p></div></td>
                          <td className="py-4 px-6 w-[169px]"><span className={`text-xs font-medium px-2 py-1 rounded-full   ${getStatusStyle(msg.status)}`}>{msg.status}</span></td>
                          <td className="py-4 px-6 text-gray-600 text-sm"><Link href={"/message"}>{msg.lastInteraction}</Link></td>
                          <td className="py-4 px-6"><div className="flex items-center justify-center gap-2"><button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Image src={edit} alt="Edit" width={16} className="text-gray-600" /></button><button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Image src={deleteI} alt="Delete" width={16} className="text-gray-600" /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          </div>
        </div>
        
        {/* Pagination - only show when we have fetched rooms and total > PAGE_SIZE */}
        {roomsFetched && totalRoomsCount > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {`Showing ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, totalRoomsCount)} of ${totalRoomsCount} results`}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={`pg-${pageNum}`}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded ${pageNum === currentPage ? 'bg-teal-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
     {showEmail && <EmailModal onClose={() => setShowEmail(false)} />}
     </>
  );
}
