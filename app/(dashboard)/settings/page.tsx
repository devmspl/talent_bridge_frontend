"use client"
import { useState, useEffect, useRef } from "react";
import { FaUser, FaLock, FaBell, FaShieldAlt, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FiX, FiChevronDown } from "react-icons/fi";
import logo from '@/public/assets/profile/Avatarlogo.png'
import Image from "next/image";
import profileIcon from "@/public/assets/icons/user.png";
import lock from "@/public/assets/icons/lock.png";
import bell from "@/public/assets/icons/bell-3.png";
import finger_print from "@/public/assets/icons/fingerprint.png";
import bin from "@/public/assets/icons/archive.svg";
import Personal_info from "@/app/component/setting/Personal_info";
import NotificationSettings from "@/app/component/setting/NotificationSettings";
import PasswordSettings from "@/app/component/setting/PasswordSettings";
import PrivacySecurity from "@/app/component/setting/PrivacySecurity";
import DeleteAccount from "@/app/component/setting/DeleteAccount";

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("Personal information");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const settingsOptions = [
    { icon: profileIcon, label: "Personal information" },
    { icon: lock, label: "Password" },
    { icon: bell, label: "Notification & Preferences" },
    { icon: finger_print, label: "Privacy & Security" },
    { icon: bin, label: "Delete account" }
  ];

  const selectedOption = settingsOptions.find(option => option.label === selectedTab);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="min-h-screen text-gray-800">
      <div className="bg-white p-6 rounded-xl shadow mb-5 ">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-600">Welcome to your data insights hub!</p>
      </div>

      {/* Mobile Dropdown - Visible on small screens */}
      <div className="lg:hidden mb-6">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {selectedOption && (
                <>
                  <Image src={selectedOption.icon} alt="" width={20} />
                  <span className="font-medium">{selectedOption.label}</span>
                </>
              )}
            </div>
            <FiChevronDown 
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {settingsOptions.map(({ icon, label }) => {
                const isActive = selectedTab === label;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      setSelectedTab(label);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 transition cursor-pointer 
                     ${isActive ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                  >
                    <Image src={icon} alt="" width={20} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar - Hidden on small screens */}
        <div className="hidden lg:block w-[312px] space-y-3 border border-gray-200 rounded p-4">
          {settingsOptions.map(({ icon, label }) => {
            const isActive = selectedTab === label;

            return (
              <button
                key={label}
                onClick={() => setSelectedTab(label)}
                className={`w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg transition cursor-pointer 
               ${isActive ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'}`}
              >
                <Image src={icon} alt="" width={20} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
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
