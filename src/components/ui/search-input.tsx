"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

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

	const initialValue = searchParams.get("search") ?? "";
	const [value, setValue] = useState(initialValue);
	const debouncedValue = useDebounce(value, 400);

	useEffect(() => {
		const current = searchParams.get("search") ?? "";
		if (debouncedValue !== current) {
			const params = new URLSearchParams(searchParams);
			if (debouncedValue) {
				params.set("search", debouncedValue);
			} else {
				params.delete("search");
			}

			startTransition(() => {
				router.replace(`?${params.toString()}`);
			});
		}
	}, [debouncedValue, router, searchParams]);

	const handleClear = () => {
		setValue("");
	};

	return (
		<div className={`relative group ${className}`}>
			<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--lc-neutral-400)] group-focus-within:text-[var(--lc-teal-500)] transition-colors">
				<Search size={18} />
			</div>
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
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
