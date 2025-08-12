import { useState } from "react";
import star from '@/public/assets/icons/sparkles.png'
import userProfile from "@/public/assets/profile/user.png"
import {
  FiBold, FiItalic, FiUnderline, FiLink, FiImage, FiPlus,
  FiAlignLeft, FiAlignCenter, FiAlignRight
} from "react-icons/fi";
import {
  PiTextTLight, PiTextColumnsLight, PiTextIndentLight
} from "react-icons/pi";
import Image from "next/image";

export default function EmailModal({ onClose }: any) {
  const [emailBody, setEmailBody] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-gray-200/40 flex items-center justify-center border border-gray-200">
      <div className="max-w-3xl w-full mx-auto border border-gray-200 rounded-lg shadow  bg-white relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 p-6">
          <div className="flex items-center space-x-4">
            <Image src={userProfile} alt="User" className=" rounded-full" width={48} />
            <div>
              <h4 className="font-semibold text-sm">Michael Thompson</h4>
              <p className="text-xs text-gray-500">BloomSoft | Senior UX Designer Role</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">9:00 AM (11 hours ago)</p>
        </div>

        {/* Fields */}
        <div className="space-y-4 mb-4">
          <input type="text" placeholder="To" className="w-full border-b border-gray-200 outline-none p-4 text-sm" />
          <input type="text" placeholder="Subject" className="w-full border-b border-gray-200 outline-none p-4 text-sm" />
          <button className="text-teal-600 text-sm border-b border-gray-200 p-4">+ Link showcase room</button>
        </div>

        {/* Compose with AI Button */}
        
        <div className="mb-3 p-6">
          <button className="flex items-center px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 gap-2">
            <Image src={star} alt="" /> Compose with AI
          </button>
        </div>
        <div className="py-3 px-6">
        {/* Toolbar */}
        <div className="flex items-center space-x-3  pb-2 mb-3 text-gray-600 text-lg ">
          <FiBold />
          <FiItalic />
          <FiUnderline />
          <PiTextTLight />
          <FiAlignLeft />
          <FiAlignCenter /> 
          <FiAlignRight />
          <PiTextColumnsLight />
          <PiTextIndentLight />
          <FiImage />
          <FiLink />
          <FiPlus />
        </div>

        {/* Email Body */}
        <textarea
          rows={5}
          className="w-full outline-none border border-gray-200 resize-none text-sm p-1"
          placeholder="Start typing your message..."
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6 w-full">
  <button
    className="px-4 py-2 w-1/2 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
    onClick={onClose}
  >
    Back
  </button>
  <button className="px-4 py-2 w-1/2 bg-teal-600 text-white rounded-md hover:bg-teal-700 cursor-pointer">
    Send Email
  </button>
</div>
</div>

      </div>
    </div>
  );
}
