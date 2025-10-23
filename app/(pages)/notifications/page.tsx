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
        isRead: false,
    },
    {
        id: 2,
        title: "Michael Chen viewed your profile",
        description: "Tech Recruiter at Global Staffing Inc",
        actionText: "View Profile",
        time: "2h ago",
        isRead: false,
    },
    {
        id: 3,
        title: "Michael Chen viewed your profile",
        description: "Tech Recruiter at Global Staffing Inc",
        actionText: "View Profile",
        time: "2h ago",
        isRead: true,
    },
    {
        id: 4,
        title: "Michael Chen viewed your profile",
        description: "Tech Recruiter at Global Staffing Inc",
        actionText: "View Profile",
        time: "2h ago",
        isRead: true,
    },
    {
        id: 5,
        title: "New recruiter review request",
        description: "Please rate your experience with Sarah Johnson",
        actionText: "Leave review",
        time: "2h ago",
        isRead: false,
    },
];

export default function NotificationPage() {
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const [showModal, setShowModal] = useState(false);
    
    // Filter notifications based on active tab
    const filteredNotifications = activeTab === "all" 
        ? notifications 
        : notifications.filter(notification => !notification.isRead);

    return (
        <>
        <div className="min-h-screen text-gray-800">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow mb-5 flex justify-between ">
                    <div>
                        <h1 className="text-2xl text-gray font-semibold">Notifications</h1>
                        <p className="text-sm text-gray-600">Manage your notifications</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            className={`px-3 py-[2px] h-[36px] w-[45px] text-sm rounded-full leading-none flex items-center hover:cursor-pointer ${
                                activeTab === "all" ? "bg-gray-100" : "bg-white-100"
                            }`}
                            onClick={() => setActiveTab("all")}
                        >
                            All
                        </button>
                        <button 
                            className={`px-3 py-[2px] h-[36px] text-sm rounded-full leading-none flex items-center hover:cursor-pointer ${
                                activeTab === "unread" ? "bg-gray-100" : "bg-white-100"
                            }`}
                            onClick={() => setActiveTab("unread")}
                        >
                            Unread
                        </button>
                    </div>

                </div>
            <div className="bg-white shadow-sm border border-gray-100 rounded-lg divide-y">
                {filteredNotifications.map((item) => (
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
