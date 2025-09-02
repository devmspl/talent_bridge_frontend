

'use client';

import GoogleProviders from "./(auth)/layout";
import ReduxProvider from "./providers/ReduxProvider";
import SocketProvider from "./providers/SocketProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            <GoogleProviders>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </GoogleProviders>
        </ReduxProvider>
    )
}