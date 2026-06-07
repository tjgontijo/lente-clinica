"use client";

import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { OFFER_CHECKOUT_URL, OFFER_INSTALLMENTS, OFFER_PRICE } from "../config";

interface WebinarOfferProps {
  minutesLeft: number;
  variant: "mobile" | "desktop";
}

export function WebinarOffer({ minutesLeft, variant }: WebinarOfferProps) {
  if (variant === "mobile") {
    return (
      <div className="lg:hidden px-4 py-3 bg-gradient-to-r from-purple-950 to-indigo-950 border-y border-purple-900/60 flex items-center justify-between gap-3 shrink-0 shadow-lg">
        <div className="min-w-0 flex flex-col justify-center">
          <span className="text-purple-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            Oferta Especial
          </span>
          <span className="text-white text-sm font-bold truncate">
            Lente Clínica — {OFFER_PRICE}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-purple-300 text-[11px] font-medium flex items-center gap-1 bg-purple-900/40 px-2 py-1 rounded-md border border-purple-800/30">
            <Clock className="w-3 h-3 text-purple-400" />
            {minutesLeft}m
          </span>
          <a
            href={OFFER_CHECKOUT_URL}
            className="rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-[0_0_12px_rgba(20,184,166,0.3)] hover:shadow-[0_0_16px_rgba(20,184,166,0.5)] flex items-center gap-1"
          >
            Garantir <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Desktop layout (for sidebar or page placement)
  return (
    <div className="hidden lg:block p-5 bg-gradient-to-b from-gray-900 to-indigo-950/40 border-t border-gray-900 flex-shrink-0 space-y-4">
      <div className="space-y-1">
        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Oportunidade Única
        </span>
        <h3 className="text-white text-base font-bold">
          Programa Lente Clínica
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed">
          Tenha acesso completo à supervisão de casos clínicos e guias práticos.
        </p>
      </div>

      <div className="flex justify-between items-baseline border-t border-gray-800/60 pt-3">
        <div className="flex flex-col">
          <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
            Valor Especial
          </span>
          <span className="text-white text-lg font-extrabold tracking-tight">
            {OFFER_PRICE}
          </span>
        </div>
        <div className="text-right">
          <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold block">
            Ou parcelado
          </span>
          <span className="text-purple-300 text-xs font-bold">
            {OFFER_INSTALLMENTS}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        <a
          href={OFFER_CHECKOUT_URL}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] transition-all px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_16px_rgba(20,184,166,0.2)] hover:shadow-[0_0_24px_rgba(20,184,166,0.4)]"
        >
          Garantir Acesso Agora <ArrowRight className="w-4 h-4" />
        </a>

        <div className="flex items-center justify-center gap-1.5 text-purple-300 text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>A oferta encerra em {minutesLeft} minutos</span>
        </div>
      </div>
    </div>
  );
}
