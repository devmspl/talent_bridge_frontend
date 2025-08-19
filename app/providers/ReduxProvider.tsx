'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';

export default function ReduxProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  return <Provider store={store}>{children}</Provider>;
} 