<div align="center">
  <br />
    <a href="https://youtu.be/Zq5fmkH0T78?feature=shared" target="_blank">
      <img src="https://github.com/user-attachments/assets/471e2baa-8781-43b8-aaed-62e313d03e99" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=react&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Sanity-black?style=for-the-badge&logoColor=white&logo=sanity&color=F03E2F" alt="sanity" />

  </div>

<h3 align="center">Startup Directory Platform</h3>

## Note: <a name="table">This is a repo from Javascript Mastery Youtube</a>

   <div align="center">
     Build this project step by step with a detailed tutorial on <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a> YouTube. Join the JSM family!
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. ⚙️ [Package.json](#package)
2. 🤸 [Environment Variables](#variables)
3. 🤖 [New Feature I added](#new_features)
4. ⚠️ [Things to be wary of](#warnings)

## <a name="variables">⚙️ Set Up Environment Variables</a>

Create a new file named `.env.local` in the root of your project and add the following content:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION='vX'

AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

SANITY_WRITE_TOKEN=
OPENROUTER_API_KEY=
```

Replace the placeholder values with your actual Sanity credentials. You can obtain these credentials by signing up &
creating a new project on the [Sanity website](https://www.sanity.io/).

Replace `OPENROUTER_API_KEY` with your key from OpenRouter:

1. Sign up or log in
2. Click your profile, then select **Keys**
3. Generate a new API key
4. Copy and paste it into your `.env` file

To choose a model:

1. Go to the **Models** tab
2. Click the **API** tab for available options

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="package">🕸️ Package.json (the version that worked for me)</a>

```json
{
	"name": "yc-combinator",
	"version": "0.1.0",
	"private": true,
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"lint": "next lint",
		"predev": "npm run typegen",
		"prebuild": "npm run typegen",
		"typegen": "sanity schema extract --path=./sanity/extract.json && sanity typegen generate"
	},
	"dependencies": {
		"@radix-ui/react-avatar": "^1.1.10",
		"@radix-ui/react-icons": "^1.3.2",
		"@radix-ui/react-slot": "^1.2.3",
		"@radix-ui/react-toast": "^1.2.14",
		"@sanity/image-url": "^1.1.0",
		"@sanity/vision": "^3.92.0",
		"@sentry/nextjs": "^9.30.0",
		"@tailwindcss/typography": "^0.5.16",
		"@uiw/react-markdown-editor": "^6.1.4",
		"autoprefixer": "^10.4.21",
		"class-variance-authority": "^0.7.1",
		"clsx": "^2.1.1",
		"lucide-react": "^0.514.0",
		"markdown-it": "^14.1.0",
		"next": "^15.3.4",
		"next-auth": "^5.0.0-beta.28",
		"next-sanity": "^9.12.0",
		"openai": "^5.6.0",
		"postcss": "^8.5.4",
		"react": "^19.1.0",
		"react-dom": "^19.1.0",
		"sanity": "^3.92.0",
		"sanity-plugin-markdown": "^5.1.1",
		"server-only": "^0.0.1",
		"slugify": "^1.6.6",
		"styled-components": "^6.1.19",
		"tailwind-merge": "^3.3.1",
		"tailwindcss-animate": "^1.0.7",
		"zod": "^3.25.67"
	},
	"devDependencies": {
		"@eslint/eslintrc": "^3",
		"@tailwindcss/postcss": "^4",
		"@types/markdown-it": "^14.1.2",
		"@types/node": "^20",
		"@types/react": "^19",
		"@types/react-dom": "^19",
		"eslint": "^9",
		"eslint-config-next": "15.3.3",
		"tailwindcss": "^3.4.17",
		"typescript": "^5"
	}
}
```

## 🚀 <a name="new_features">New Feature I Added</a>

Here's a feature I built on top of the base course project to extend its functionality and explore new tools.

<details>
<summary><code>openai.ts</code></summary>

````typescript
"use server";

import OpenAI from "openai";

const openai_client = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY!,
	baseURL: "https://openrouter.ai/api/v1",
	defaultHeaders: {
		"HTTP-Referer": "https://yc-directory-tutorial-nine.vercel.app", // Change this to your actual deployed URL
	},
});

export const handleOpenAI = async (requirements: { title: string; description: string; category: string }) => {
	const { title, description, category } = requirements;

	// Asks AI to generate based on Form Field Values if provide else generates its own Idea

	const response = await openai_client.chat.completions.create({
		model: "deepseek/deepseek-chat-v3-0324:free",
		messages: [
			{
				role: "system",
				content:
					"You are a creative writer that has an enormous amount of startup ideas in different categories (anything imaginable).",
			},
			{
				role: "user",
				content: getInstructions({ title, description, category }),
			},
		],
	});

	const aiMessage = response.choices[0]?.message?.content || "Error Generating AI reponse. Please Try again";

	// replace leading and ending ```
	const raw = aiMessage.replace(/```[a-z]*\n?|\n?```/g, "");

	// changes it into actual js object
	const validObject = eval(`(${raw})`);

	return validObject;
};

// Instructions for generating prompt

function getInstructions({ title, description, category }: { title: string; description: string; category: string }) {
	return `
		
	Return a JavaScript object that represents a startup pitch with the following fields and constraints:

	{
		title: string (3–100 characters) ${title ? `"grow your idea from this: ${title}"` : ""},
		description: string (20–500 characters. prefereed longer but still interesting version) ${description ? `"grow your idea from this: ${description}"` : ""},
		category: string (3–20 characters) ${category ? `"grow your idea from this: ${category}"` : ""},
		link: string (a valid image URL — ends in .jpg, .png, etc.) (provide an appropriately sized image from Pexels or other free image platforms like Unsplash, Pixabay, or search the web for a relevant photo that strongly matches and is consistent with the startup theme) (size: ideally looks good for any screen size),

		pitch: string (at least 10 characters but prefereed range between 600 and 1000 words (longer is preferred).  Write this as a professional detailed and beautifully formatted pitch in **Markdown** and also pretty to look at (emojis can be included and are prefereed) and this string MUST be enclosed in backticks (\`) exactly like a JavaScript template literal) (You can make add details of how much support you think your pitch will have and how much growth is expected BUT strongly advised not to LIE) (Optional: how much funding is needed)
	}

	If any "grow your idea from this" phrases are provided, make sure the entire startup idea — including title, description, category, and pitch — strongly matches and is consistent with that theme.


	Example format:
	{
	title: "EcoFarm",
	description: "An app that connects local organic farms directly with consumers...",
	category: "Sustainability",
	link: "https://example.com/image.png",
	pitch: \`## EcoFarm\nEcoFarm is a platform that...\`
	}

	return only valid JavaScript object — no explanation, no extra text, no formatting. oThe object should be syntactically valid JavaScript.


	`;
}
````

</details>

<details>
<summary><code>AIButton.tsx</code></summary>

```typescript
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
```

</details>

<details>
<summary><code>StartupForm.tsx (Added & Changed a few lines of code)</code></summary>

```typescript
"use client";

import dynamic from "next/dynamic";
const MarkdownEditor = dynamic(
	() => import("@uiw/react-markdown-editor"),
	{ ssr: false }
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
```

</details>

## ⚠️ <a name="warnings">Things to Be Wary Of</a>

### 🧩 Add `<Toaster />` to the Root Layout

Ensure you add the `Toaster` component to the root of your project:

**File:** `/app/layout.tsx`

I also used the Google Fonts version of `Work_Sans`, as I encountered some font-related deployment issues with Vercel.

```tsx
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
				<Toaster />
			</body>
		</html>
	);
}
```

---

### 📌 Reminder: Add the Playlist Schema Setup. (JSM forgot to add this)

When you reach this point in the tutorial — [**05:02:04 – Final Feature, Parallel Fetching and Deployment**](https://www.youtube.com/watch?v=Zq5fmkH0T78&t=19114s) —  
**make sure to add the following code** to:

```
/app/sanity/structures.ts
```

Without this, your **playlist schema** will not appear in **Sanity Studio**.

```ts
import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
	S.list()
		.title("Content")
		.items([
			S.documentTypeListItem("author").title("Authors"),
			S.documentTypeListItem("startup").title("Startups"),
			S.documentTypeListItem("playlist").title("Playlist"),
		]);
```

## ⚠️ Note

Removed experimental PPR due to bugs that blocked installation of `react-markdown-editor`. Could be a skill issue 🤷‍♂️, but sharing in case it helps someone else.

<details>
<summary><code>\app\(root)\startup\[id]\page.tsx</code>
</summary>

```typescript
import { client } from "@/sanity/lib/client";
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/view";
import StartupCard, { StartupCardType } from "@/components/StartupCard";

const md = markdownit();

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const id = (await params).id;

	const [post, { select: editorPosts }] = await Promise.all([
		client.fetch(STARTUP_BY_ID_QUERY, { id }),
		client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-pick" }),
	]);

	if (!post) return notFound();

	const parsedContent = md.render(post?.pitch || " ");

	return (
		<>
			<section className="pink_container !min-h-[230px] ">
				<p className="tag">{formatDate(post?._createdAt)}</p>

				<h1 className="heading">{post.title}</h1>
				<p className="sub-heading !max-w-5xl">{post.description}</p>
			</section>
			<section className="section_container">
				<img src={post.image} alt="thumbnail" className="w-full h-auto rounded-xl"></img>

				<div className="space-y-5 mt-10 max-w-4xl mx-auto">
					<div className="flex-between gap-5">
						<Link href={`/user/${post.author?._id}`} className="flex gap-2 items-center mb-3">
							<Image
								src={post.author?.image}
								alt="avatar"
								className="rounded-full drop-shadow-lg"
								width={64}
								height={64}
							></Image>

							<div>
								<p className="text-20-medium">{post?.author?.name}</p>
								<p className="text-16-medium !text-black-300">@{post?.author?.username}</p>
							</div>
						</Link>
						<p className="category-tag">{post.category}</p>
					</div>

					<h3 className="text-30-bold">Pitch Details</h3>
					{parsedContent ? (
						<article className="prose" dangerouslySetInnerHTML={{ __html: parsedContent }}></article>
					) : (
						<p className="no-result">No details provided</p>
					)}
				</div>

				<hr className="divider" />

				{/* TO DO: EDITOR SELECTED STARTUPS*/}

				{editorPosts?.length > 0 && (
					<div className="max-w-4xl mx-auto">
						<p className="text-30-semibold">Editor Picks</p>

						<ul className="mt-7 card_grid-sm">
							{editorPosts.map((post: StartupCardType, index: number) => (
								<StartupCard key={index} post={post}></StartupCard>
							))}
						</ul>
					</div>
				)}

				<Suspense fallback={<Skeleton></Skeleton>}>
					<View id={id}></View>
				</Suspense>
			</section>
		</>
	);
};

export default Page;
```

</details>

## ✨ Why I Added AI Integration

While following the JSM Mastery Next.js 15 course, I got tired of manually writing startup ideas just to test things. So I built a quick AI integration to auto-generate them based on form inputs like **title**, **description**, and **category**.

I also used this as a chance to try out calling AI APIs (via OpenRouter + OpenAI) — something I hadn’t done before. Learned how to:

- Send prompts + get structured responses
- Parse and use AI output in real code
- Save time while keeping dev fun

> 💡 Not part of the course — just a custom add-on to make testing easier and learn something new.
