"use client";

import { ArrowDown, MessageSquare, SendHorizontal, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../chat-script";

interface WebinarChatProps {
  messages: ChatMessage[];
  userName: string | null;
  onSaveName: (name: string) => void;
  onSendMessage: (text: string) => void;
}

// Mapeia classes de gradiente estéticas e premium de forma determinista para avatares
const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-purple-500 to-indigo-600",
  "bg-gradient-to-br from-blue-500 to-cyan-600",
  "bg-gradient-to-br from-teal-500 to-emerald-600",
  "bg-gradient-to-br from-rose-500 to-red-600",
  "bg-gradient-to-br from-amber-500 to-orange-600",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-indigo-500 to-violet-600",
];

function getAvatarGradient(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

export function WebinarChat({
  messages,
  userName,
  onSaveName,
  onSendMessage,
}: WebinarChatProps) {
  const [nameInput, setNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Rolagem inteligente para o fundo
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
    setIsAtBottom(true);
    setHasNewMessages(false);
  }, []);

  // Detecta se o usuário rolou para cima
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const offset = el.scrollHeight - el.scrollTop - el.clientHeight;
    // Se estiver a menos de 120px do fundo, considera que está no fundo
    const closeToBottom = offset < 120;
    setIsAtBottom(closeToBottom);

    if (closeToBottom) {
      setHasNewMessages(false);
    }
  }, []);

  // Monitora novas mensagens
  useEffect(() => {
    if (messages.length === 0) return;

    if (isAtBottom) {
      // Pequeno timeout para garantir que o DOM renderizou o novo nó
      const timeout = setTimeout(() => scrollToBottom("smooth"), 100);
      return () => clearTimeout(timeout);
    }

    setHasNewMessages(true);
  }, [messages.length, isAtBottom, scrollToBottom]);

  // Rola para baixo no carregamento inicial
  useEffect(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onSaveName(nameInput.trim());
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    onSendMessage(messageInput.trim());
    setMessageInput("");
    // Rola imediatamente após o usuário enviar sua mensagem
    setTimeout(() => scrollToBottom("smooth"), 50);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-950/40 relative">
      {/* Header do Chat */}
      <div className="px-4 py-2.5 border-b border-gray-900 flex items-center gap-2 flex-shrink-0 bg-gray-950/60 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
          Chat ao vivo
        </span>
        <span className="ml-auto text-gray-500 text-[10px] font-mono">
          {messages.length} msgs
        </span>
      </div>

      {/* Lista de Mensagens (Layout Inline de Streaming) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-800"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex gap-2.5 items-start py-0.5 px-1 rounded hover:bg-gray-900/20 transition-colors animate-in fade-in slide-in-from-bottom-1 duration-200"
          >
            {/* Avatar pequeno em círculo com gradiente */}
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full ${
                msg.isUser
                  ? "bg-gradient-to-br from-teal-400 to-emerald-600"
                  : getAvatarGradient(msg.name)
              } flex items-center justify-center text-white text-[9px] font-extrabold shadow-sm`}
            >
              {msg.avatar}
            </div>

            {/* Nome e Mensagem INLINE (Estilo YouTube/Twitch) */}
            <div className="min-w-0 text-sm leading-relaxed">
              <span
                className={`font-bold mr-2 text-xs tracking-wide ${
                  msg.isUser ? "text-[var(--lc-teal-400)]" : "text-purple-400"
                }`}
              >
                {msg.isUser ? "Você" : msg.name}
              </span>
              <span className="text-gray-300 break-words">{msg.message}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Alerta de novas mensagens flutuante */}
      {!isAtBottom && hasNewMessages && (
        <button
          type="button"
          onClick={() => scrollToBottom("smooth")}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-[var(--lc-teal-500)]/30 animate-bounce duration-1000 transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" /> Novas mensagens abaixo
        </button>
      )}

      {/* Form de Ação Fixo no Bottom */}
      <div className="p-3 border-t border-gray-900 bg-gray-950/95 backdrop-blur-md flex-shrink-0 sticky bottom-0 z-10">
        {!userName ? (
          <form
            onSubmit={handleSubmitName}
            className="flex flex-col gap-2 p-0.5"
          >
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>Participe da conversa</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Seu nome para o chat..."
                maxLength={24}
                className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--lc-teal-600)] focus:ring-1 focus:ring-[var(--lc-teal-600)] transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" /> Entrar
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitMessage} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              maxLength={200}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--lc-teal-600)] focus:ring-1 focus:ring-[var(--lc-teal-600)] transition-all"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="px-3.5 bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center justify-center"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
