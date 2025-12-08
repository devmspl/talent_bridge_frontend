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
import Cookies from "js-cookie";
import { useGetUserByIdQuery } from "@/app/store/api/userApi";
import { useGetShowcaseRoomsQuery } from "@/app/store/api/showcaseApi";
import { BaseUrl } from "@/app/store/BaseUrl";
import linkIcon from "@/public/assets/media/link-icon.svg"
import axios from "axios";
import { toast } from "react-toastify";

export default function EmailModal({ onClose }: any) {
  const [emailBody, setEmailBody] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const userId = Cookies.get("tb_userId");
  const { data: user } = useGetUserByIdQuery(userId ?? '', {
    skip: !userId,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Prefer backend profile_image/profileImage/avatar, handle absolute URLs and relative paths


  // Role text: qualification > non-empty industryType/industry > default
  const roleText = (() => {
    if (!user) return 'BloomSoft | Senior UX Designer Role';
    if (user.qualification) return user.qualification;
    const industry = user.industryType ?? user.industry;
    if (Array.isArray(industry)) {
      return industry.length > 0 ? industry.join(', ') : 'BloomSoft | Senior UX Designer Role';
    }
    if (industry) return String(industry);
    return 'BloomSoft | Senior UX Designer Role';
  })();

  // Employment type: join if non-empty array
  const employmentText = (() => {
    const emp = user?.employmentType ?? user?.employmentType;
    if (!emp) return '';
    if (Array.isArray(emp)) return emp.length ? emp.join(', ') : '';
    return String(emp);
  })();
  const showcaseRooms = [
    // fallback static options (used if API not available)
    { id: "", name: "List of Showcase Rooms" },
    { id: "data-bi-analyst", name: "Data/BI Analyst" },
    { id: "professional-pianist", name: "Professional Pianist" },
  ];

  const { data: roomsData, isLoading: roomsLoading, isError: roomsError, refetch } = useGetShowcaseRoomsQuery({
    userId: userId || '',
    page: 1,
    limit: 100,
  });

  const roomsList = Array.isArray(roomsData) ? roomsData : [];
  // Reset selected room when opening the picker
  useEffect(() => {
    if (showRoomPicker) {
      setSelectedRoom("");
    }
  }, [showRoomPicker]);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  
  const sendEmail = async (e: any) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      toast.error("Please enter recipient email address");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter email subject");
      return;
    }
    if (!emailBody.trim()) {
      toast.error("Please enter email content");
      return;
    }
    if (!selectedRoom) {
      toast.error("Please select a showcase room to link");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Construct the preview link
      const baseUrl = typeof window !== 'undefined' 
        ? (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)
        : 'http://localhost:3000';
      const link = `${baseUrl}/preview?id=${selectedRoom}`;
      
      // Get auth token
      const token = Cookies.get("tb_token");
      
      // Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      // Call API
      const response = await axios.post(
        `${BaseUrl}User/sendEmail`,
        {
          email: email.trim(),
          subject: subject.trim(),
          content: emailBody.trim(),
          link: link,
        },
        { headers }
      );
      
      if (response.data) {
        toast.success("Email sent successfully!");
        onClose();
        router.push("/smart-outreach");
      } else {
        toast.error("Failed to send email");
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error(
        error?.response?.data?.message || 
        error?.message || 
        "Failed to send email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/30 backdrop-blur-sm px-3 sm:px-4">
        <div className="w-full mx-auto border border-gray-200 rounded-lg shadow bg-white relative w-[92%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <Image
                src={`${BaseUrl}/assets/images/${user?.avatar || userProfile}`}
                alt={user?.fullname ?? user?.fullName ?? "User"}
                className=" rounded-full"
                width={40}
                height={40}
              />
              <div>
                <h4 className="font-semibold text-sm sm:text-base">{user?.fullname ?? user?.fullName ?? 'Michael Thompson'}</h4>
                <p className="text-xs sm:text-sm text-gray-500">{roleText}</p>
                {employmentText ? (
                  <p className="text-xs sm:text-sm text-gray-400">{employmentText}</p>
                ) : null}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">9:00 AM (11 hours ago)</p>
          </div>

          {/* Fields */}
          <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
            <input 
              type="email" 
              placeholder="To" 
              className="w-full border-b border-gray-200 outline-none p-3 sm:p-4 text-sm" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder="Subject" 
              className="w-full border-b border-gray-200 outline-none p-3 sm:p-4 text-sm" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <div className="flex items-center justify-between border-b border-gray-200 p-3 sm:p-4">
              <div
                className="text-teal-600 text-sm cursor-pointer hover:bg-gray-50 flex-1"
                onClick={() => setShowRoomPicker(true)}
              >
                {!selectedRoom ? (
                  '+ Link showcase room'
                ) : (
                  <div className="flex items-center gap-2">
                    <Image src={linkIcon} alt={user?.fullname ?? user?.fullName ?? "User"} className=" rounded-full" width={18} height={8} />
                    <span>{roomsList.find((r: any) => String(r._id ?? r.id) === selectedRoom)?.showcaseRoomName || 'Selected Room'}</span>
                  </div>
                )}
              </div>
              {selectedRoom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoom('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-sm ml-2"
                  aria-label="Remove room"
                >
                  ×
                </button>
              )}
            </div>
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
              <button 
                className="px-4 py-2 w-full sm:w-1/2 review text-white rounded-md hover:bg-teal-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={sendEmail}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Email"}
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
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <select
                  className="w-full border appearance-none border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                >
                  <option value="">Select showcase room</option>
                  {roomsLoading ? (
                    <option>Loading rooms...</option>
                  ) : roomsList.length === 0 ? (
                    <option>No rooms found</option>
                  ) : (
                    roomsList.map((room: any) => (
                      <option
                        key={String(room._id ?? room.id ?? room.showcaseRoomName)}
                        value={String(room._id ?? room.id)}
                      >
                        {room.showcaseRoomName || room.name || room.title || `Room ${room._id ?? ''}`}
                      </option>
                    ))
                  )}
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
