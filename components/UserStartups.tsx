import { client } from "@/sanity/lib/client";
import { STARTUP_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import React from "react";
import StartupCard, { StartupCardType } from "./StartupCard";

const UserStartups = async ({ id }: { id: string }) => {
	const startups = await client.fetch(STARTUP_BY_AUTHOR_QUERY, { id });

	return (
		<>
			{startups.length > 0 ? (
				startups.map((startup: StartupCardType) => <StartupCard key={startup._id} post={startup} />)
			) : (
				<p className="no-result">No posts yet</p>
			)}
		</>
	);
};

export default UserStartups;
