"use client";
import { useState } from "react";

export default function PrivacySecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showcaseVisibility, setShowcaseVisibility] = useState("All Connections");
  const [profileVisibility, setProfileVisibility] = useState("All Connections");

  const visibilityOptions = ["Public", "Connections Only", "Private"];

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 py-5 px-5 text-2xl text-black font-semibold">
        <h1>Privacy & Security</h1>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500">
              Add an extra layer of security
            </p>
          </div>
          <label
            htmlFor="2fa-toggle"
            className={`relative inline-block w-11 h-6 rounded-full cursor-pointer ${
              twoFactorEnabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <input
              type="checkbox"
              id="2fa-toggle"
              className="sr-only "
              checked={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
            />
            <span
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                twoFactorEnabled ? "translate-x-5" : ""
              }`}
            />
          </label>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Showcase Room Visibility</h4>
            <p className="text-sm text-gray-500">
              Control who can view your showcase rooms
            </p>
          </div>
          <select
            value={showcaseVisibility}
            onChange={(e) => setShowcaseVisibility(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {visibilityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Profile Visibility</h4>
            <p className="text-sm text-gray-500">
              Control who can view your profile
            </p>
          </div>
          <select
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {visibilityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
