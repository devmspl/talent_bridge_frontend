"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

const Page: React.FC = () => {
  const router = useRouter();

  const [roomName, setRoomName] = useState("Data Analytics Portfolio");
  const [roomSummary, setRoomSummary] = useState("");
  const [role, setRole] = useState("Data Analyst");

  return (
    <>
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
          Showcase rooms <span className="text-gray-800 font-semibold"> / New</span>
        </div>
        <div className="flex gap-2">
          <button
            className="absolute top-4 right-4 text-sm border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
          // onClick={() => router.push("/competencies")}
          >
            Save as draft
          </button>
        </div>
      </div>

      <div className="min-h-screen flex justify-center items-start pt-12">
        <div className="relative bg-white rounded-xl w-full max-w-xl shadow-md">
          <div className="flex items-center text-sm font-medium mb-6 gap-4 justify-center px-6 py-8 border-b border-gray-200">
            <div className="flex items-center gap-1 text-teal-600">
              <div className="w-5 h-5 bg-teal-500 text-white text-xs flex items-center justify-center rounded-full">1</div>
              <span className="text-gray-800 font-semibold">Introduction</span>
            </div>
            <span className="text-gray-400">›</span>
            <div className="text-gray-500">2 Competencies</div>
            <span className="text-gray-400">›</span>
            <div className="text-gray-500">3 Insights</div>
          </div>
          <div className="px-6 py-8">
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Room name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Room Summary</label>
              <textarea
                rows={3}
                placeholder="Type your message here"
                value={roomSummary}
                onChange={(e) => setRoomSummary(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">max 120 characters</p>
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Cover Image</label>
              <div className="border border-dashed border-gray-300 rounded-md flex items-center justify-center flex-col py-6 text-sm text-gray-600">
                <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                <p className="flex">
                  Drag & drop file here or{" "}
                  <span className="text-blue-600 font-medium cursor-pointer">choose file</span>
                </p>
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Video Intro (30s max)</label>
              <div className="border border-dashed border-gray-300 rounded-md flex items-center justify-center flex-col py-6 text-sm text-gray-600">
                <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                <p className="flex">
                  Drag & drop file here or{" "}
                  <span className="text-blue-600 font-medium cursor-pointer">choose file</span>
                </p>
              </div>
            </div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-800 block mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>
            <div className='flex justify-end mt-4'>
              <button className="bg-teal-500 text-white px-4 py-2 h-[40px] rounded-md flex items-center gap-2 hover:bg-teal-600 cursor-pointer"
                onClick={() => router.push("/competencies")}>
                next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
