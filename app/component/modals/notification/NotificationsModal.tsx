import React from "react";
import { IoMdClose } from "react-icons/io";

const NotificationsModal = ({onClose} : any) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer" onClick={onClose}>  <IoMdClose size={20} /> </button>
        </div>

        <div className="text-sm text-gray-500 mb-3 cursor-pointer hover:underline">
          Mark all as read
        </div>

        <div className="flex space-x-2 mb-4">
          <button className="px-3 py-1 text-sm text-gray-700  rounded-full bg-gray-200">All</button>
          <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">Unread</button>
        </div>

        {/* Notifications */}
        <div className="space-y-4 text-sm">
          {/* Message Notification */}
          <div className="flex justify-between ">
            <div>
            <div className="text-gray-900 font-medium">New message from Sarah Johnson</div>
            <div className="text-gray-500">Regarding the Senior Software Engineer position at...</div>
            <div className="text-teal-600 font-medium cursor-pointer mt-1 hover:underline">Reply</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">2h ago</div>
          </div>

          {/* Profile View Notification */}
          <div className="flex justify-between ">
          <div>
            <div className="text-gray-900 font-medium">Michael Chen viewed your profile</div>
            <div className="text-gray-500">Tech Recruiter at Global Staffing Inc</div>
            <div className="text-teal-600 font-medium cursor-pointer mt-1 hover:underline">View Profile</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">2h ago</div>
          </div>

          {/* Review Request Notification */}
          <div className="flex justify-between ">
            <div>
            <div className="text-gray-900 font-medium">New recruiter review request</div>
            <div className="text-gray-500">Please rate your experience with Sarah Johnson</div>
            <div className="text-teal-600 font-medium cursor-pointer mt-1 hover:underline">Leave review</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">2h ago</div>
          </div>

          {/* Repeat Profile View Notifications */}
          {[1, 2].map((_, i) => (
            <div key={i} className="flex justify-between ">
            <div>
              <div className="text-gray-900 font-medium">Michael Chen viewed your profile</div>
              <div className="text-gray-500">Tech Recruiter at Global Staffing Inc</div>
              <div className="text-teal-600 font-medium cursor-pointer mt-1 hover:underline">View Profile</div>
              </div>
              <div className="text-xs text-gray-400 mt-2">2h ago</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
