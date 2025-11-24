"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useGetUserByIdQuery } from "@/app/store/api/userApi";
import Cookies from "js-cookie";
import Profile from "@/public/assets/profile/Avatar.png";
import bellIcon from "@/public/assets/icons/bell-3.png";
import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = Cookies.get("tb_userId");
  const router = useRouter();
  const { data: user } = useGetUserByIdQuery(userId!, {
    skip: !userId,
    pollingInterval: 10000,
  });

  const getAvatar = (
    avatar?: string | null
  ): string | StaticImageData => {
    if (!avatar) return Profile;
    if (avatar.startsWith("https://lh3.googleusercontent.com/")) {
      return avatar;
    }
    if (avatar.startsWith("http")) {
      return avatar;
    }
    return `https://backend.webridgetalent.com/assets/images/${avatar}`;
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (onMenuToggle) {
      onMenuToggle();
    }
  };
  const handleNotificationClick = () => {
    router.push("/notifications");
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Left side - Greeting */}
      <div className="flex items-center">
        <Link href="/" className="text-lg font-semibold text-gray-800">
          Hello {user?.fullName?.split(' ')[0] || 'User'}, 👋
        </Link>
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={handleNotificationClick}>
            <Image 
              src={bellIcon} 
              alt="Notifications" 
              width={20} 
              height={20}
              className="text-gray-600"
            />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
        </div>

        {/* Hamburger Menu */}
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          onClick={handleMenuToggle}
        >
          <svg 
            className="w-6 h-6 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;