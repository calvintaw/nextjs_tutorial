import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export function formatViews(views: number) {
	return `${views} view${views > 1 ? "s" : ""}`;
}

export function parseServerActionResponse<T>(response: T): T {
	return JSON.parse(JSON.stringify(response));
}
