import SearchForm from "../../components/SearchForm";
import StartupCard from "@/components/StartupCard";

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
	const query = (await searchParams).query;

	const posts = [
		{
			_id: 0,
			_createdAt: new Date(),
			views: 55,
			author: { _id: 1, name: "Adrian" },
			description: "This is a description",
			image: "https://placehold.co/600x400/png",
			category: "Food",
			title: "CraveIt",
		},
	];

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
						posts.map((post: StartupTypeCard, index: number) => <StartupCard key={post?._id} post={post} />)
					) : (
						<>
							<h1>500 Interal SErver error</h1>
						</>
					)}
				</ul>
			</section>
		</>
	);
}
