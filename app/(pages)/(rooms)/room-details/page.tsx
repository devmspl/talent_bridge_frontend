"use client"
import React, { useMemo, useState } from "react";
import profit from "@/public/assets/media/trending-up.png"
import loss from "@/public/assets/media/trending-down.png"
import Image from "next/image";
import {
  AiOutlineEye,
  AiOutlineClockCircle,
  AiOutlineMessage,
  AiOutlineStar,
} from "react-icons/ai";
import Microsoft from "@/public/assets/media/microsoft.svg"
import google from "@/public/assets/media/Google.svg"
import amazone from "@/public/assets/media/amazon.svg"
import angel from "@/public/assets/media/angel_list.svg"
import you from "@/public/assets/profile/Avatar.png"
import user1 from "@/public/assets/profile/user1.svg"
import user2 from "@/public/assets/profile/user2.svg"
import user3 from "@/public/assets/profile/user3.svg"
import user4 from "@/public/assets/profile/user4.svg"
import user5 from "@/public/assets/profile/user5.svg"
import user6 from "@/public/assets/profile/user6.svg"

import { FcDeleteColumn, FcDeleteRow } from "react-icons/fc";
import { MdOutlineDelete } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import DeleteShowcaseRoom from "@/app/component/modals/room/DeleteShowcaseRoom";
import ShareRoom from "@/app/component/modals/room/ShareRoom";
import ChangeVisibilityModal from "@/app/component/modals/room/ChangeVisibilityModal";
import del from "@/public/assets/icons/delete.svg"
import Public from "@/public/assets/icons/public.svg"
import Link from "next/link";
import up from '@/public/assets/media/upp.svg';
import down from '@/public/assets/media/downn.svg';
import { useSearchParams, useRouter } from "next/navigation";
import { useGetShowcaseRoomByIdQuery, useDeleteShowcaseRoomMutation } from "@/app/store/api/showcaseApi";



const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";
  const { data, isLoading, isError, refetch } = useGetShowcaseRoomByIdQuery(id, { skip: !id });
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteShowcaseRoomMutation();
  const roomName = data?.showcaseRoomName || "Data/BI Analyst";
  const roomSummary = data?.showcaseRoomSummary || "";
  const roomCompetencies: string[] = useMemo(() => {
    if (Array.isArray(data?.coreCompetencies) && data.coreCompetencies.length) return data.coreCompetencies;
    return [
      "Statistical & Predictive Analysis",
      "Stakeholder Communication & Reporting",
      "Data Visualization (Power BI, Tableau)",
      "ETL & Data Processing",
    ];
  }, [data]);
  const metrics = [
    {
      icon: <AiOutlineEye className="w-4 h-4 text-gray-400" />,
      title: "Showcase Views",
      value: "--",
       trend: "--",
      // trend: "+10% vs last week",
    },
    {
      icon: <AiOutlineClockCircle className="w-4 h-4 text-gray-400" />,
      title: "Conversion Rate",
      value: "--%",
      trend: "--",
    },
    {
      icon: <AiOutlineMessage className="w-4 h-4 text-gray-400" />,
      title: "Interactions",
      value: "--",
      trend: "--",
    },
    {
      icon: <AiOutlineStar className="w-4 h-4 text-gray-400" />,
      title: "Endorsement",
      value: "--",
      trend: "--",
    },
  ];
  const qualifications = [
    {
      label: "Power BI Data Analyst",
      icon: Microsoft,
    },
    {
      label: "Azure Data Engineer",
      icon: Microsoft,
    },
    {
      label: "Data modeling & ETL processes",
      icon: google,
    },
    {
      label: "SQL, Python, and R",
      icon: amazone,
    },
    {
      label: "Cloud & Big Data Technologies",
      icon: angel,
    },
  ];
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState(false);

  const handleDelete = async () => {
    try {
      if (!id) return;
      await deleteRoom(id).unwrap();
      setShowModal(false);
      // redirect back to list
      window.location.href = "/showcase-rooms";
    } catch (e) {
      console.error(e);
      setShowModal(false);
      alert("Failed to delete room.");
    }
  };
 

  const handleSave = (visibility: string) => {
    setOpen(false);
  };

  return (
    <>
      <div className="bg-white min-h-screen px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-sm text-gray-800 font-sans">
        
        {/* Breadcrumb and Action Buttons - Responsive */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center text-sm text-gray-600 flex-wrap">
              <Link href="/showcase-rooms" className="hover:text-gray-800 transition">
                Showcase rooms
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-800 font-semibold">{roomName}</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
            <Link href={`/edit-room?id=${id}`}>  <button className="flex-1 sm:flex-none bg-white text-gray-700 px-4 py-2 rounded-lg text-sm border hover:bg-gray-50 cursor-pointer transition font-medium">
                Edit Room
              </button> </Link> 
              <button 
                className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm border border-red-200 hover:bg-red-100 cursor-pointer transition flex items-center justify-center"
                onClick={() => setShowModal(true)}
              >
                <Image src={del} alt="Delete" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Header - Responsive */}
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {roomName}
                </h1>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full inline-flex items-center w-fit">
                  <TbWorld className="mr-1 w-3 h-3" />
                  Public
                </span>
              </div>
              <p className="text-sm text-gray-600">John Doe</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button 
                className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 cursor-pointer transition font-medium"
                onClick={() => setVisibility(true)}
              >
                Change Visibility
              </button>
             <Link href={`/preview?id=${id}`}
                className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 cursor-pointer transition font-medium"
               
              >
                Preview
            </Link>
              <button 
                className="w-full sm:w-auto review text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-600 cursor-pointer transition font-medium"
                onClick={() => setOpen(true)}
              >
                Share room
              </button>
            </div>
          </div>
        </div>

        {/* Metrics - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6">
          {metrics.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs sm:text-sm text-gray-500 font-medium">{item.title}</span>
                <div className="text-gray-400">
                  {item.icon}
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {item.value}
              </div>
              <div
                className={`flex items-center text-xs ${
                  item.trend.includes("-") ? "text-red-500" : "text-green-600"
                }`}
              >
                <Image
                  src={item.trend.includes("-") ? loss : profit}
                  alt="Trend icon"
                  className="w-3 h-3 mr-1"
                />
                {item.trend.replace("+", "")}
              </div>
            </div>
          ))}
        </div>

        {/* Main content - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Summary */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Summary</h2>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100 w-fit">
                  AI Generated
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {roomSummary || ""}
              </p>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Qualifications</h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {qualifications.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-50 px-3 py-2 rounded-full text-xs sm:text-sm text-gray-700 border border-gray-200 flex items-center gap-2 hover:bg-gray-100 transition"
                  >
                    <Image src={item.icon} alt="" width={16} height={16} />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Competencies */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Core Competencies</h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {roomCompetencies.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="bg-gray-50 px-3 py-2 rounded-full text-xs sm:text-sm text-gray-700 border border-gray-200 hover:bg-gray-100 transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Recent activity</h2>
            <p className="text-xs text-gray-500 mb-4">Based on room interaction</p>
            <div className="space-y-4 sm:space-y-6">
              {[
                { image: you, name: "You", action: "updated Pets World case study", time: "11:30 AM" },
                { image: user1, name: "Breanna Butler", action: "viewed your profile", time: "2:00 PM" },
                { image: user2, name: "Lana Ray", action: "viewed your profile", time: "12:45 PM" },
                { image: user3, name: "Deanna T.", action: "sent a message", time: "12:45 PM" },
                { image: you, name: "Anthony S.", action: "viewed your profile", time: "11:30 AM" },
                { image: user4, name: "Michele C.", action: "sent a message", time: "9:30 AM" },
                { image: user5, name: "Scott M.", action: "viewed your profile", time: "5 days ago" },
                { image: user6, name: "Michel L.", action: "viewed your profile", time: "5 days ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Image 
                    src={activity.image} 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0" 
                    alt="profile" 
                    onClick={() => router.push(`/message`)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 leading-tight text-sm">{activity.name}</div>
                    <div className="text-gray-500 text-xs truncate">{activity.action}</div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap pt-1 flex-shrink-0">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteShowcaseRoom
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDelete={handleDelete}
      />
      <ShareRoom
        isOpen={open}
        onClose={() => setOpen(false)}
        link="https://tbridge.com/{name-of-showcase-room}"
      />
      <ChangeVisibilityModal
        isOpen={visibility}
        onClose={() => setVisibility(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default Page;
