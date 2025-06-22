import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { Button } from "./ui/button";

interface Props {
	isLoading: boolean;
	onClick: () => void;
}

export function LoadingIcon({ className }: { className?: string }) {
	return <Loader2 className={`mr-2 h-5 w-5 animate-spin ${className}`} aria-hidden="true" />;
}

export function AIButton({ isLoading, onClick }: Props) {
	return (
		<Button
			type="button"
			onClick={onClick}
			disabled={isLoading}
			className={clsx(
				"relative inline-flex items-center rounded-md",
				"bg-gradient-to-r from-purple-600 to-indigo-600",
				"py-5 pr-8 text-[20px]",
				isLoading ? "pl-5" : "px-8",
				"text-white font-semibold",
				"shadow-md hover:from-purple-700 hover:to-indigo-700",
				"focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
				"disabled:opacity-70 disabled:cursor-not-allowed",
				"transition-colors duration-200 ease-in-out"
			)}
		>
			{isLoading && <LoadingIcon />}
			Ask AI
		</Button>
	);
}
