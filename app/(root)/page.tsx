import SearchForm from "../../components/SearchForm";
import StartupCard, { StartupCardType } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
	const query = (await searchParams).query;
	const params = { search: query || null };

	const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

	const session = await auth();
	return (
		<>
			<section className="pink_container">
				<h1 className="heading">
					Pitch Your Startup, <br></br>Connect Wtih Entrepreneurs
				</h1>
				<p className="sub-heading !max-w-3xl">
					Submit Ideas, Vote on Pitches, and get Noticed in Virtual Competitions .
				</p>
				<SearchForm query={query}></SearchForm>
			</section>

			<section className={"section_container"}>
				<p className="text-30-semibold">{query ? `Search results for ${query}` : "All Startups"}</p>

				<ul className="mt-7 card_grid">
					{posts?.length > 0 ? (
						posts.map((post: StartupCardType) => <StartupCard key={post?._id} post={post} />)
					) : (
						<>
							<h1>500 Interal SErver error</h1>
						</>
					)}
				</ul>
			</section>

			<SanityLive />
		</>
	);
}
