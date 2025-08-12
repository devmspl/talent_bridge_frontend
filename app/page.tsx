"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isLogin = true;

  useEffect(() => {
    if (isLogin) {
      router.push("/auth");
    }
  }, [isLogin, router]);

  return null;
}
