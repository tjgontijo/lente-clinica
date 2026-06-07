"use client";

import { useEffect, useRef, useState } from "react";
import { WebinarChat } from "./components/WebinarChat";
import { WebinarOffer } from "./components/WebinarOffer";
import { WebinarPlayer } from "./components/WebinarPlayer";
import { OFFER_RELEASE_SECONDS, OFFER_WINDOW_MINUTES } from "./config";
import { useWebinarChat } from "./hooks/use-webinar-chat";

type SmartPlayerInstance = {
  video?: { currentTime?: number };
  on?: (event: "timeupdate", callback: () => void) => void;
  off?: (event: "timeupdate", callback: () => void) => void;
};

declare global {
  interface Window {
    smartplayer?: { instances?: SmartPlayerInstance[] };
  }
}

export function WebinarRoom() {
  const [videoSeconds, setVideoSeconds] = useState(0);
  const [isOfferVisible, setIsOfferVisible] = useState(false);
  const [offerMinutesLeft, setOfferMinutesLeft] =
    useState(OFFER_WINDOW_MINUTES);
  const [isMobile, setIsMobile] = useState(false);

  const videoAreaRef = useRef<HTMLDivElement>(null);
  const offerRevealedAt = useRef<number | null>(null);

  const { userName, saveName, sendMessage, allMessages, viewerCount } =
    useWebinarChat(videoSeconds);

  // Detecta se é mobile para renderização condicional rígida dos componentes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bloqueia scroll do body — a página deve ocupar exatamente 100dvh da tela do celular
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    };
  }, []);

  // Oferta countdown
  useEffect(() => {
    if (!isOfferVisible) return;
    const interval = setInterval(() => {
      if (offerRevealedAt.current === null) return;
      const elapsed = Math.floor(
        (Date.now() - offerRevealedAt.current) / 1000 / 60,
      );
      setOfferMinutesLeft(Math.max(0, OFFER_WINDOW_MINUTES - elapsed));
    }, 10000);
    return () => clearInterval(interval);
  }, [isOfferVisible]);

  // VTurb player listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cleanup: (() => void) | null = null;

    const unlockOffer = () => {
      setIsOfferVisible(true);
      offerRevealedAt.current = Date.now();
    };

    const tryAttach = () => {
      const player = window.smartplayer?.instances?.[0];
      if (!player?.on) return false;

      const handleTimeUpdate = () => {
        const t = player.video?.currentTime ?? 0;
        setVideoSeconds(t);

        // Em preview=true, desbloqueia oferta em 10 segundos para testes rápidos.
        // Em produção segue o OFFER_RELEASE_SECONDS (15 min).
        const isPreview =
          new URLSearchParams(window.location.search).get("preview") === "true";
        const releaseTime = isPreview ? 10 : OFFER_RELEASE_SECONDS;

        if (t >= releaseTime) {
          unlockOffer();
        } else {
          // Garante que se o usuário reiniciar o vídeo do início, a oferta seja ocultada
          setIsOfferVisible(false);
        }
      };

      player.on("timeupdate", handleTimeUpdate);
      handleTimeUpdate();

      cleanup = () => player.off?.("timeupdate", handleTimeUpdate);
      return true;
    };

    if (tryAttach()) return () => cleanup?.();

    const poll = setInterval(() => {
      if (tryAttach()) clearInterval(poll);
    }, 500);

    return () => {
      clearInterval(poll);
      cleanup?.();
    };
  }, []);

  return (
    <div className="h-[100dvh] overflow-hidden bg-gray-950 text-white flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Lado Esquerdo / Topo: Player do Vídeo */}
        <WebinarPlayer viewerCount={viewerCount} videoAreaRef={videoAreaRef} />

        {/* Oferta no Mobile — Exibida logo abaixo do vídeo e acima do chat */}
        {isOfferVisible && isMobile && (
          <WebinarOffer minutesLeft={offerMinutesLeft} variant="mobile" />
        )}

        {/* Lado Direito: Chat e Oferta no Desktop */}
        <div className="flex-1 lg:flex-none w-full lg:w-80 xl:w-96 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-900 min-h-0">
          <WebinarChat
            messages={allMessages}
            userName={userName}
            onSaveName={saveName}
            onSendMessage={sendMessage}
          />

          {/* Oferta no Desktop — Acoplada abaixo do chat na barra lateral */}
          {isOfferVisible && !isMobile && (
            <WebinarOffer minutesLeft={offerMinutesLeft} variant="desktop" />
          )}
        </div>
      </div>
    </div>
  );
}
