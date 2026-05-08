import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  filter?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  icon,
  title,
  filter,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-[var(--lc-teal-600)]">
        {icon}
        <h1 className="text-[13px] font-bold uppercase tracking-wider">
          {title}
        </h1>
      </div>

      {filter ? <div className="w-full md:w-[320px]">{filter}</div> : null}
    </div>
  );
}
