"use client";

import React, { useState } from "react";
import { FiEdit, FiShare2, FiEye, FiHeart, FiPlus } from "react-icons/fi";
import Sidebar from "../../../component/sidebar/Sidebar";
import room_1 from "@/public/assets/room-1.png"
import room_2 from "@/public/assets/room-2.png"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const rooms = [
  {
    title: "Data/BI Analyst",
    description: "Showcasing my latest projects in data visualization and analysis",
    tags: ["Python", "Tableau", "SQL", "+5 skills"],
    views: "2.5K",
    likes: "300",
    image: room_1,
    status: "active"
  },
  {
    title: "Professional Pianist",
    description: "Collection of my recent design projects and case studies",
    tags: ["Scaling", "Sight reading", "Accompaniments", "+5 skills"],
    views: "2.5K",
    likes: "300",
    image: room_2,
    status: "active"
  },
];

const draftRooms = [
  {
    title: "UX Designer Portfolio",
    description: "Work in progress - showcasing user experience design projects",
    tags: ["Figma", "Prototyping", "User Research", "+3 skills"],
    views: "0",
    likes: "0",
    image: room_1,
    status: "draft"
  },
];

const archivedRooms = [
  {
    title: "Old Marketing Campaign",
    description: "Previous marketing projects and campaigns",
    tags: ["Marketing", "Analytics", "SEO", "+2 skills"],
    views: "1.2K",
    likes: "150",
    image: room_2,
    status: "archived"
  },
];

const ShowcasePage = () => {
  const routes = useRouter();
  const [activeTab, setActiveTab] = useState("active");

  const getCurrentRooms = () => {
    switch (activeTab) {
      case "active":
        return rooms;
      case "draft":
        return draftRooms;
      case "archived":
        return archivedRooms;
      default:
        return rooms;
    }
  };

  const currentRooms = getCurrentRooms();

  return (
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
                onClick={()=>routes.push("/new-room")}
              >
                <FiPlus className="text-base sm:text-lg flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">New Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-[#F9FAFB] w-[320px] rounded-[20px]">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentRooms.map((room, index) => (
  <Link href={`/room-details`} key={index}>
    <div className="bg-white rounded-2xl shadow overflow-hidden cursor-pointer hover:shadow-lg transition">
      <div className="h-48 bg-gray-200">
        <Image
          src={room.image}
          alt={room.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{room.title}</h2>
        <p className="text-sm text-gray-600">{room.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {room.tags.map((tag, i) => (
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
              {room.views}
            </div>
            <div className="flex items-center gap-1">
              <FiHeart />
              {room.likes}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-gray-700">
              <FiEdit />
              Edit
            </button>
            <button className="flex items-center gap-1 hover:text-gray-700">
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
  );
};

export default ShowcasePage;
