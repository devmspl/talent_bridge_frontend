"use client"
import { useState } from "react";
import { FaUser, FaLock, FaBell, FaShieldAlt, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FiX } from "react-icons/fi";
import logo from '@/public/assets/profile/Avatarlogo.png'
import Image from "next/image";
import profileIcon from "@/public/assets/icons/user.png";
import lock from "@/public/assets/icons/lock.png";
import bell from "@/public/assets/icons/bell-3.png";
import finger_print from "@/public/assets/icons/fingerprint.png";
import bin from "@/public/assets/icons/archive.png";
import Personal_info from "@/app/component/setting/Personal_info";
import NotificationSettings from "@/app/component/setting/NotificationSettings";
import PasswordSettings from "@/app/component/setting/PasswordSettings";
import PrivacySecurity from "@/app/component/setting/PrivacySecurity";
import DeleteAccount from "@/app/component/setting/DeleteAccount";

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("Personal information");


  return (
    <div className="min-h-screen  p-6 text-gray-800">
      <div className="bg-white p-6 rounded-xl shadow mb-5 ">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-600">Welcome to your data insights hub!</p>
      </div>

      <div className="flex gap-6">
        <div className="w-[312px] space-y-3 border border-gray-200 rounded p-4">
          {[
            { icon: profileIcon, label: "Personal information" },
            { icon: lock, label: "Password" },
            { icon: bell, label: "Notification & Preferences" },
            { icon: finger_print, label: "Privacy & Security" },
            { icon: bin, label: "Delete account" }
          ].map(({ icon, label }) => {
            const isActive = selectedTab === label;

            return (
              <button
                key={label}
                onClick={() => setSelectedTab(label)}
                className={`w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg transition cursor-pointer 
               ${isActive ? 'bg-gray-100  font-medium' : 'hover:bg-gray-100'}`}
              >
                <Image src={icon} alt="" width={20} />
                <span>{label}</span>
              </button>
            );
          })}

        </div>
        <div className="flex-1 bg-white rounded-xl  shadow-sm p-6">
          {selectedTab === "Personal information" && <Personal_info />}
          {selectedTab === "Password" && <PasswordSettings />}
          {selectedTab === "Notification & Preferences" && <NotificationSettings />}
          {selectedTab === "Privacy & Security" && <PrivacySecurity />}
          {selectedTab === "Delete account" && <DeleteAccount />}
        </div>
      </div>
    </div>
  );
}
