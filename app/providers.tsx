

'use client';

import GoogleProviders from "./(auth)/layout";
import ReduxProvider from "./providers/ReduxProvider";
import { PostHogProvider } from './providers/PostHogProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            <GoogleProviders>
                <PostHogProvider>
                        {children}
                </PostHogProvider>
            </GoogleProviders>
        </ReduxProvider>
    )
}