"use client";

import { AlertCircle, Calendar, Check, Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCountdown, getNextSession } from "./webinar-schedule";

interface WebinarCountdownProps {
  onSessionStart: () => void;
}

export function WebinarCountdown({ onSessionStart }: WebinarCountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [sessionDate, setSessionDate] = useState<string>("");

  useEffect(() => {
    function tick() {
      const session = getNextSession();

      if (session.status === "live" || session.status === "offer") {
        onSessionStart();
        return;
      }

      setSecondsLeft(session.secondsUntilStart);

      const formatter = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo",
      });
      setSessionDate(formatter.format(session.startsAt));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [onSessionStart]);

  if (secondsLeft === null) return null;

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] lc-grid-pattern pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--lc-teal-600)]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        {/* Logo / Brand */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5 text-[var(--lc-teal-400)] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Sessão Ao Vivo
          </span>
          <h1 className="text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
            Supervisão de Casos Clínicos
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            com{" "}
            <span className="text-gray-200 font-medium">
              Dra. Tatiana Gontijo
            </span>
          </p>
        </div>

        {/* Countdown Card */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/80 rounded-2xl p-8 md:p-10 space-y-5 shadow-2xl relative">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--lc-teal-500)]/50 to-transparent" />

          <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-[var(--lc-teal-400)]" /> A sessão
            começa em
          </p>
          <div className="text-white text-6xl md:text-7xl font-mono font-bold tracking-tight tabular-nums animate-pulse drop-shadow-[0_0_12px_rgba(255,255,255,0.05)]">
            {formatCountdown(secondsLeft)}
          </div>
          <div className="text-gray-400 text-sm flex items-center justify-center gap-1.5 border-t border-gray-800/50 pt-4 capitalize">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{sessionDate}</span>
          </div>
        </div>

        {/* Vagas Alert (Premium Amber) */}
        <div className="inline-flex items-center gap-2 bg-[var(--lc-amber-50)]/5 border border-[var(--lc-amber-300)]/20 rounded-full px-4 py-2 text-[var(--lc-amber-400)] text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lc-amber-400)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--lc-amber-500)]"></span>
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> 30 vagas disponíveis nesta
            sessão
          </span>
        </div>

        {/* O que vai acontecer */}
        <div className="text-left space-y-4 bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800/60 shadow-lg">
          <p className="text-white font-bold text-sm tracking-wide">
            Nesta sessão você vai ver:
          </p>
          <ul className="space-y-3 text-gray-400 text-sm">
            {[
              "Um caso clínico real aberto ao vivo na plataforma Lente Clínica.",
              'Como reconhecer quando uma "melhora" pode ser sinal de crise.',
              "O modelo exato de comunicação com o psiquiatra.",
            ].map((text) => (
              <li key={text} className="flex gap-2.5 items-start">
                <span className="text-[var(--lc-teal-500)] mt-0.5 bg-[var(--lc-teal-500)]/10 p-0.5 rounded flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-gray-600 text-xs">
          Esta página atualiza automaticamente quando a sessão começar.
        </p>
      </div>
    </div>
  );
}
