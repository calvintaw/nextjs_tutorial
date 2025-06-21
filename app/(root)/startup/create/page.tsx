import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import StartupForm from "@/components/StartupForm";

const Page = async () => {
	const session = await auth();

	if (!session) redirect("/");

	return (
		<section className="pink_container !min-h-[230px]">
			<h1 className="heading">Submit Your Startup</h1>

			<StartupForm></StartupForm>
		</section>
	);
};

export default Page;
