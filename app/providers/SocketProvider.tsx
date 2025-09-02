'use client';

import { useEffect } from "react";
import { io } from "socket.io-client";
import { addMessage, setOnlineUsers, setSocket } from "../store/slices/socketSlice";
import { useAppDispatch, useAppSelector } from "../store/reduxHook";

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { userId } = useAppSelector(state => state.user);

    useEffect(() => {
        if (!userId) return;

        const socket = io("http://38.242.230.126:4334", {
            transports: ['websocket'],
            autoConnect: true
        });

        socket.on('connect', () => {
            console.log('Connected to socket server, SID:', socket.id);
            socket.emit('set-user', userId);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Listen for incoming messages
        socket.on("chatMsg", (data) => {
            console.log('Received message:', data);
            dispatch(addMessage({ roomId: data.roomId, message: data }));
        });

        // Listen for online users
        socket.on("onlineStatus", (users) => {
            console.log('Online users updated:', users);
            dispatch(setOnlineUsers(users));
        });

        // Listen for room creation confirmation
        socket.on('room-created', (roomData) => {
            console.log('Room created:', roomData);
        });

        dispatch(setSocket(socket));

        return () => {
            socket.disconnect();
        };
    }, [dispatch, userId]);

    return <>{children}</>;
}
