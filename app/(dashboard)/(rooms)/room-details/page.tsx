"use client"
import React, { useState } from "react";
import profit from "@/public/assets/media/trending-up.png"
import loss from "@/public/assets/media/trending-down.png"
import Image from "next/image";
import {
  AiOutlineEye,
  AiOutlineClockCircle,
  AiOutlineMessage,
  AiOutlineStar,
} from "react-icons/ai";
import Microsoft from "@/public/assets/media/microsoft.png"
import google from "@/public/assets/media/google.png"
import amazone from "@/public/assets/media/amazon.png"
import angel from "@/public/assets/media/angel_list.png"
import you from "@/public/assets/profile/Avatar.png"
import user1 from "@/public/assets/profile/Avatar (1).png"
import user2 from "@/public/assets/profile/Avatar (7).png"
import user3 from "@/public/assets/profile/Avatar (2).png"
import user4 from "@/public/assets/profile/Avatar (4).png"
import user5 from "@/public/assets/profile/Avatar (5).png"
import user6 from "@/public/assets/profile/Avatar (6).png"
import { FcDeleteColumn, FcDeleteRow } from "react-icons/fc";
import { MdOutlineDelete } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import DeleteShowcaseRoom from "@/app/component/modals/room/DeleteShowcaseRoom";
import ShareRoom from "@/app/component/modals/room/ShareRoom";
import ChangeVisibilityModal from "@/app/component/modals/room/ChangeVisibilityModal";


const Page = () => {
  const metrics = [
    {
      icon: <AiOutlineEye className="w-4 h-4 text-gray-400" />,
      title: "Showcase Views",
      value: "100,000",
      trend: "+10% vs last week",
    },
    {
      icon: <AiOutlineClockCircle className="w-4 h-4 text-gray-400" />,
      title: "Conversion Rate",
      value: "92%",
      trend: "-10% vs last week",
    },
    {
      icon: <AiOutlineMessage className="w-4 h-4 text-gray-400" />,
      title: "Interactions",
      value: "24",
      trend: "-10% vs last month",
    },
    {
      icon: <AiOutlineStar className="w-4 h-4 text-gray-400" />,
      title: "Endorsement",
      value: "80",
      trend: "+10% vs last month",
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

  const handleDelete = () => {
    setShowModal(false);
  };
 

  const handleSave = (visibility: string) => {
    setOpen(false);
  };

  return (
    <>
    <div className="bg-[#f6f7fb] min-h-screen p-6 text-sm text-gray-800 font-sans">
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
  <div>
    Showcase rooms / <span className="text-gray-800 font-semibold">Data/BI Analyst</span>
  </div>

  <div className="flex gap-2">
    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm border h-9 hover:cursor-pointer">
      Edit Room
    </button>
    <button className="bg-gray-100 text-red-700 px-4 py-2 rounded-md text-sm border h-9 flex items-center justify-center hover:cursor-pointer"
   onClick={() => setShowModal(true)}>
      <MdOutlineDelete size={16} />
    </button>
  </div>
</div>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
        <div className="flex justify-between items-start">
          <div>
          <h1 className="text-[20px] font-semibold flex items-center">
  Data/BI Analyst
  <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full inline-flex items-center">
    <TbWorld className="mr-1" /> Public
  </span>
</h1>

            <p className="text-sm text-gray-600 mt-1">John Doe</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm border hover:cursor-pointer"
              onClick={() => setVisibility(true)}>Change Visibility</button>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:cursor-pointer"
             onClick={() => setOpen(true)}>Share room</button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-5 shadow-sm w-full border border-gray-200"
        >
          <div className="flex justify-between items-start mb-1">
            <span className="text-sm text-gray-500">{item.title}</span>
            {item.icon}
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-2">
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

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-base">Summary</h2>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">AI Generated</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              Data/BI Analyst with 5+ years of experience in transforming complex datasets into actionable insights. Proficient in data visualization, SQL, and statistical analysis to drive strategic decision-making. Skilled in leveraging BI tools like Power BI and Tableau, with a strong foundation in ETL processes and data modeling.
            </p>
          </div>

          {/* Qualifications */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="font-semibold text-base mb-3">Qualifications</h2>
      <div className="flex flex-wrap gap-2">
        {qualifications.map((item, idx) => (
          <span
            key={idx}
            className="bg-[#f3f4f6] px-3 py-1 rounded-full text-xs text-gray-700 border border-gray-300 flex items-center gap-2"
          >
            <Image src={item.icon} alt="" width={14} height={14} />
            {item.label}
          </span>
        ))}
      </div>
    </div>

          {/* Core Competencies */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold text-base mb-3">Core Competencies</h2>
            <div className="flex flex-wrap gap-2">
              {["Statistical & Predictive Analysis", "Stakeholder Communication & Reporting", "Data Visualization (Power BI, Tableau)", "ETL & Data Processing"].map((tag, idx) => (
                <span key={idx} className="bg-[#f3f4f6] px-3 py-1 rounded-full text-xs text-gray-700 border border-gray-300">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Recent Activity */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-base mb-1">Recent activity</h2>
          <p className="text-xs text-gray-500 mb-4">Based on room interaction</p>
          <div className="space-y-6">
            {[
              { image:  you ,name: "You", action: "updated Pets World case study", time: "11:30 AM" },
              {  image:  user1 , name: "Breanna Butler", action: "viewed your profile", time: "2:00 PM" },
              {  image:  user2 , name: "Lana Ray", action: "viewed your profile", time: "12:45 PM" },
              {  image:  user3 , name: "Deanna T.", action: "sent a message", time: "12:45 PM" },
              {  image:  you , name: "Anthony S.", action: "viewed your profile", time: "11:30 AM" },
              {  image:  user4 , name: "Michele C.", action: "sent a message", time: "9:30 AM" },
              {  image:  user5 , name: "Scott M.", action: "viewed your profile", time: "5 days ago" },
              {  image:  user6 , name: "Michel L.", action: "viewed your profile", time: "5 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <Image src={activity.image} className="w-10 h-10 rounded-full" alt="profile" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 leading-tight text-sm">{activity.name}</div>
                  <div className="text-gray-500 text-xs truncate">{activity.action}</div>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap pt-1">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
