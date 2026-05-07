"use client";

const STORAGE_KEY = "reala.chat.pending-launches";
const MAX_AGE_MS = 5 * 60 * 1000;

export type PendingChatLaunch = {
  chatId: string;
  initialPrompt: string;
  initialMessageId?: string;
  selectedChatModel: string;
  createdAt: number;
};

function readPendingLaunches() {
  if (typeof window === "undefined") {
    return {} as Record<string, PendingChatLaunch>;
  }

  const rawValue = window.sessionStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return {} as Record<string, PendingChatLaunch>;
  }

  try {
    return JSON.parse(rawValue) as Record<string, PendingChatLaunch>;
  } catch {
    return {} as Record<string, PendingChatLaunch>;
  }
}

function writePendingLaunches(launches: Record<string, PendingChatLaunch>) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(launches));
}

export function stashPendingChatLaunch(launch: PendingChatLaunch) {
  const launches = readPendingLaunches();
  launches[launch.chatId] = launch;
  writePendingLaunches(launches);
}

export function peekPendingChatLaunch(chatId: string) {
  const launches = readPendingLaunches();
  const launch = launches[chatId];

  if (!launch) {
    return null;
  }

  if (Date.now() - launch.createdAt > MAX_AGE_MS) {
    delete launches[chatId];
    writePendingLaunches(launches);
    return null;
  }

  return launch;
}

export function consumePendingChatLaunch(chatId: string) {
  const launches = readPendingLaunches();
  const launch = launches[chatId];

  if (!launch) {
    return null;
  }

  delete launches[chatId];
  writePendingLaunches(launches);

  if (Date.now() - launch.createdAt > MAX_AGE_MS) {
    return null;
  }

  return launch;
}
