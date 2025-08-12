"use client"
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import mail from "@/public/assets/icons/mail.png";
import edit from "@/public/assets/icons/pencil-3.png";
import deleteI from "@/public/assets/icons/archive.png";
import up_down from "@/public/assets/icons/swap-verticle.png";
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
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Smart Outreach</h1>
          <p className="text-sm text-gray-500">Manage your professional conversations</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 cursor-pointer"
        onClick={()=>setShowEmail(true)}>
          <Image src={mail} alt="" width={20} />
          Compose
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 border-t border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 font-medium text-gray-500">Name</th>
              <th className="py-3 px-4 font-medium text-gray-500">Message</th>
              <th className="py-3 px-4 font-medium text-gray-500 flex gap-1">Status 
                <Image src={up_down} alt="" width={16} />
              </th>
              <th className="py-3 px-4 font-medium text-gray-500">Last Interaction</th>
              <th className="py-3 px-4 font-medium text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img src={msg.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-medium text-gray-900"><Link href={"/message"}> {msg.name} </Link></div>
                    <div className="text-xs text-gray-500">{msg.company}</div>
                  </div>
                </td>
                <td className="py-3 px-4 truncate max-w-xs">{msg.message}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(msg.status)}`}>
                    {msg.status}
                  </span>
                </td>
                <td className="py-3 px-4">{msg.lastInteraction}</td>
                <td className="py-3 px-4 flex items-center justify-center gap-4 text-gray-500">
                  <Image src={edit} alt="" width={16} className="hover:text-teal-600 cursor-pointer" />
                  <Image src={deleteI} width={16} alt="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-sm text-gray-500 mt-4">
          Showing 1 to 5 of 10 results
        </div>
      </div>
    </div>
     {showEmail && <EmailModal onClose={() => setShowEmail(false)} />}
     </>
  );
}
