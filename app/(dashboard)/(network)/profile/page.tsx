"use client"
import Image from "next/image";
import { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaPhone, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";
import user from '@/public/assets/profile/profileimage.png';
import bitbucket from '@/public/assets/media/bitbucket.png'
import { useRouter } from "next/navigation";
import EmailModal from "@/app/component/modals/network/EmailModal";
import ghost from "@/public/assets/icons/Ghost.png"
import call from "@/public/assets/icons/phone-call.png";
import mail from "@/public/assets/icons/mail.png";
import calender from "@/public/assets/icons/calendar.png";
import star from "@/public/assets/icons/Star icon.png";
import hafstar from "@/public/assets/icons/Star icon (1).png";
import ReviewModal from "@/app/component/modals/network/ReviewModal";


export default function page() {
  const [showEmail, setShowEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter()

  return (
    <>
    <div className="p-6 space-y-6">
      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4 items-center">
          <Image src={user} alt="Maria Riggs" className=" rounded-full object-cover" width={120} />
          <div>
            <h2 className="text-xl font-semibold">Maria Riggs</h2>
            <div className="flex gap-2 text-sm text-gray-500 mt-1">
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">8+yrs</span>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1"><FaMapMarkerAlt /> London, UK</span>
            </div>
            <p className="text-gray-600 mt-1">Talent Acquisition Lead • Technology</p>
            <div className="flex gap-1">
                <Image src={bitbucket} alt="" width={24} />
            <p className="text-sm text-gray-500 mt-1 font-medium">BitBucket</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:cursor-pointer"
          onClick={()=>setShowEmail(true)}>
            <Image src={mail} alt="" width={20} /> Send Message
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 hover:cursor-pointer">
            <Image src={call} alt=" " width={20} /> Request call
          </button>
        </div>
      </div>

      {/* Performance & Recent Placements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance */}
        <div className="bg-white rounded-2xl shadow ">
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 p-6">Performance</h3>
          <div className="p-6">
          <div className="mb-2 text-sm font-medium text-gray-600 flex items-center gap-2">
            Ghost Rating <Image src={ghost} alt="" width={20} />
          </div>
          <div className="flex gap-2 text-xs mb-4">
            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">Excellent</span>
            <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Average</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full">Bad</span>
          </div>
          <p className="text-gray-500 text-sm mb-2">Total Placements</p>
          <p className="text-2xl font-bold">89</p>
          <p className="text-gray-500 text-sm mt-4 mb-2">Response Rate</p>
          <p className="text-2xl font-bold">92%</p>
          <p className="text-gray-500 text-sm mt-4 mb-2">Average Response Time</p>
          <p className="text-2xl font-bold">24hrs</p>
          </div>
        </div>

        {/* Recent Placements */}
        <div className="bg-white rounded-2xl shadow ">
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 p-6 ">Recent Placements</h3>
          <div className="p-6">
          {[
            "Senior Software Engineer",
            "ML Engineer",
            "Data Analyst",
            "Data Analyst",
          ].map((role, idx) => (
            <div key={idx} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-medium text-sm">{role}</p>
                <p className="text-gray-400 text-sm">CloudTech Inc</p>
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-1">
                <Image src={calender} alt="" width={16} /> Jan 2025
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
          <select className="border border-gray-300 text-sm rounded-md px-3 py-1">
            <option>All reviews</option>
            <option>Top reviews</option>
            <option>New to old</option>
            <option>Highest to lowest</option>
            <option>Lowest to highest </option>
          </select>
          <button className="border border-gray-300 bg-teal-500 px-4 py-2 rounded-lg flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setShowModal(true)}>
           Add Review
          </button>
          </div>
        </div>
         

        {/* Review Card */}
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex gap-2">
            <Image src={user} alt="" width={24} /> 
              <p className="font-semibold text-sm ">Mike Zhang <span className="text-gray-400 font-normal">| Frontend Developer</span></p>
            </div>
            <div>
            <div className="text-yellow-400 flex gap-1">
              {/* {[...Array(5)].map((_, i) => <MdOutlineStar key={i} />)} */}
              <Image src={star} alt=""  width={16}/>
              <Image src={star} alt="" width={16} />
              <Image src={star} alt="" width={16} />
              <Image src={star} alt="" width={16} />
              <Image src={hafstar} alt="" width={16} />
            </div>
              <p className="text-right text-xs text-gray-400">Feb 2025</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2 w-[90%]">
            Maria was incredibly insightful and supportive throughout the hiring process. She provided clear guidance, set the right expectations, and ensured smooth communication at every stage. Her professionalism made the entire experience seamless
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
