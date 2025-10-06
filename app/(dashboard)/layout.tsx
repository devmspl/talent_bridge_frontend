"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../component/sidebar/Sidebar";
import Header from "../component/header/Header";
import Cookies from "js-cookie";
import { useGetUserByIdQuery } from "../store/api/userApi";
import Image, { StaticImageData } from "next/image";
import Profile from "@/public/assets/profile/Avatar.png";
import stars from "@/public/assets/icons/Featured icon.png";
import logout from "@/public/assets/icons/log-in-2.svg";
import bellIcon from "@/public/assets/icons/bell-3.png";
import DashboardIcon from "@/public/assets/icons/home-2.svg";
import showcase from "@/public/assets/icons/tv.svg";
import network from "@/public/assets/icons/users-plus.svg";
import message from "@/public/assets/icons/Vector.svg";
import bell from "@/public/assets/icons/bell-3 (1).png";
import notification from "@/public/assets/icons/Setting.svg";
import Link from "next/link";
import logo from "@/public/assets/icons/logo.svg";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userId = Cookies.get("tb_userId");
  const { data: user } = useGetUserByIdQuery(userId!, {
    skip: !userId,
    pollingInterval: 10000,
  });

  const getAvatar = (
    avatar?: string | null
  ): string | StaticImageData => {
    if (!avatar) return Profile; // fallback image

    if (avatar.startsWith("https://lh3.googleusercontent.com/")) {
      return avatar; // Google direct URL
    }

    if (avatar.startsWith("http")) {
      return avatar; // any other full URL
    }

    return `https://backend.webridgetalent.com/assets/images/${avatar}`;
  };

  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(Profile);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? Cookies.get("tb_userId") : null;
    if (!token) {
      router.replace('/login');
    } else {
      setIsReady(true);
    }
  }, [router]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Clear all cookies
    Cookies.remove("tb_userId");
    Cookies.remove("tb_token");
    Cookies.remove("user");
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.clear();
    }
    
    // Redirect to login page
    router.push('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setImgSrc(getAvatar(user?.avatar));
  }, [user?.avatar]);

  if (!isReady) return null;


  return (
    <div className="flex min-h-screen ">
      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <aside className={`hidden lg:block fixed top-0 left-0 h-screen z-30 transition-all duration-300 ${isCollapsed ? "w-20" : "w-70"
        }`}>
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay - Only on mobile/tablet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 h-full w-full bg-white shadow-2xl">
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className=" flex items-center justify-center">
                    <Image
                      src={logo}
                      alt="TalentBridge Logo"
                      width={32}
                      height={32}
                      className=" "
                    />
                  </div>
                  <h1 className="text-lg font-semibold text-gray-800">
                    TalentBridge
                  </h1>
                </div>
                <div className="flex items-center space-x-3">
                  {/* <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Image src={bellIcon} alt="Notifications" width={20} height={20} />
                  </button> */}
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Main Navigation */}
              <div className="flex-1">
                <div className="mb-6">
                  {/* <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">MAIN</h3> */}
                  <nav className="space-y-2">
                    <Link
                      href="/dashboard"
                      onClick={handleLinkClick}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${pathname === "/dashboard"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <Image src={DashboardIcon} alt="Dashboard" width={20} height={20} />
                      <span className="ml-3 font-medium">Dashboard</span>
                    </Link>
                    <Link
                      href="/showcase-rooms"
                      onClick={handleLinkClick}
                      className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Image src={showcase} alt="Showcase" width={20} height={20} />
                      <span className="ml-3 font-medium">Showcase rooms</span>
                    </Link>
                    <Link
                      href="/network"
                      onClick={handleLinkClick}
                      className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Image src={network} alt="Network" width={20} height={20} />
                      <span className="ml-3 font-medium">Network</span>
                    </Link>
                    <Link
                      href="/smart-outreach"
                      onClick={handleLinkClick}
                      className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Image src={message} alt="Smart Outreach" width={20} height={20} />
                      <span className="ml-3 font-medium">Smart Outreach</span>
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={handleLinkClick}
                      className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Image src={bell} alt="Notifications" width={20} height={20} />
                      <span className="ml-3 font-medium">Notifications</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={handleLinkClick}
                      className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Image src={notification} alt="Settings" width={20} height={20} />
                      <span className="ml-3 font-medium">Settings</span>
                    </Link>
                  </nav>
                </div>

                {/* <div className="mb-6">
                  <nav className="space-y-2">
                     <Link
                       href="/notifications"
                       className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                     >
                       <Image src={bell} alt="Notifications" width={20} height={20} />
                       <span className="ml-3 font-medium">Notifications</span>
                     </Link>
                     <Link
                       href="/settings"
                       className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                     >
                       <Image src={notification} alt="Settings" width={20} height={20} />
                       <span className="ml-3 font-medium">Settings</span>
                     </Link>
                  </nav>
                </div> */}
                <div className="relative bg-[#f0fdfc] rounded-xl px-4 py-5 text-center mt-5 ">
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
              </div>

              {/* User Profile Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Image
                          src={imgSrc}
                          width={32}
                          height={32}
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullname || "John Doe"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || "jhdoe@tbridge.com"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <Image src={logout} alt="logout icon" width={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-70"
        }`}>
        {/* Header - Only visible on mobile/tablet */}
        <div className="lg:hidden">
          <Header
            onMenuToggle={handleMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}