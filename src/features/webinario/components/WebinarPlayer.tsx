"use client";

import { Eye, Radio } from "lucide-react";
import Script from "next/script";
import { createElement, useEffect, useState } from "react";
import {
  WEBINAR_PLAYER_EMBED_ID,
  WEBINAR_PLAYER_SCRIPT_SRC,
  WEBINAR_VIDEO_ASPECT,
} from "../config";

interface WebinarPlayerProps {
  viewerCount: number;
  videoAreaRef?: React.RefObject<HTMLDivElement | null>;
}

export function WebinarPlayer({
  viewerCount,
  videoAreaRef,
}: WebinarPlayerProps) {
  const [videoAreaHeight, setVideoAreaHeight] = useState(0);

  // Mede a altura real da área de vídeo para limitar a altura no desktop
  useEffect(() => {
    const el = videoAreaRef?.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setVideoAreaHeight(el.clientHeight);
    });
    observer.observe(el);
    setVideoAreaHeight(el.clientHeight);
    return () => observer.disconnect();
  }, [videoAreaRef]);

  const aspectClass =
    WEBINAR_VIDEO_ASPECT === "1:1"
      ? "aspect-square"
      : WEBINAR_VIDEO_ASPECT === "4/5"
        ? "aspect-[4/5]"
        : "aspect-video";

  const maxWidth =
    WEBINAR_VIDEO_ASPECT === "1:1"
      ? 540
      : WEBINAR_VIDEO_ASPECT === "4/5"
        ? 440
        : 840;

  return (
    <div
      ref={videoAreaRef as React.Ref<HTMLDivElement>}
      className={`relative bg-black overflow-hidden flex-shrink-0 w-full ${aspectClass} lg:aspect-auto lg:flex-1 lg:flex lg:items-center lg:justify-center lg:p-6 min-h-0`}
    >
      {/* Scripts do VTurb Player */}
      <Script id="vturb-plt-init" strategy="afterInteractive">
        {`!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);`}
      </Script>
      <Script src={WEBINAR_PLAYER_SCRIPT_SRC} strategy="afterInteractive" />

      {/* Floating Badge AO VIVO (Premium) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-3 bg-gray-950/80 backdrop-blur-md border border-gray-800 rounded-full px-3 py-1.5 shadow-[var(--lc-shadow-sm)]">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Radio className="w-3 h-3" /> Ao vivo
          </span>
        </span>
        <span className="hidden sm:inline text-gray-300 text-xs border-l border-gray-800 pl-3">
          Supervisão de Casos · Dra. Tatiana Gontijo
        </span>
        <span className="text-gray-400 text-xs flex items-center gap-1.5 border-l border-gray-800 pl-3">
          <Eye className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-mono font-semibold text-gray-300 tabular-nums">
            {viewerCount}
          </span>
        </span>
      </div>

      {/* Player Wrapper com Proporção Dinâmica e posicionamento relativo */}
      <div
        className={`webinar-player-wrapper w-full ${aspectClass} relative`}
        style={{
          maxWidth,
          // Limita a altura máxima apenas no desktop para evitar transbordo vertical.
          // No mobile, ocupa 100% da altura do container aspect-ratio.
          maxHeight:
            typeof window !== "undefined" &&
            window.innerWidth >= 1024 &&
            videoAreaHeight > 0
              ? videoAreaHeight - 48
              : "100%",
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        {createElement("vturb-smartplayer", {
          id: WEBINAR_PLAYER_EMBED_ID,
          style: { display: "block", width: "100%", height: "100%" },
        })}
      </div>
    </div>
  );
}
