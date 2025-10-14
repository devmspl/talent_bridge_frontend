"use client";
import { useState } from "react";

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <>
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 py-3 sm:py-4 md:py-5 px-4 sm:px-5">
          <h1 className="text-lg sm:text-xl md:text-2xl text-[#111827] font-semibold">
            Notification & Preferences
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-5 md:p-6">
          {/* Email Notifications */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 sm:pb-5 gap-3 sm:gap-0">
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
                Email Notifications
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Receive updates about messages and profile views
              </p>
            </div>
            <div className="flex justify-end sm:justify-start">
              <label
                htmlFor="email-toggle"
                className={`relative inline-block w-12 h-7 sm:w-11 sm:h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                  emailNotifications ? "bg-[#029A9B]" : "bg-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  id="email-toggle"
                  className="sr-only"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                <span
                  className={`absolute left-0.5 top-1 w-6 h-6 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                    emailNotifications ? "translate-x-5 sm:translate-x-5" : ""
                  }`}
                />
              </label>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
                Push Notifications
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Get notified about new messages and updates
              </p>
            </div>
            <div className="flex justify-end sm:justify-start">
              <label
                htmlFor="push-toggle"
                className={`relative inline-block w-12 h-7 sm:w-11 sm:h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                  pushNotifications ? "bg-[#029A9B]" : "bg-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  id="push-toggle"
                  className="sr-only"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                />
                <span
                  className={`absolute left-0.5 top-1 w-6 h-6 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                    pushNotifications ? "translate-x-5 sm:translate-x-5" : ""
                  }`}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
