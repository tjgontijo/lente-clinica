import { Copy, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MessageGeneratorProps {
  initialMessage: string;
  urgencyLevel: "YELLOW" | "RED";
  onCopy?: () => void;
  onSend?: () => void;
}

export function MessageGenerator({
  initialMessage,
  urgencyLevel,
  onCopy,
  onSend,
}: MessageGeneratorProps) {
  const [message, setMessage] = useState(initialMessage);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    onCopy?.();
  };

  return (
    <Card className="lc-card p-0 overflow-hidden max-w-[520px]">
      <div
        className={
          urgencyLevel === "RED"
            ? "bg-[var(--lc-red-50)] px-5 py-3 border-b border-[var(--lc-red-200)]"
            : "bg-[var(--lc-amber-50)] px-5 py-3 border-b border-[var(--lc-amber-200)]"
        }
      >
        <div className="flex items-center gap-2">
          <div
            className={
              urgencyLevel === "RED"
                ? "w-2 h-2 rounded-full bg-[var(--lc-red-500)]"
                : "w-2 h-2 rounded-full bg-[var(--lc-amber-500)]"
            }
          />
          <span
            className={
              urgencyLevel === "RED"
                ? "text-[10px] font-bold uppercase tracking-widest text-[var(--lc-red-800)]"
                : "text-[10px] font-bold uppercase tracking-widest text-[var(--lc-amber-800)]"
            }
          >
            {urgencyLevel === "RED"
              ? "Sugestão de Contato Imediato"
              : "Sugestão de Alinhamento"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[160px] p-3 text-[var(--lc-text-base)] text-[var(--lc-neutral-900)] bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] rounded-[var(--lc-radius-sm)] resize-none focus:outline-none focus:border-[var(--lc-teal-600)] transition-colors"
        />

        <div className="flex items-center justify-between mt-4">
          <div className="text-[11px] text-[var(--lc-neutral-500)] italic">
            Você pode editar o texto antes de enviar.
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-9 px-4 rounded-full border border-[var(--lc-neutral-200)] bg-white hover:bg-[var(--lc-neutral-50)] flex items-center gap-2"
            >
              <Copy size={14} className={isCopied ? "text-green-600" : ""} />
              {isCopied ? "Copiado!" : "Copiar"}
            </Button>
            <Button
              size="sm"
              onClick={onSend}
              className="h-9 px-5 rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white flex items-center gap-2 border-none"
            >
              <Send size={14} />
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
