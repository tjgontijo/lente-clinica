"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Buscar...",
  className,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialValue = searchParams.get("search") ?? "";
  const [value, setValue] = useState(initialValue);

  const scheduleUrlUpdate = (nextValue: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (nextValue) {
        params.set("search", nextValue);
      } else {
        params.delete("search");
      }

      startTransition(() => {
        router.replace(`?${params.toString()}`);
      });
    }, 400);
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    scheduleUrlUpdate(nextValue);
  };

  const handleClear = () => {
    handleChange("");
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--lc-neutral-400)] group-focus-within:text-[var(--lc-teal-500)] transition-colors">
        <Search size={18} />
      </div>
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 h-12 bg-white border-[var(--lc-neutral-200)] focus:border-[var(--lc-teal-500)] focus:ring-1 focus:ring-[var(--lc-teal-500)] rounded-[12px] shadow-sm transition-all text-[15px]"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lc-neutral-400)] hover:text-[var(--lc-neutral-600)] transition-colors"
        >
          <X size={18} />
        </button>
      )}
      {isPending && (
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--lc-teal-100)] overflow-hidden">
          <div className="w-1/3 h-full bg-[var(--lc-teal-500)] animate-shimmer" />
        </div>
      )}
    </div>
  );
}
