import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TopNav } from "@/components/layout/top-nav";
import { MainShell } from "@/components/layout/main-shell";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Lente Clínica",
	description: "Plataforma de apoio à decisão clínica e manejo de psicofármacos",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="pt-BR"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-[var(--lc-neutral-50)] text-[var(--lc-neutral-900)]">
				<Providers>
					<TopNav />
					<MainShell>{children}</MainShell>
				</Providers>
			</body>
		</html>
	);
}
