import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";

export default function EmailModal({ onClose }: any) {
  const [emailBody, setEmailBody] = useState("");
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const router = useRouter()
  const showcaseRooms = [
    { id: "", name: "List of Showcase Rooms" },
    { id: "data-bi-analyst", name: "Data/BI Analyst" },
    { id: "professional-pianist", name: "Professional Pianist" },
  ];
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const sendEmail = (e: any) => {
    e.preventDefault();
    onClose();
    router.push("/smart-outreach");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/30 backdrop-blur-sm px-3 sm:px-4">
        <div className="w-full mx-auto border border-gray-200 rounded-lg shadow bg-white relative w-[92%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <Image src={userProfile} alt="User" className=" rounded-full" width={40} height={40} />
              <div>
                <h4 className="font-semibold text-sm sm:text-base">Michael Thompson</h4>
                <p className="text-xs sm:text-sm text-gray-500">BloomSoft | Senior UX Designer Role</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">9:00 AM (11 hours ago)</p>
          </div>

          {/* Fields */}
          <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
            <input type="text" placeholder="To" className="w-full border-b border-gray-200 outline-none p-3 sm:p-4 text-sm" />
            <input type="text" placeholder="Subject" className="w-full border-b border-gray-200 outline-none p-3 sm:p-4 text-sm" />
            <button
              className="text-teal-600 text-sm border-b border-gray-200 p-3 sm:p-4 text-left cursor-pointer"
              onClick={() => setShowRoomPicker(true)}
            >
              + Link showcase room
            </button>
          </div>

          {/* Compose with AI Button */}

          <div className="mb-3 px-4 sm:px-6">
            <button className="flex items-center px-3 py-1.5 text-xs sm:text-sm border rounded-md hover:bg-gray-50 gap-2 cursor-pointer">
              <Image src={star} alt="" /> Compose with AI
            </button>
          </div>
          <div className="py-3 px-4 sm:px-6">
            {/* Toolbar */}
            <div className="flex items-center space-x-3 pb-2 mb-3 text-gray-600 text-base sm:text-lg ">
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
              rows={6}
              className="w-full outline-none border border-gray-200 resize-none text-sm p-2 sm:p-3"
              placeholder="Start typing your message..."
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6 w-full">
              <button
                className="px-4 py-2 w-full sm:w-1/2 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={onClose}
              >
                Back
              </button>
              <button className="px-4 py-2 w-full sm:w-1/2 review text-white rounded-md hover:bg-teal-700 cursor-pointer"
              onClick={sendEmail}
              >
                Send Email
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Showcase Room Picker Modal */}
      {showRoomPicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 px-3 sm:px-4">
          <div className="w-full bg-white rounded-lg shadow-xl border border-gray-200 relative w-[92%] sm:max-w-md md:max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Select Showcase Room</h3>
              <button
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl leading-none cursor-pointer"
                onClick={() => setShowRoomPicker(false)}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6">
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                >
                  {showcaseRooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6">
              <button
                className="px-4 py-2 w-full sm:w-1/2 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => setShowRoomPicker(false)}
              >
                Back
              </button>
              <button
                className="px-4 py-2 w-full sm:w-1/2 review text-white rounded-md hover:bg-teal-700 cursor-pointer disabled:opacity-50"
                onClick={() => {
                  if (selectedRoom) {
                    const roomName = showcaseRooms.find((r) => r.id === selectedRoom)?.name || "";
                    setEmailBody((prev) => `${prev}${prev ? "\n\n" : ""}Linked room: ${roomName}`);
                    setShowRoomPicker(false);
                  }
                }}
                disabled={!selectedRoom}
              >
                Link room
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
