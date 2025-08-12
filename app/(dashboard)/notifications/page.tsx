"use client";
import NotificationsModal from "@/app/component/modals/notification/NotificationsModal";
import { useState } from "react";

const notifications = [
    {
        id: 1,
        title: "New message from Sarah Johnson",
        description: "Regarding the Senior Software Engineer position at...",
        actionText: "Reply",
        time: "2h ago",
    },
    {
        id: 2,
        title: "Michael Chen viewed your profile",
        description: "Tech Recruiter at Global Staffing Inc",
        actionText: "View Profile",
        time: "2h ago",
    },
    {
        id: 3,
        title: "Michael Chen viewed your profile",
        description: "Tech Recruiter at Global Staffing Inc",
        actionText: "View Profile",
        time: "2h ago",
    },
    {
        id: 4,
        title: "Michael Chen viewed your profile",
        description: "Tech Recruiter at Global Staffing Inc",
        actionText: "View Profile",
        time: "2h ago",
    },
    {
        id: 5,
        title: "New recruiter review request",
        description: "Please rate your experience with Sarah Johnson",
        actionText: "Leave review",
        time: "2h ago",
    },
];

export default function NotificationPage() {
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const [showModal, setShowModal] = useState(false);
    console.log("showModal",showModal);
    

    return (
        <>
        <div className="min-h-screen  p-6 text-gray-800">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow mb-5 ">
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-600">Manage your notifications</p>
            </div>
            <div className="bg-white shadow-sm border border-gray-100 rounded-lg divide-y">
                <div className=" border-b border-gray-200 py-5 px-5 flex justify-between ">
                    <div>
                        <h1 className="text-2xl text-gray font-semibold">Notifications</h1>
                        <p className="text-sm text-gray-600">Manage your notifications</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-[2px] h-[36px] w-[45px] text-sm bg-gray-100 rounded-full leading-none flex items-center hover:cursor-pointer"
                        onClick={()=>setShowModal(true)}>
                            All
                        </button>
                        <button className="px-3 py-[2px] h-[36px] text-sm bg-white-100 rounded-full leading-none flex items-center hover:cursor-pointer">
                            Unread
                        </button>
                    </div>

                </div>
                {notifications.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                                <button className="text-sm text-teal-600 font-medium hover:underline cursor-pointer">
                                    {item.actionText}
                                </button>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {showModal && <NotificationsModal onClose={() => setShowModal(false)} />}
        </>
    );
}
