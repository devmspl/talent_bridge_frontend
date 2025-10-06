"use client";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function PrivacySecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showcaseVisibility, setShowcaseVisibility] = useState("Public");
  const [profileVisibility, setProfileVisibility] = useState("Public");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const dropdownRefs = {
    showcase: useRef<HTMLDivElement>(null),
    profile: useRef<HTMLDivElement>(null),
  };

  const visibilityOptions = [
    { value: "Public", label: "Public" },
    { value: "Connections Only", label: "Connections Only" },
    { value: "Private", label: "Private" }
  ];

  const handleDropdownToggle = (type: string) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const handleDropdownSelect = (type: string, value: string) => {
    if (type === 'showcase') {
      setShowcaseVisibility(value);
    } else if (type === 'profile') {
      setProfileVisibility(value);
    }
    setOpenDropdown(null);
  };

  const getSelectedLabel = (type: string) => {
    const value = type === 'showcase' ? showcaseVisibility : profileVisibility;
    const option = visibilityOptions.find(opt => opt.value === value);
    return option ? option.label : "Select option";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(dropdownRefs).forEach(ref => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 py-3 sm:py-4 md:py-5 px-4 sm:px-5">
        <h1 className="text-lg sm:text-xl md:text-2xl text-[#111827] font-semibold">
          Privacy & Security
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-5 md:p-6">
        {/* Two-Factor Authentication */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 sm:pb-5 gap-3 sm:gap-0">
          <div className="flex-1">
            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
              Two-Factor Authentication
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Add an extra layer of security
            </p>
          </div>
          <div className="flex justify-end sm:justify-start">
            <label
              htmlFor="2fa-toggle"
              className={`relative inline-block w-12 h-7 sm:w-11 sm:h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                twoFactorEnabled ? "bg-[#029A9B]" : "bg-gray-300"
              }`}
            >
              <input
                type="checkbox"
                id="2fa-toggle"
                className="sr-only"
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              />
              <span
                className={`absolute left-0.5 top-0.5 w-6 h-6 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                  twoFactorEnabled ? "translate-x-5 sm:translate-x-5" : ""
                }`}
              />
            </label>
          </div>
        </div>

        {/* Showcase Room Visibility */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 sm:pb-5 gap-3 sm:gap-0">
          <div className="flex-1">
            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
              Showcase Room Visibility
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Control who can view your showcase rooms
            </p>
          </div>
          <div className="flex justify-end sm:justify-start">
            <div className="relative w-full sm:w-auto min-w-[140px] sm:min-w-[120px]" ref={dropdownRefs.showcase}>
              <button
                type="button"
                onClick={() => handleDropdownToggle('showcase')}
                className="w-full px-3 sm:px-4 py-2 sm:py-1 border border-gray-300 rounded-md text-sm sm:text-base bg-white text-left flex items-center justify-between hover:border-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors cursor-pointer"
              >
                <span className={showcaseVisibility ? "text-gray-900" : "text-gray-500"}>
                  {getSelectedLabel('showcase')}
                </span>
                <FiChevronDown 
                  className={`text-gray-400 transition-transform duration-200 ${
                    openDropdown === 'showcase' ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {openDropdown === 'showcase' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {visibilityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleDropdownSelect('showcase', option.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-1 text-left text-sm sm:text-base hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors cursor-pointer ${
                        showcaseVisibility === option.value 
                          ? 'bg-teal-50 text-teal-700 font-medium' 
                          : 'text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1">
            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
              Profile Visibility
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Control who can view your profile
            </p>
          </div>
          <div className="flex justify-end sm:justify-start">
            <div className="relative w-full sm:w-auto min-w-[140px] sm:min-w-[120px]" ref={dropdownRefs.profile}>
              <button
                type="button"
                onClick={() => handleDropdownToggle('profile')}
                className="w-full px-3 sm:px-4 py-2 sm:py-1 border border-gray-300 rounded-md text-sm sm:text-base bg-white text-left flex items-center justify-between hover:border-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors cursor-pointer"
              >
                <span className={profileVisibility ? "text-gray-900" : "text-gray-500"}>
                  {getSelectedLabel('profile')}
                </span>
                <FiChevronDown 
                  className={`text-gray-400 transition-transform duration-200 ${
                    openDropdown === 'profile' ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {openDropdown === 'profile' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {visibilityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleDropdownSelect('profile', option.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-1 text-left text-sm sm:text-base hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors cursor-pointer ${
                        profileVisibility === option.value 
                          ? 'bg-teal-50 text-teal-700 font-medium' 
                          : 'text-gray-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
