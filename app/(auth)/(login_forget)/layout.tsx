// app/providers.tsx
"use client";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SessionProvider } from "next-auth/react"; // agar NextAuth use kar raha ho to

export default function GoogleProviders({ children }: { children: React.ReactNode }) {
    console.log("process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID",process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </GoogleOAuthProvider>
  );
}
