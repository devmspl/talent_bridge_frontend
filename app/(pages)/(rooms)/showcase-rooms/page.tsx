"use client";

import React, { useMemo, useState } from "react";
import { FiEdit, FiShare2, FiEye, FiHeart, FiPlus } from "react-icons/fi";
import Sidebar from "../../../component/sidebar/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetShowcaseRoomsQuery, useGetDraftsByUserQuery } from "@/app/store/api/showcaseApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { clearRoomData } from "@/app/utils/roomStorage";
import { BaseUrl } from "@/app/store/BaseUrl";
import Cookies from 'js-cookie';
import ShareRoom from "@/app/component/modals/room/ShareRoom";

const ShowcasePage = () => {
  const routes = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("active");
  const pageFromUrl = Number(searchParams.get("page") || 1);
  const limitFromUrl = Number(searchParams.get("limit") || 10);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string>("");

  const userId = Cookies.get('tb_userId') || '';
  
  const { data, isLoading, isError, refetch } = useGetShowcaseRoomsQuery({
    userId: userId || '',
    page: pageFromUrl, 
    limit: limitFromUrl,
  });
  const { data: draftsData, isLoading: isDraftsLoading, isError: isDraftsError, refetch: refetchDrafts } = useGetDraftsByUserQuery(userId as string, { skip: !userId });

  const filteredRooms = useMemo(() => {
    if (activeTab === "draft") {
      return Array.isArray(draftsData) ? draftsData : [];
    }
    const list = Array.isArray(data) ? data : [];
    if (activeTab === "archived") return list.filter((r: any) => r.isArchived);
    return list.filter((r: any) => r.isActive || (!r.isDraft && !r.isArchived));
  }, [data, draftsData, activeTab]);

  const currentRooms = filteredRooms;

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", String(newPage));
    params.set("limit", String(limitFromUrl));
    routes.push(`/showcase-rooms?${params.toString()}`);
  };

  return (
    <>
    <div className="min-h-screen bg-white ">
    <div className="">
      <div className="bg-white rounded-xl shadow mb-5 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start lg:items-center">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-6 sm:leading-7">
                Showcase Rooms
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-4 sm:leading-5">
                Manage your story and share your skills in the way you wish
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <button 
                className="w-full sm:w-auto bg-teal-500 text-white px-3 sm:px-4 py-2 h-[36px] sm:h-[40px] rounded-md flex items-center justify-center gap-2 hover:bg-teal-600 cursor-pointer transition-colors duration-200 "
                onClick={() => {
                 
                  clearRoomData();
                  routes.push("/new-room");
                }}
              >
                <FiPlus className="text-base sm:text-lg flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">New Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex  mb-6 bg-[#F9FAFB] w-[310px] p-[4px] rounded-[20px]">
        <button 
          onClick={() => setActiveTab("active")}
          className={`px-4 py-1 rounded-full font-medium transition-colors cursor-pointer ${
            activeTab === "active" 
              ? "bg-[#FFFFFF] shadow-[#121A2B1A] text-gray-800" 
              : "text-gray-600 hover:text-black"
          }`}
        >
          Active Rooms
        </button>
        <button 
          onClick={() => setActiveTab("draft")}
          className={`px-4 py-1 rounded-full font-medium transition-colors cursor-pointer ${
            activeTab === "draft" 
              ? "bg-[#FFFFFF] shadow-[#121A2B1A] text-gray-800" 
              : "text-gray-600 hover:text-black"
          }`}
        >
          Drafts
        </button>
        <button 
          onClick={() => setActiveTab("archived")}
          className={`px-4 py-1 rounded-full font-medium transition-colors cursor-pointer ${
            activeTab === "archived" 
              ? "bg-[#FFFFFF] shadow-[#121A2B1A] text-gray-800" 
              : "text-gray-600 hover:text-black"
          }`}
        >
          Archived
        </button>
      </div>

      {(activeTab !== 'draft' && isLoading) && (
        <div className="text-sm text-gray-500">Loading rooms...</div>
      )}
      {(activeTab !== 'draft' && isError) && (
        <div className="text-sm text-red-600">Failed to load rooms. <button className="underline" onClick={()=>refetch()}>Retry</button></div>
      )}

      {activeTab === 'draft' && !userId && (
        <div className="col-span-2 text-center py-8">
          <p className="text-gray-500">You don't have any drafts yet.</p>
        </div>
      )}
      {activeTab === 'draft' && userId && isDraftsLoading && (
        <div className="col-span-2 text-center py-8">
          <p className="text-gray-500">Loading drafts...</p>
        </div>
      )}
      {activeTab === 'draft' && userId && isDraftsError && (
        <div className="col-span-2 text-center py-8">
          <p className="text-red-600">Failed to load drafts. <button className="underline" onClick={()=>refetchDrafts()}>Retry</button></p>
        </div>
      )}
      {activeTab === 'draft' && userId && !isDraftsLoading && !isDraftsError && currentRooms.length === 0 && (
        <div className="col-span-2 text-center py-8">
          <p className="text-gray-500">No draft rooms yet</p>
        </div>
      )}
      
      {activeTab === 'active' && !isLoading && !isError && currentRooms.length === 0 && (
        <div className="col-span-2 text-center py-8">
          <p className="text-gray-500">No active rooms yet</p>
        </div>
      )}
      
      {activeTab === 'archived' && !isLoading && !isError && currentRooms.length === 0 && (
        <div className="col-span-2 text-center py-8">
          <p className="text-gray-500">No archived rooms yet</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentRooms?.map((room: any, index: number) => 
        (
          
  <Link href={`/room-details?id=${room._id ?? ''}`} key={room._id ?? index}>
    <div className="bg-white rounded-2xl shadow overflow-hidden cursor-pointer hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 relative">
        {room.coverImage ? (
          (() => {
            const src: string = room.coverImage;
            const isDataOrBlob = src.startsWith("data:") || src.startsWith("blob:");
            const isHttp = /^https?:\/\//.test(src);
            
            // Get the full image URL
            let imageSrc = src;
            if (!isDataOrBlob && !isHttp && src) {
              // If it's just a filename, prefix with base URL
              imageSrc = `${BaseUrl}/assets/images/${src}`;
            }
            
            if (isDataOrBlob) {
              return (
                <img
                  src={src}
                  alt={room.showcaseRoomName || "Cover image"}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.style.backgroundColor = '#F3F4F6';
                    }
                  }}
                />
              );
            }
            
            if (isHttp || imageSrc !== src) {
              return (
                <Image
                  src={imageSrc}
                  alt={room.showcaseRoomName || "Cover image"}
                  className="object-cover w-full h-full"
                  width={800}
                  height={300}
                  unoptimized
                  onError={() => {
                    // Error handled by Next.js Image fallback
                  }}
                />
              );
            }
            
            return <div className="w-full h-full bg-gray-100" />;
          })()
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{room.showcaseRoomName}</h2>
        <p className="text-sm text-gray-600">{room.showcaseRoomSummary}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {(room.coreCompetencies || []).slice(0,4).map((tag: string, i: number) => (
            <span
              key={i}
              className="bg-teal-50 text-teal-700 border border-[#99F6E4] px-3 py-1 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 text-gray-500 text-sm border-t border-gray-200 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FiEye />
              {/* Views not provided by API */}
              --
            </div>
            <div className="flex items-center gap-1">
              <FiHeart /> 
              {/* Likes not provided by API */}
              --
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1 hover:text-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (room._id) routes.push(`/edit-room?id=${room._id}`);
              }}
            >
              <FiEdit />
              Edit
            </button>
            <button 
              className="flex items-center gap-1 hover:text-gray-700 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (room._id) {
                  setSelectedRoomId(room._id);
                  setSelectedRoomName(room.showcaseRoomName || "Showcase Room");
                  setIsShareModalOpen(true);
                }
              }}
            >
              <FiShare2 />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  </Link>
))}

      </div>
    </div>
    </div>

    {/* Share Room Modal */}
    <ShareRoom
      isOpen={isShareModalOpen}
      onClose={() => {
        setIsShareModalOpen(false);
        setSelectedRoomId(null);
        setSelectedRoomName("");
      }}
      roomId={selectedRoomId || undefined}
      roomName={selectedRoomName}
    />
    </>
  );
};

export default ShowcasePage;

