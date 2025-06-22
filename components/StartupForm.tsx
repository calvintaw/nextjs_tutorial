"use client";

import dynamic from "next/dynamic";
const MarkdownEditor = dynamic(
	() => import("@uiw/react-markdown-editor"),
	{ ssr: false } // disable server-side rendering
);
import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
import { handleOpenAI } from "@/lib/openai";
import { AIButton, LoadingIcon } from "./AiButton";

const initialFormData = {
	title: "",
	description: "",
	category: "",
	link: "",
};

const StartupForm = () => {
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [pitch, setPitch] = useState("");
	const [formValues, setFormValues] = useState(initialFormData);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const handleAI = async () => {
		setIsLoading(true);
		const { title, description, category, link, pitch } = await handleOpenAI({
			title: formValues.title,
			description: formValues.description,
			category: formValues.category,
		});
		setPitch(pitch);
		setFormValues({
			title,
			description,
			link,
			category,
		});
		setIsLoading(false);
	};

	const handleFormSubmit = async (prevState: any, formData: FormData) => {
		try {
			const formValues = {
				title: formData.get("title") as string,
				description: formData.get("description") as string,
				category: formData.get("category") as string,
				link: formData.get("link") as string,
				pitch,
			};


			await formSchema.parseAsync(formValues);

			const result = await createPitch(prevState, formData, pitch);

			if (result.status == "SUCCESS") {
				toast({
					title: "Success",
					description: "Your startup pitch has been created successfully",
				});

				router.push(`/startup/${result._id}`);
			}

			setFormValues(initialFormData);
			return result;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErorrs = error.flatten().fieldErrors;

				setErrors(fieldErorrs as unknown as Record<string, string>);

				toast({
					title: "Error",
					description: "Please check your inputs and try again",
					variant: "destructive",
				});

				return { ...prevState, error: "Validation failed", status: "ERROR" };
			}

			toast({
				title: "Error",
				description: "An unexpected error has occurred",
				variant: "destructive",
			});

			return {
				...prevState,
				error: "An unexpected error has occurred",
				status: "ERROR",
			};
		}
	};

	const [state, formAction, isPending] = useActionState(handleFormSubmit, {
		error: "",
		status: "INITIAL",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<form action={formAction} className="startup-form">
			<div>
				<label htmlFor="title" className="startup-form_label">
					Title
				</label>
				<Input
					id="title"
					name="title"
					className="startup-form_input"
					required
					placeholder="Startup Title"
					value={formValues.title}
					onChange={handleChange}
				/>
				{errors.title && <p className="startup-form_error">{errors.title}</p>}
			</div>

			<div>
				<label htmlFor="description" className="startup-form_label">
					Description
				</label>
				<Textarea
					id="description"
					name="description"
					className="startup-form_textarea"
					required
					placeholder="Startup Description"
					value={formValues.description}
					onChange={handleChange}
				/>
				{errors.description && <p className="startup-form_error">{errors.description}</p>}
			</div>

			<div>
				<label htmlFor="category" className="startup-form_label">
					Category
				</label>
				<Input
					id="category"
					name="category"
					className="startup-form_input"
					required
					placeholder="Startup Category (Tech, Health, Education...)"
					value={formValues.category}
					onChange={handleChange}
				/>
				{errors.category && <p className="startup-form_error">{errors.category}</p>}
			</div>

			<div>
				<label htmlFor="link" className="startup-form_label">
					Image URL
				</label>
				<Input
					id="link"
					name="link"
					className="startup-form_input"
					required
					placeholder="Startup Image URL"
					value={formValues.link}
					onChange={handleChange}
				/>
				{errors.link && <p className="startup-form_error">{errors.link}</p>}
			</div>

			<div data-color-mode="light">
				<label htmlFor="pitch" className="startup-from_label">
					Pitch
				</label>

				<MarkdownEditor
					value={pitch}
					onChange={(value) => setPitch(value as string)}
					id="pitch"
					height="300px"
					style={{ borderRadius: 20, overflow: "hidden" }}
					placeholder="Briefly describe your idea and what problem it solves"
				/>

				{errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
			</div>

			<div className="flex flex-wrap items-center justify-end gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
				<Button disabled={isPending} type="submit" className="startup-form_btn">
					{isPending && (
						<span className="mr-4 -ml-3 flex-shrink-0">
							<LoadingIcon className="!h-8 !w-8" />
						</span>
					)}
					{isPending ? "Submitting..." : "Submit Your Pitch"}
					<Send className="size-6 ml-2" />
				</Button>
				<AIButton onClick={handleAI} isLoading={isLoading}></AIButton>
			</div>
		</form>
	);
};

export default StartupForm;
