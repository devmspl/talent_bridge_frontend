"use client";
import React, { useEffect, useState } from "react";
import { FiMoreHorizontal, FiSearch } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import Avatar from "@/app/component/Avatar";
import Profile from "@/public/assets/profile/Avatar.png";
import DashboardIcon from "@/public/assets/icons/home-2.svg";
import showcase from "@/public/assets/icons/tv.svg";
import network from "@/public/assets/icons/users-plus.svg";
import message from "@/public/assets/icons/Vector.svg";
import bell from "@/public/assets/icons/bell-3 (1).png";
import notification from "@/public/assets/icons/Setting.svg";
import log_in from "@/public/assets/icons/log-in-2.svg";
import stars from "@/public/assets/icons/Featured icon.png";
import { toast } from "react-toastify";
import { useGetUserByIdQuery } from "@/app/store/api/userApi";
import Cookies from "js-cookie";

const SidebarItem = ({
  icon,
  label,
  href,
  active,
  isCollapsed,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  isCollapsed: boolean;
}) => (
  <Link href={href}>
    <div
      className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${active ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
        }`}
    >
      <span className="text-lg">{icon}</span>
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </div>
  </Link>
);

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const routes = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Automatically collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    try {
      Cookies.remove("tb_token");
      Cookies.remove("tb_userId");
      toast.success("Logged out");
    } catch { }
    routes.replace("/auth");
  };

  const userId = Cookies.get("tb_userId");
  const { data: user } = useGetUserByIdQuery(userId!, {
    skip: !userId,
    pollingInterval: 10000,
  });

  

  return (
    <aside
      className={`bg-white border-r border-gray-200 p-4 flex flex-col justify-between transition-all duration-300 
      ${isCollapsed ? "w-20" : "w-70"} min-h-screen`}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Avatar
              avatar={user?.avatar}
              avatarSvg={user?.avatarSvg}
              width={32}
              height={32}
              alt="avatar"
              className="w-10 h-10 rounded-full"
              fallbackImage={Profile}
            />

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullname || "John Doe"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "jhdoe@tbridge.com"}
              </p>
            </div>
          </div>

          {/* <FiMoreHorizontal className="hidden sm:block text-gray-500" /> */}
        </div>

        {!isCollapsed && (
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 text-sm border rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 border-b border-gray-200"
            />
          </div>
        )}

        <nav className="flex flex-col space-y-2 text-sm">
          <SidebarItem
            icon={<Image src={DashboardIcon} alt="Dashboard" width={20} height={20} />}
            label="Dashboard"
            href="/dashboard"
            active={pathname === "/dashboard"}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Image src={showcase} alt="Showcase" width={20} height={20} />}
            label="Showcase rooms"
            href="/showcase-rooms"
            active={pathname === "/showcase-rooms"}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Image src={network} alt="Network" width={20} height={20} />}
            label="Network"
            href="/network"
            active={pathname === "/network"}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Image src={message} alt="Smart Outreach" width={20} height={20} />}
            label="Smart Outreach"
            href="/smart-outreach"
            active={pathname === "/smart-outreach"}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Image src={bell} alt="Notifications" width={20} height={20} />}
            label="Notifications"
            href="/notifications"
            active={pathname === "/notifications"}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Image src={notification} alt="Settings" width={20} height={20} />}
            label="Settings"
            href="/settings"
            active={pathname === "/settings"}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>

      <div className="space-y-6">
        {!isCollapsed && (
          <div className="relative bg-[#f0fdfc] rounded-xl px-4 py-5 text-center ">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <div className="w-10 h-10 rounded-full bg-[#ccfbf1] flex items-center justify-center">
                <Image src={stars} alt="" width={48} />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">Upgrade to Pro</h3>
              <p className="text-sm text-gray-600 mt-2">
                Upgrade to Pro for uninterrupted access to premium features and enhanced benefits. Don&apos;t miss out!
              </p>
              <button className="mt-4 w-full text-sm border border-gray-300 rounded-md py-2 hover:bg-gray-100">
                Upgrade
              </button>
            </div>
          </div>
        )}
        <button
          className="w-full flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200"
          onClick={handleLogout}
        >
          <span className="text-lg">
            <Image src={log_in} alt="logout icon" width={20} />
          </span>
          {!isCollapsed && <span className="ml-3">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
