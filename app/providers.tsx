

'use client';

import GoogleProviders from "./(auth)/layout";
import ReduxProvider from "./providers/ReduxProvider";
import SocketProvider from "./providers/SocketProvider";
import { PostHogProvider } from './providers/PostHogProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            <GoogleProviders>
                <PostHogProvider>
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </PostHogProvider>
            </GoogleProviders>
        </ReduxProvider>
    )
}