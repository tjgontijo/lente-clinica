"use client";

import { useEffect, useState } from "react";
import { CHAT_MESSAGES, type ChatMessage } from "../chat-script";

const USER_NAME_KEY = "webinario-lente-clinica:user-name";

function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function useWebinarChat(videoSeconds: number) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(25);

  // Carrega nome salvo no localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(USER_NAME_KEY);
      if (saved) setUserName(saved);
    }
  }, []);

  // Oscilação realista de espectadores "Ao Vivo"
  useEffect(() => {
    const baseViewer = 23 + Math.floor(Math.random() * 8);
    setViewerCount(baseViewer);

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        // Mantém entre 20 e 35
        const next = prev + delta;
        if (next < 20) return 21;
        if (next > 35) return 34;
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const saveName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USER_NAME_KEY, trimmed);
    }
    setUserName(trimmed);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !userName) return;

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      seconds: videoSeconds,
      name: userName,
      avatar: getInitials(userName),
      message: trimmed,
      isUser: true,
    };

    setUserMessages((prev) => [...prev, newMsg]);
  };

  // Filtra mensagens simuladas e junta com as do usuário, ordenando por tempo
  const visibleSimulated = CHAT_MESSAGES.filter(
    (m) => m.seconds <= videoSeconds,
  );
  const allMessages = [...visibleSimulated, ...userMessages].sort(
    (a, b) => a.seconds - b.seconds,
  );

  return {
    userName,
    saveName,
    sendMessage,
    allMessages,
    viewerCount,
  };
}
