"use client"
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import mail from "@/public/assets/icons/Mail1.svg";
import edit from "@/public/assets/icons/pencil.svg";
import deleteI from "@/public/assets/icons/archive.svg";
import up_down from "@/public/assets/icons/updown.svg";
import Image from "next/image";
import { useState } from "react";
import EmailModal from "@/app/component/modals/network/EmailModal";
import Link from "next/link";

export default function page() {
    const [showEmail, setShowEmail] = useState(false);

  const messages = [
    {
      name: "Michael Thompson",
      company: "Google | Senior UX Designer Role",
      avatar: "https://i.pravatar.cc/40?img=1",
      message: "Thanks for sharing your portfolio. Your showcase room...",
      status: "Awaiting Response",
      lastInteraction: "2h ago",
    },
    {
      name: "Maria Rigss",
      company: "Spotify | Product Design Position",
      avatar: "https://i.pravatar.cc/40?img=2",
      message: "Thanks for sharing your portfolio. Your showcase room...",
      status: "Responded",
      lastInteraction: "2h ago",
    },
    {
      name: "Emily Rodriguez",
      company: "Google | Senior UX Designer Role",
      avatar: "https://i.pravatar.cc/40?img=3",
      message: "Your research methodology in the showcase...",
      status: "Responded",
      lastInteraction: "1 min 45 sec",
    },
    {
      name: "John Doe",
      company: "Google | Senior UX Designer Role",
      avatar: "https://i.pravatar.cc/40?img=4",
      message: "Thanks for sharing your portfolio. Your showcase room...",
      status: "Archived",
      lastInteraction: "4 min 10 sec",
    },
    {
      name: "Thompson",
      company: "Company | Senior UX Designer Role",
      avatar: "https://i.pravatar.cc/40?img=5",
      message: "Thanks for sharing your portfolio. Your showcase room...",
      status: "Archived",
      lastInteraction: "1 min 20 sec",
    },
  ];

  const getStatusStyle = (status : any) => {
    if (status === "Awaiting Response")
      return "bg-yellow-100 text-yellow-600";
    if (status === "Responded")
      return "bg-teal-100 text-teal-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <>
    <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-white rounded-lg shadow-md mx-2 sm:mx-0">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-4 sm:mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Smart Outreach</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your professional conversations</p>
        </div>
        <button className="review text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-teal-700 cursor-pointer transition-colors text-sm sm:text-base font-medium w-full sm:w-auto min-w-[120px]"
        onClick={()=>setShowEmail(true)}>
          <Image src={mail} alt="" width={20} height={20} />
          <span>Compose</span>
        </button>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-hidden">
        {/* Mobile Layout (xs to md) */}
        <div className="block md:hidden space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <Link href={"/message"} className="flex items-center gap-3 flex-1 min-w-0">
                  <img src={msg.avatar} alt="avatar" className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-base truncate">{msg.name}</div>
                    <div className="text-sm text-gray-500 truncate">{msg.company}</div>
                  </div>
                </Link>
                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Image src={edit} alt="Edit" width={18} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Image src={deleteI} alt="Delete" width={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">{msg.message}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${getStatusStyle(msg.status)}`}>
                  {msg.status}
                </span>
                <Link href={"/message"} className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs text-gray-500 font-medium">{msg.lastInteraction}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet Layout (md to lg) */}
        <div className="hidden md:block lg:hidden">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 gap-4">
              {messages.map((msg, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <Link href={"/message"} className="flex items-center gap-4 flex-1">
                      <img src={msg.avatar} alt="avatar" className="w-14 h-14 rounded-full" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg">{msg.name}</div>
                        <div className="text-sm text-gray-500">{msg.company}</div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${getStatusStyle(msg.status)}`}>
                        {msg.status}
                      </span>
                      <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Image src={edit} alt="Edit" width={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Image src={deleteI} alt="Delete" width={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">{msg.message}</p>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    
                    Last interaction: {msg.lastInteraction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table Layout (lg+) */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 border-t border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-base">Name</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-base">Message</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-base">
                    <div className="flex items-center gap-2">
                      Status 
                      <Image src={up_down} alt="Sort" width={16} className="cursor-pointer" />
                    </div>
                  </th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-base">Last Interaction</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-base text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <Link href={"/message"} className="flex items-center gap-4">
                        <img src={msg.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-gray-900 text-base">{msg.name}</div>
                          <div className="text-sm text-gray-500">{msg.company}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <p className="text-gray-700 leading-relaxed">{msg.message}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${getStatusStyle(msg.status)}`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      <Link href={"/message"} className="flex items-center gap-3 flex-1 min-w-0">
                        {msg.lastInteraction}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Image src={edit} alt="Edit" width={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Image src={deleteI} alt="Delete" width={18} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1 to 5 of 10 results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
     {showEmail && <EmailModal onClose={() => setShowEmail(false)} />}
     </>
  );
}
