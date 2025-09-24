"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

const Page: React.FC = () => {
  const router = useRouter();

  const [roomName, setRoomName] = useState("Data Analytics Portfolio");
  const [roomSummary, setRoomSummary] = useState("");
  const [role, setRole] = useState("Data Analyst");

  const [coverImage, setCoverImage] = useState<File | null>(null);
const coverInputRef = useRef<HTMLInputElement | null>(null);

const handleCoverClick = () => coverInputRef.current?.click();
const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) setCoverImage(e.target.files[0]);
};


  return (
    <>
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
        <Link href="/showcase-rooms">  Showcase rooms </Link> <span className="text-gray-800 font-semibold"> / New</span>
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
              <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">1</div>
              <span className="text-[#0A0D14] font-inter font-medium text-[14px] leading-[20px] tracking-[-0.006em]">Introduction</span>
            </div>
            <span className="text-gray-400">›</span>
            {/* <div className="text-gray-500">2 Competencies</div> */}
             <div className="text-gray-500 rounded-full flex gap-2">
              <div className="w-5 h-5  text-gray text-xs flex items-center justify-center rounded-full border">
                2
              </div> Competencies</div>
            <span className="text-gray-400">›</span>
            {/* <div className="text-gray-500">3 Insights</div> */}
             <div className="text-gray-500 rounded-full flex gap-2">
              <div className="w-5 h-5  text-gray text-xs flex items-center justify-center rounded-full border">
                3
              </div> Insights</div>
          </div>
          <div className="px-6 py-8">
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Room name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm  focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Room Summary</label>
              <textarea
                rows={3}
                placeholder="Type your message here"
                value={roomSummary}
                onChange={(e) => setRoomSummary(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none  focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">max 120 characters</p>
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Cover Image</label>
              <div className="border border-dashed border-gray-300 rounded-md flex items-center justify-center flex-col py-6 text-sm text-gray-600">
                <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                <p className="flex">
                  Drag & drop file here or{" "}
                  {/* <span className="text-blue-600 font-medium cursor-pointer">choose file</span> */}
                  <span
  onClick={handleCoverClick}  
  className="text-blue-600 font-medium cursor-pointer"
>
  choose file
</span>

<input
  type="file"
  accept="image/*"
  ref={coverInputRef}          
  onChange={handleCoverChange} 
  className="hidden"
/>
                </p>
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Video Intro (30s max)</label>
              <div className="border border-dashed border-gray-300 rounded-md flex items-center justify-center flex-col py-6 text-sm text-gray-600">
                <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                <p className="flex">
                  Drag & drop file here or{" "}
                  {/* <span className="text-blue-600 font-medium cursor-pointer">choose file</span> */}

                   <span
  onClick={handleCoverClick}  
  className="text-blue-600 font-medium cursor-pointer"
>
  choose file
</span>

<input
  type="file"
  accept="video/*"
  ref={coverInputRef}          
  onChange={handleCoverChange} 
  className="hidden"
/>
                </p>
              </div>
            </div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-800 block mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm  focus:outline-none"
              />
            </div>
            <div className='flex justify-end mt-4'>
              <button className="review text-white px-4 py-2 h-[40px] rounded-md flex items-center gap-2 hover:bg-teal-600 cursor-pointer"
                onClick={() => router.push("/competencies")}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
