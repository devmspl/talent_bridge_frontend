"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function GoogleProviders({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "604677003417-g4pf3ok612t7u940kge1d1hj686m4uc9.apps.googleusercontent.com";
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </GoogleOAuthProvider>
  );
}
