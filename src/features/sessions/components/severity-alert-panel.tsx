import { AlertCircle, AlertOctagon, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SeverityAlertPanelProps {
  severity: "INFO" | "AMBER" | "RED";
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function SeverityAlertPanel({
  severity,
  title,
  description,
  onAction,
  actionLabel,
}: SeverityAlertPanelProps) {
  const isAmber = severity === "AMBER";
  const isRed = severity === "RED";
  const isInfo = severity === "INFO";

  return (
    <Alert
      variant={isRed ? "red" : isAmber ? "amber" : "default"}
      className="border-1 shadow-none"
    >
      <div className="flex items-center gap-2 mb-1.5">
        {isRed && (
          <AlertOctagon
            className="w-4 h-4 text-[var(--lc-red-700)]"
            strokeWidth={2.5}
          />
        )}
        {isAmber && (
          <AlertCircle
            className="w-4 h-4 text-[var(--lc-amber-700)]"
            strokeWidth={2.5}
          />
        )}
        {isInfo && (
          <Info
            className="w-4 h-4 text-[var(--lc-teal-600)]"
            strokeWidth={2.5}
          />
        )}

        <Badge
          className={
            isRed
              ? "bg-[var(--lc-red-100)] text-[var(--lc-red-800)] border-[var(--lc-red-300)]"
              : isAmber
                ? "bg-[var(--lc-amber-100)] text-[var(--lc-amber-800)] border-[var(--lc-amber-300)]"
                : "bg-[var(--lc-teal-100)] text-[var(--lc-teal-800)] border-[var(--lc-teal-200)]"
          }
        >
          {isRed ? "Urgência" : isAmber ? "Atenção" : "Observação"}
        </Badge>

        <AlertTitle
          className={
            isRed
              ? "text-[var(--lc-red-900)]"
              : isAmber
                ? "text-[var(--lc-amber-900)]"
                : "text-[var(--lc-teal-900)]"
          }
        >
          {title}
        </AlertTitle>
      </div>

      <AlertDescription
        className={
          isRed
            ? "text-[var(--lc-red-800)]"
            : isAmber
              ? "text-[var(--lc-amber-800)]"
              : "text-[var(--lc-teal-800)]"
        }
      >
        {description}
      </AlertDescription>

      {onAction && actionLabel && (
        <div className="flex gap-2 mt-3.5">
          <Button
            size="sm"
            onClick={onAction}
            className={
              isRed
                ? "bg-[var(--lc-red-600)] hover:bg-[var(--lc-red-700)] text-white h-8 text-xs rounded-full border-none"
                : isAmber
                  ? "bg-[var(--lc-amber-600)] hover:bg-[var(--lc-amber-700)] text-white h-8 text-xs rounded-full border-none"
                  : "bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white h-8 text-xs rounded-full border-none"
            }
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </Alert>
  );
}
