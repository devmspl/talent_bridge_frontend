"use client";

import React from "react";
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
  },
  {
    title: "Professional Pianist",
    description: "Collection of my recent design projects and case studies",
    tags: ["Scaling", "Sight reading", "Accompaniments", "+5 skills"],
    views: "2.5K",
    likes: "300",
    image: room_2,
  },
];

const ShowcasePage = () => {
  const routes =useRouter()
  return (
    <div className="min-h-screen bg-gray-50 ">
    <div className="p-6">
      <div className="bg-white p-6 rounded-xl shadow mb-5 flex justify-between ">
        <div>
        <h2 className="text-xl font-semibold text-gray-900">Showcase Rooms</h2>
        <p className="text-sm text-gray-600">Manage your story and share your skills in the way you wish</p>
        </div>
         <button className="bg-teal-500 text-white px-4 py-2 h-[40px] rounded-md flex items-center gap-2 hover:bg-teal-600 cursor-pointer"
        onClick={()=>routes.push("/new-room")}>
          <FiPlus className="text-lg" />
          New Room
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-full font-medium">Active Rooms</button>
        <button className="text-gray-600 px-4 py-1 rounded-full font-medium hover:text-black">Drafts</button>
        <button className="text-gray-600 px-4 py-1 rounded-full font-medium hover:text-black">Archived</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room, index) => (
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
              className="bg-teal-50 text-teal-700 px-3 py-1 text-xs rounded-full"
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
