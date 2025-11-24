"use client";
import Image from "next/image";
import Avatar from "@/app/component/Avatar";
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";
import userprofile from "@/public/assets/profile/profileimage.png";
import bitbucket from "@/public/assets/media/bitbucket.png";
import { useParams, useRouter } from "next/navigation";
import EmailModal from "@/app/component/modals/network/EmailModal";
import ghost from "@/public/assets/icons/Ghost1.svg";
import call from "@/public/assets/icons/cal1.svg";
import mail from "@/public/assets/icons/Mail1.svg";
import calender from "@/public/assets/icons/Calender1.svg";
import star from "@/public/assets/icons/Star.svg";
import hafstar from "@/public/assets/icons/Star icon (1).png";
import ReviewModal from "@/app/component/modals/network/ReviewModal";
import { useGetUserByIdQuery } from "@/app/store/api/userApi";
import { useGetAllRoomsQuery, useCreateChatRoomMutation } from "@/app/store/api/chatApi";
import profile from "@/public/assets/profile/Avatar.png";
import Link from "next/link";
import Cookies from "js-cookie";
import socketService, { ChatRoom } from "@/app/store/api/socket";
import { BaseUrl } from "@/app/store/BaseUrl";

export default function page() {
  const [showEmail, setShowEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('All reviews');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  // Read userId directly from cookies as it's the source of truth
  const userId = Cookies.get("tb_userId");
  const token = Cookies.get("tb_token");

  const { data: user, isLoading } = useGetUserByIdQuery(id!, {
    skip: !id,
    pollingInterval: 10000,
  });

  const { data: chatRooms } = useGetAllRoomsQuery();
  const [createChatRoom] = useCreateChatRoomMutation();

  // Initialize socket connection
  useEffect(() => {
    if (userId) {
      socketService.connect(userId);
    }
  }, [userId]);

  const handleSendMessage = () => {
    if (!id || !userId) return;
    
    setIsCreatingRoom(true);
    
    // Create room using socket.io
    socketService.createRoom(userId, id, (room) => {
      // Navigate to the chat room
      router.push(`/message?roomId=${room._id}`);
      setIsCreatingRoom(false);
    });
  };


  return (
    <>
      {/* <p className="pl-6 ">Recruiter/Profile</p> */}
      <p className="pl-6  flex gap-2 ">
        {" "}
        <Link href="/network">
          <span className="font-inter font-medium text-[14px] leading-5 align-middle cg">
            Recruiters
          </span>
        </Link>
        /{" "}
        <Link href="#">
          <span className="font-inter font-medium text-[14px] leading-5 align-middle">
            Profile
          </span>
        </Link>
      </p>
      <div className="p-6 space-y-6">
        {/* Top Profile Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
              <Avatar
                avatar={user?.avatar}
                avatarSvg={user?.avatarSvg}
                alt={user?.name || "Profile Image"}
                width={120}
                height={120}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h2 className="text-xl text-[#111827] font-semibold">
                {user?.fullName}
              </h2>
              <div className="flex gap-2 text-sm text-gray-500 mt-1">
                <span className="bg-gray-100 text-[#374151] px-2 py-1 rounded-full text-xs">
                  8+yrs
                </span>
                <span className="bg-gray-100 text-[#374151] px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <FaMapMarkerAlt /> London, UK
                </span>
              </div>
              <p className="text-[#4B5563] mt-1">
                Talent Acquisition Lead • Technology
              </p>
              <div className="flex gap-1">
                <Image src={bitbucket} alt="bitbucket" width={24} />
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  BitBucket
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              className="review text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
              disabled={isCreatingRoom || !id || !userId}
            >
              <Image src={mail} alt="mail" width={20} />
              {isCreatingRoom ? "Creating..." : "Send Message"}
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 hover:cursor-pointer">
              <Image src={call} alt="call " width={20} /> Request call
            </button>
          </div>
        </div>

        {/* Performance & Recent Placements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance */}
          <div className="bg-white rounded-2xl shadow ">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 p-6">
              Performance
            </h3>
            <div className="p-6">
              <div className="mb-2 flex items-center gap-2 text-[18px] font-normal leading-[28px] tracking-[0] text-[#4B5563] font-inter">
                Ghost Rating
                <Image
                  src={ghost}
                  alt="ghost icon"
                  className="w-[20px] h-[20px] opacity-100 rotate-0"
                />
              </div>
              <div className="flex gap-2 text-xs mb-4">
                <span className="bg-[#E6F7F780] border border-[#B1E5E5] text-[#028081] px-2 py-1 rounded-full">
                  Excellent
                </span>

                <span className="bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] px-2 py-1 rounded-full">
                  Average
                </span>

                <span className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] px-2 py-1 rounded-full">
                  Bad
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-2">Total Placements</p>
              <p className="text-2xl font-bold">89</p>
              <p className="text-gray-500 text-sm mt-4 mb-2">Response Rate</p>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-gray-500 text-sm mt-4 mb-2">
                Average Response Time
              </p>
              <p className="text-2xl font-bold">24hrs</p>
            </div>
          </div>

          {/* Recent Placements */}
          <div className="bg-white rounded-2xl shadow ">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 p-6 ">
              Recent Placements
            </h3>
            <div className="p-6">
              {[
                "Senior Software Engineer",
                "ML Engineer",
                "Data Analyst",
                "Data Analyst",
              ].map((role, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center mb-4 review-1"
                >
                  <div>
                    <p className="font-medium text-sm">{role}</p>
                    <p className="text-gray-400 text-sm">CloudTech Inc</p>
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <Image src={calender} alt="calender" width={16} /> Jan 2025
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate Reviews */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Candidate Reviews</h3>
            <div className="flex gap-2">

              <div className="mb-6 relative">
                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none appearance-none pr-8"
                >
                  <option>All reviews</option>
                  <option>Top reviews</option>
                  <option>New to old</option>
                  <option>Highest to lowest</option>
                  <option>Lowest to highest</option>
                </select>

                <svg
                  className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <button
                className="border border-gray-300 review text-white  px-4 py-2 h-[38px] rounded-lg flex items-center gap-2 hover:cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                Add Review
              </button>
            </div>
          </div>

          {/* Review Card */}
          <div className="review-1 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <Image src={userprofile} alt="user" width={24} height={24} />
                <p className="font-semibold text-sm ">
                  Mike Zhang{" "}
                  <span className="text-gray-400 font-normal">
                    | Frontend Developer
                  </span>
                </p>
              </div>
              <div>
                <div className="text-yellow-400 flex gap-1">
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={hafstar} alt="hafstar" width={16} />
                </div>
                <p className="text-right text-xs text-gray-400">Feb 2025</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2 w-[90%]">
              Maria was incredibly insightful and supportive throughout the
              hiring process. She provided clear guidance, set the right
              expectations, and ensured smooth communication at every stage. Her
              professionalism made the entire experience seamless
            </p>
          </div>

          <div className="review-1 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <Image src={userprofile} alt="user" width={24} height={24} />
                <p className="font-semibold text-sm ">
                  Williams Doe{" "}
                  <span className="text-gray-400 font-normal">
                    | Data Analyst
                  </span>
                </p>
              </div>
              <div>
                <div className="text-yellow-400 flex gap-1">
                  {/* {[...Array(5)].map((_, i) => <MdOutlineStar key={i} />)} */}
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={hafstar} alt="hafstar" width={16} />
                </div>
                <p className="text-right text-xs text-gray-400">Dec 2024</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2 w-[90%]">
              Maria made my job search experience stress-free. She was friendly,
              approachable, and genuinely cared about finding the right fit for
              me. Her attention to detail and commitment to candidates is truly
              commendable!
            </p>
          </div>

          <div className="review-1 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <Image src={userprofile} alt="user" width={24} height={24} />
                <p className="font-semibold text-sm ">
                  Michelle Carter{" "}
                  <span className="text-gray-400 font-normal">
                    | UX Engineer
                  </span>
                </p>
              </div>
              <div>
                <div className="text-yellow-400 flex gap-1">
                  {/* {[...Array(5)].map((_, i) => <MdOutlineStar key={i} />)} */}
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={hafstar} alt="hafstar" width={16} />
                </div>
                <p className="text-right text-xs text-gray-400">Jan 2025</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2 w-[90%]">
              Maria went above and beyond to ensure I was well-prepared for my
              interviews. She took the time to understand my career goals and
              matched me with the right opportunity at Bitbucket. I truly
              appreciated her transparency and efficiency{" "}
            </p>
          </div>

          <div className="review-1 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <Image src={userprofile} alt="user" width={24} height={24} />
                <p className="font-semibold text-sm ">
                  Amanda Murphy{" "}
                  <span className="text-gray-400 font-normal">
                    | Sales Associate
                  </span>
                </p>
              </div>
              <div>
                <div className="text-yellow-400 flex gap-1">
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={star} alt="star" width={16} />
                  <Image src={hafstar} alt="hafstar" width={16} />
                </div>
                <p className="text-right text-xs text-gray-400">Feb 2025</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2 w-[90%]">
              I've worked with many recruiters before, but Maria stood out with
              her personalized approach. She gave constructive feedback on my
              resume, kept me updated throughout the process, and made sure I
              had all the resources needed to succeed. Highly recommend{" "}
            </p>
          </div>

          {/* Another Review Preview */}
          <p className="text-sm text-gray-500">More reviews coming soon...</p>
        </div>
      </div>
      {showEmail && <EmailModal onClose={() => setShowEmail(false)} />}
      {showModal && <ReviewModal onClose={() => setShowModal(false)} />}
    </>
  );
}
