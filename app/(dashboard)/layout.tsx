"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar/Sidebar";
import Cookies from "js-cookie";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? Cookies.get("tb_userId") : null;
    if (!token) {
      router.replace('/login');
    } else {
      setIsReady(true);
    }
  }, [router]);



   useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
        }
      };
      handleResize(); // call on mount
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!isReady) return null;

  return (
    <div className="flex min-h-screen bg-white">
   <aside className={`fixed top-0 left-0 h-screen  z-50 w-64  transition-all duration-300 ${isCollapsed ? "w-20" : "w-24"}`}>
      <Sidebar />
    </aside>
    <main className={`flex-1 p-6 ${isCollapsed ? "ml-20" : "ml-64"}`}>{children}</main>
  </div>
  );
}
