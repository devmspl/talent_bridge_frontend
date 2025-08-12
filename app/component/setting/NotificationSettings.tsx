"use client";
import { useState } from "react";

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <>
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 py-5 px-5 text-2xl text-black font-semibold">
          <h1>Notification & Preferences</h1>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Email Notifications</h4>
              <p className="text-sm text-gray-500">
                Receive updates about messages and profile views
              </p>
            </div>
            <label
              htmlFor="email-toggle"
              className={`relative inline-block w-11 h-6 rounded-full cursor-pointer ${
                emailNotifications ? "bg-green-500" : "bg-gray-300"
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
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  emailNotifications ? "translate-x-5" : ""
                }`}
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Push Notifications</h4>
              <p className="text-sm text-gray-500">
                Get notified about new messages and updates
              </p>
            </div>
            <label
              htmlFor="push-toggle"
              className={`relative inline-block w-11 h-6 rounded-full cursor-pointer ${
                pushNotifications ? "bg-green-500" : "bg-gray-300"
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
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  pushNotifications ? "translate-x-5" : ""
                }`}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
