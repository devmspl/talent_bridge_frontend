"use client";

import React from "react";
import {
  FiEye,
  FiUsers,
  FiInfo,
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import up from '@/public/assets/media/trending-up.png';
import down from '@/public/assets/media/trending-down.png';
import Image from "next/image";

const data = [
  { date: 'Jan 11', analyst: 10, pianist: 50 },
  { date: 'Jan 12', analyst: 60, pianist: 70 },
  { date: 'Jan 13', analyst: 30, pianist: 90 },
  { date: 'Jan 14', analyst: 95, pianist: 80 },
  { date: 'Jan 15', analyst: 40, pianist: 50 },
  { date: 'Jan 16', analyst: 75, pianist: 65 },
  { date: 'Jan 17', analyst: 0, pianist: 100 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow mb-3 ">
          <h2 className="text-xl font-semibold text-gray-900">Welcome back, John!</h2>
          <p className="text-sm text-gray-600">Here's what's happening with your profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <StatCard title="Profile Views" value="100,000" icon={<FiEye />} change="3%" trend="up" time="last week" />
          <StatCard title="Response Rate" value="92%" icon={<FiInfo />} change="10%" trend="down" time="last week" />
          <StatCard title="Verified Connections" value="24" icon={<FiUsers />} change="10%" trend="down" time="last month" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-3">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3  className="text-lg font-semibold text-gray-900">Room Engagement</h3>
              <p className="text-sm text-gray-600">Overview of showcase room engagement</p>
            </div>
            <button className="border text-sm px-3 py-1 rounded-md text-gray-700">Last week</button>
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

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent activity</h3>
            <div className="flex space-x-2">
              <button className="text-sm text-gray-700 border px-3 py-1 rounded-md">All</button>
              <button className="text-sm text-gray-700 border px-3 py-1 rounded-md">Unread</button>
            </div>
          </div>
          <p className="text-sm text-gray-600">Recent user activity will appear here.</p>
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
