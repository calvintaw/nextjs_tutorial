"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useActionState } from "react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import { Send } from "lucide-react";
// import { formSchema } from "@/lib/validation";
// import { z } from "zod";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import { createPitch } from "@/lib/actions";

const StartupForm = () => {
	const [errors, setErrors] = useState<Record<string, string>>({});
	const handleFormSubmit = async (prevState: any, formData: FormData) => {
		try {
			const formValues = {
				title: formData.get("title") as string,
				description: formData.get("description") as string,
				link: formData.get("link") as string,
				category: formData.get("category") as string,
				pitch,
			};

			await formSchema.parseAsync(formValues);
			console.log("formValues: ", formValues);

			// const result = await createIdea(prevState, formData, pitch)
			// console.log(desult)
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors = error.flatten().fieldErrors;
				setErrors(fieldErrors as unknown as Record<string, string>);
				return { ...prevState, error: "Validation failed", status: "ERROR" };
			}

			return {
				...prevState,
				error: "An unexpected error has occurred",
				status: "ERROR",
			};
		} finally {
		}
	};

	const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: "", status: "INITIAL" });

	const [pitch, setPitch] = useState("");

	return (
		<form action={formAction} className="startup-form">
			<div>
				<label htmlFor="title" className="startup-form_label">
					Title
				</label>
				<Input id="title" name="title" className="startup-form_input" required placeholder="Startup Title" />

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
				/>

				{errors.category && <p className="startup-form_error">{errors.category}</p>}
			</div>

			<div>
				<label htmlFor="link" className="startup-form_label">
					Image URL
				</label>
				<Input id="link" name="link" className="startup-form_input" required placeholder="Startup Image URL" />

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
					preview="edit"
					style={{ borderRadius: 20, overflow: "hidden" }}
					placeholder="Briefly describe your idea and what problem it solves"
				/>

				{errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
			</div>

			<Button disabled={isPending} type="submit" className="startup-form_btn text-white">
				{isPending ? "Submitting..." : "Submit Your Pitch"}
				<Send className="size-6 ml-2"></Send>
			</Button>
		</form>
	);
};

export default StartupForm;
