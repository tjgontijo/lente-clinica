import { cn } from "@/lib/utils";

interface MainShellProps {
  children: React.ReactNode;
  className?: string;
}

export function MainShell({ children, className }: MainShellProps) {
  return (
    <main
      className={cn(
        "flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12",
        className,
      )}
    >
      <div className="flex flex-col gap-8 animate-in fade-in duration-500">
        {children}
      </div>
    </main>
  );
}
