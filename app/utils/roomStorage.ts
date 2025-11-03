"use client";

type JsonValue = any;

const isBrowser = typeof window !== "undefined";

export function lsGet<T = JsonValue>(key: string, fallback: T): T {
  try {
    if (!isBrowser) return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function lsSet<T = JsonValue>(key: string, value: T): void {
  try {
    if (!isBrowser) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const ROOM_KEYS = {
  intro: "newRoomIntro",
  competencies: "selectedCompetencies",
  insights: "insightsData",
} as const;

export type NewRoomIntro = {
  roomName: string;
  roomSummary: string;
  role: string;
  qualification?: string;
};

export type InsightItem = {
  title: string;
  description: string;
  tag: string;
  files?: Array<{
    name: string;
    size: number;
    type: string;
    data: string; // base64 data URL
  }>;
};

export type InsightsData = {
  companyName: string;
  website: string;
  industry: string;
  duration: string;
  teamSize: string;
  summary: string;
  technicalSkills: string[];
  transferableSkills: string[];
  insights: InsightItem[];
  currentFormFiles?: Array<{
    name: string;
    size: number;
    type: string;
    data: string; // base64 data URL
  }>; // Files in current form that haven't been added to an insight yet
};

// Clear all room-related localStorage data when starting a new room
export function clearRoomData(): void {
  try {
    if (!isBrowser) return;
    window.localStorage.removeItem(ROOM_KEYS.intro);
    window.localStorage.removeItem(ROOM_KEYS.competencies);
    window.localStorage.removeItem(ROOM_KEYS.insights);
  } catch {
    // ignore
  }
}


