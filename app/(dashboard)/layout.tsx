"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tb_token') : null;
    if (!token) {
      router.replace('/login');
    } else {
      setIsReady(true);
    }
  }, [router]);

  if (!isReady) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
    <aside className="fixed top-0 left-0 h-screen w-[250px] border-r bg-white z-50">
      <Sidebar />
    </aside>
    <main className="ml-[250px] flex-1 p-6">{children}</main>
  </div>
  );
}
