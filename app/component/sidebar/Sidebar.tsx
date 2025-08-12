"use client";
import React from "react";
import {
  FiSearch,
  FiHome,
  FiTv,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiMoreHorizontal,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Profile from "@/public/assets/profile/user.png";
import DashboardIcon from "@/public/assets/icons/home-2.png";
import showcase from "@/public/assets/icons/tv.png";
import network from "@/public/assets/icons/users-plus.png";
import message from "@/public/assets/icons/message-1.png";
import bell from "@/public/assets/icons/bell-3 (1).png";
import notification from "@/public/assets/icons/setting.png";
import log_in from "@/public/assets/icons/log-in-2.png";
import stars from "@/public/assets/icons/Featured icon.png";
import { toast } from "react-toastify";

const SidebarItem = ({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}) => (
  <Link href={href}>
    <div
      className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
        active
          ? "bg-gray-100 text-gray-900 font-medium"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span>{label}</span>
    </div>
  </Link>
);

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const routes = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem("tb_token");
      localStorage.removeItem("user");
      toast.success("Logged out");
    } catch {}
    routes.replace("/auth");
  };
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Image
              src={
                user?.avatar
                  ? `http://38.242.230.126:5832/assets/images/${user.avatar}`
                  : Profile
              }
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.fullname || "John Doe"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "jhdoe@tbridge.com"}
              </p>
            </div>
          </div>
          <FiMoreHorizontal className="text-gray-500" />
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 text-sm border rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 border-b border-gray-200"
          />
        </div>

        <nav className="flex flex-col space-y-2 text-sm">
          <SidebarItem
            icon={
              <Image
                src={DashboardIcon}
                alt="Dashboard"
                width={20}
                height={20}
              />
            }
            label="Dashboard"
            href="/dashboard"
            active={pathname === "/dashboard"}
          />
          <SidebarItem
            icon={
              <Image src={showcase} alt="Dashboard" width={20} height={20} />
            }
            label="Showcase rooms"
            href="/showcase-rooms"
            active={pathname === "/showcase-rooms"}
          />
          <SidebarItem
            icon={
              <Image src={network} alt="Dashboard" width={20} height={20} />
            }
            label="Network"
            href="/network"
            active={pathname === "/network"}
          />
          <SidebarItem
            icon={
              <Image src={message} alt="Dashboard" width={20} height={20} />
            }
            label="Smart Outreach"
            href="/smart-outreach"
            active={pathname === "/smart-outreach"}
          />
          <SidebarItem
            icon={<Image src={bell} alt="Dashboard" width={20} height={20} />}
            label="Notifications"
            href="/notifications"
            active={pathname === "/notifications"}
          />
          <SidebarItem
            icon={
              <Image
                src={notification}
                alt="Dashboard"
                width={20}
                height={20}
              />
            }
            label="Settings"
            href="/settings"
            active={pathname === "/settings"}
          />
        </nav>
      </div>

      <div className="space-y-6">
        <div className="relative bg-[#f0fdfc] rounded-xl px-4 py-5 text-center ">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="w-10 h-10 rounded-full bg-[#ccfbf1] flex items-center justify-center">
              <Image src={stars} alt="" width={48} />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Upgrade to Pro
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Upgrade to Pro for uninterrupted access to premium features and
              enhanced benefits. Don&apos;t miss out!
            </p>

            <button className="mt-4 w-full text-sm border border-gray-300 rounded-md py-2 hover:bg-gray-100">
              Upgrade
            </button>
          </div>
        </div>
        <button
          className="w-full flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200"
          onClick={handleLogout}
        >
          <span className="mr-3 text-lg">
            <Image src={log_in} alt="logout icon" width={20} />
          </span>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
