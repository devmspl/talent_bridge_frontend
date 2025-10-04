"use client";

import React, { useState } from "react";
import {
  FiEye,
  FiUsers,
  FiInfo,
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import up from '@/public/assets/media/upp.svg';
import down from '@/public/assets/media/downn.svg';
import drop from '@/public/assets/icons/Dropdown.svg'
import Image from "next/image";
import ups from "@/public/assets/icons/green up.svg"
import avatar from "@/public/assets/profile/Avatar.svg"

const data = [
  { date: 'Jan 11', analyst: 10, pianist: 50 },
  { date: 'Jan 12', analyst: 60, pianist: 70 },
  { date: 'Jan 13', analyst: 30, pianist: 90 },
  { date: 'Jan 14', analyst: 95, pianist: 80 },
  { date: 'Jan 15', analyst: 40, pianist: 50 },
  { date: 'Jan 16', analyst: 75, pianist: 65 },
  { date: 'Jan 17', analyst: 0, pianist: 100 },
];

const activities = [
  {
    id: 1,
    title: "New message from Sarah Johnson",
    description: "Regarding the Senior Software Engineer position at…",
    action: "Reply",
    time: "2h ago",
  },
  {
    id: 2,
    title: "Michael Chen viewed your profile",
    description: "Tech Recruiter at Global Staffing Inc",
    action: "View Profile",
    time: "2h ago",
  },
  {
    id: 3,
    title: "Michael Chen viewed your profile",
    description: "Tech Recruiter at Global Staffing Inc",
    action: "View Profile",
    time: "2h ago",
  },
  {
    id: 4,
    title: "Michael Chen viewed your profile",
    description: "Tech Recruiter at Global Staffing Inc",
    action: "View Profile",
    time: "2h ago",
  },
  {
    id: 5,
    title: "New recruiter review request",
    description: "Please rate your experience with Sarah Johnson",
    action: "Leave review",
    time: "2h ago",
  },
];
const activities1 = [
  {
    id: 1,
    avatar: "./assets/profile/Avatar.svg",
    name: "Deanna Turner",
    subtitle: "Scheduled for 3 PM today",
    time: "12:45 PM",
  },
  {
    id: 2,
    title: "New message from Sarah Johnson",
    description: "Regarding the Senior Software Engineer position at...",
    action: "Reply",
    time: "2h ago",
  },
  {
    id: 3,
    title: "Michael Chen viewed your profile",
    description: "Tech Recruiter at Global Staffing Inc",
    action: "View Profile",
    time: "2h ago",
  },
  {
    id: 4,
    title: "Michael Chen viewed your profile",
    description: "Tech Recruiter at Global Staffing Inc",
    action: "View Profile",
    time: "2h ago",
  },
  {
    id:5,
    title: "Michael Chen viewed your profile",
    description: "Tech Recruiter at Global Staffing Inc",
    action: "View Profile",
    time: "2h ago",
  },
  {
    id:6,
    title: "Michael Chen viewed your profile",
    description: "Tech Recruiter at Global Staffing Inc",
    action: "View Profile",
    time: "2h ago",
  },
  {
    id: 7,
    title: "New recruiter review request",
    description: "Please rate your experience with Sarah Johnson",
    action: "Leave review",
    time: "2h ago",
  },
]

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [activityFilter, setActivityFilter] = useState<'All' | 'Unread'>('All');
  return (
    <div className="min-h-screen bg-white">
        <div className="bg-white p-6 rounded-xl shadow mb-3 ">
          <h2 className="text-2xl leading-8 tracking-normal font-inter font-semibold text-gray-900">Welcome back, John!</h2>
          <p className="text-sm font-inter font-normal leading-5 tracking-normal text-gray-600">Here's what's happening with your profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <StatCard title="Profile Views" value="100,000" icon={<FiEye />} change="3%" trend="up" time="last week" />
          <StatCard title="Response Rate" value="92%" icon={<FiInfo />} change="10%" trend="down" time="last week" />
          <StatCard title="Verified Connections" value="24" icon={<FiUsers />} change="10%" trend="down" time="last month" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-3">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3  className="text-lg font-inter font-semibold leading-7 tracking-normal text-gray-900">Room Engagement</h3>
              <p className="text-sm text-gray-600">Overview of showcase room engagement</p>
            </div>
             
           <div className="relative inline-block p-2">
  <button
    onClick={() => setOpen(!open)}
    className="border text-sm px-3 py-1 rounded-md text-gray-700 flex items-center gap-1"
  >
    Last week
    <Image src={drop} alt="dropdown icon" className="opacity-100" />
  </button>

  {open && (
    <div className="absolute mt-1 w-max bg-white border rounded-md shadow-lg pr-2 z-50">
      <div className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100">
        Last week
      </div>
      <div className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100">
        Last month
      </div>
      <div className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100">
        Last year
      </div>
    </div>
  )}
</div>

          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAnalyst" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPianist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="analyst" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAnalyst)" name="Data/BI Analyst" />
              <Area type="monotone" dataKey="pianist" stroke="#a855f7" fillOpacity={1} fill="url(#colorPianist)" name="Professional Pianist" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white  rounded-2xl shadow-md">
  <div className="flex justify-between items-center pt-6 pl-6 pr-6 ">
    <h3 className=" font-inter font-semibold text-lg leading-7 tracking-normal text-gray-900">Recent activity</h3>
    <div className="flex gap-2 bg-[#F9FAFB] rounded-full p-1">
      <button 
        onClick={() => setActivityFilter('All')}
        className={`text-sm px-3 py-1 rounded-full font-medium ${activityFilter === 'All' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
      >
        All
      </button>
      <button 
        onClick={() => setActivityFilter('Unread')}
        className={`text-sm px-3 py-1 rounded-full font-medium ${activityFilter === 'Unread' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
      >
        Unread
      </button>
    </div>
  </div>

  <p className="text-sm text-gray-500 pl-6 mb-3 border-b pb-3 border-[#E5E7EB]  ">Mark all as read</p>

  {activityFilter === 'All' && (
    <div className="p-6 pt-0">
      {activities.map((activity) => (
        <div
          key={activity.id}
         className="flex justify-between items-start py-4 border-t first:border-t-0 border-[#E5E7EB] "
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-500">{activity.description}</p>
            <button className="text-sm text-teal-600 font-medium hover:underline">
              {activity.action}
            </button>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
        </div>
      ))}
    </div>
  )}

  {activityFilter === 'Unread' && (
    <div className="p-6 pt-0 bg-white">
        {activities1.map((activity) => (
        <div
          key={activity.id}
          className={`flex justify-between items-start py-4 px-6 ${
            activity.id >= 1 && activity.id <= 4 
              ? 'bg-gray-50 border-l-4 border-[#02ABAC] ml-0' 
              : activity.id >= 5 ? 'border-b border-[#E5E7EB]' : ''
          }`}
        >
          <div className="space-y-1">
            {activity.avatar && (
              <div className="flex items-center gap-3">
                <img
                  src={activity.avatar}
                  alt={activity.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.name}
                  </p>
                  {activity.subtitle && (
                    <p className="text-xs text-gray-500">{activity.subtitle}</p>
                  )}
                </div>
              </div>
            )}

            {!activity.avatar && (
              <>
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="text-sm text-gray-500">{activity.description}</p>
                )}
              </>
            )}

            {activity.action && (
              <button className="text-sm text-teal-600 font-medium hover:underline">
                {activity.action}
              </button>
            )}
          </div>

          <span className="text-xs text-gray-400 whitespace-nowrap">
            {activity.time}
          </span>
         </div>
       ))}
     </div>
   )}
   
 </div>

        
    </div>
  );
};

const StatCard = ({ title, value, icon, change, trend, time }: any) => {
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const trendSymbol = trend === 'up' ? up : down ;

  return (
    <div className="bg-white p-4 rounded-xl shadow  items-center">
      <div>
         <div className="text-gray-400 text-xl flex justify-between">
          <p className="text-sm text-gray-500">{title}</p>
         <p> {icon}</p>
          </div>
        
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <div className={`text-sm flex gap-2 ${trendColor}`}> <Image src={trendSymbol} alt="" width={20} /> {change} <p className="text-gray-600"> vs {time} </p></div>
      </div>
    </div>
  );
};

export default Dashboard;
