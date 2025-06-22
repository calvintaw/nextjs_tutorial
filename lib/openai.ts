"use server";

import OpenAI from "openai";

const openai_client = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY!,
	baseURL: "https://openrouter.ai/api/v1",
	defaultHeaders: {
		"HTTP-Referer": "http://localhost:3000", // Change this to your actual deployed URL
	},
});

export const handleOpenAI = async (requirements: { title: string; description: string; category: string }) => {
	console.log("Asking AI...");

	const { title, description, category } = requirements;

	// Asks AI to generate based on Form Field Values if provide else generates its own Idea

	const response = await openai_client.chat.completions.create({
		model: "mistralai/mistral-small-3.2-24b-instruct:free", // lightweight, free
		messages: [
			{
				role: "system",
				content:
					"You are a creative writer that has an enormous amount of startup ideas in different categories (anything imaginable).",
			},
			{
				role: "user",
				content: `
Return a JavaScript object that represents a startup pitch with the following fields and constraints:


{
	title: string (3–100 characters) ${title ? `"grow your idea from this: ${title}"` : ""},
	description: string (20–500 characters) ${description ? `"grow your idea from this: ${description}"` : ""},
	category: string (3–20 characters) ${category ? `"grow your idea from this: ${category}"` : ""},
	link: string (a valid image URL — ends in .jpg, .png, etc.) (provide an appropriately sized image from Pexels that is suitable for the startup idea) (size: ideally looks good for any screen size),
	pitch: string (at least 10 characters — write this as a detailed and beautifully formatted pitch in **Markdown** and this string MUST be enclosed in backticks (\`) exactly like a JavaScript template literal) 
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

return only valid JavaScript object — no explanation, no extra text, no formatting. The object should be syntactically valid JavaScript.

        `,
			},
		],
	});

	const aiMessage = response.choices[0]?.message?.content || "Error Generating AI reponse. Please Try again";

	// replace leading and ending ```
	const raw = aiMessage.replace(/```[a-z]*\n?|\n?```/g, "");

	// changes it into actual js object
	const validObject = eval(`(${raw})`);

	console.log("AI RESPONSE:", validObject);
	return validObject;
};
