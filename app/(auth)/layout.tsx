"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function GoogleProviders({ children }: { children: React.ReactNode }) {
  const clientId ="922454428372-6monhp467thiv415r4ht7ifc6cbus463.apps.googleusercontent.com922454428372-6monhp467thiv415r4ht7ifc6cbus463.apps.googleusercontent.com ";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </GoogleOAuthProvider>
  );
}
