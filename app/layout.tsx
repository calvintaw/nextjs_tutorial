import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import "easymde/dist/easymde.min.css";
import { Toaster } from "@/components/ui/toaster";

const workSans = Work_Sans({
	subsets: ["latin"],
	weight: ["100", "200", "400", "500", "600", "700", "800", "900"],
	variable: "--font-work-sans",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Yc Directory",
	description: "Pitch, Invest & Grow",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${workSans.variable}`}>
				{children}
				<Toaster></Toaster>
			</body>
		</html>
	);
}
