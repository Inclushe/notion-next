"use client";

import React from "react";
import NotionCard from "@/components/NotionCard";
import useElementOnScreen from "@/hooks/useElementOnScreen";

const DATABASE_ID = "cbdf16ae344e4c83b16f94b5e6be36ca";
// const FILTER = {
// 	and: [
// 		{
// 			property: "Author",
// 			rich_text: {
// 				contains: "sonylogos",
// 			},
// 		},
// 		{
// 			property: "Tags",
// 			multi_select: {
// 				does_not_contain: "Hide",
// 			},
// 		},
// 	],
// };
const FILTER = undefined;
// const SORTS = [
// 	{
// 		property: "Tweet Posted At",
// 		direction: "descending",
// 	},
// ];
const SORTS = [
	{
		property: "Created",
		direction: "descending",
	},
];
const PAGE_SIZE = 20;
const BLOCK_ENDPOINT = "/api/notion/getPageData";

export default function Page() {
	const [databaseQuery, setDatabaseQuery] = React.useState(null);
	const [databaseResults, setDatabaseResults] = React.useState([]);
	const [blockContents, setBlockContents] = React.useState({});
	const [status, setStatus] = React.useState("loaded");
	const [hasMore, setHasMore] = React.useState(true);
	const [skeletonRef, skeletonIsVisible] = useElementOnScreen({
		root: null,
		rootMargin: "0px",
		threshold: 0.5,
	});

	const loadBlocks = (ids) => {
		setBlockContents((blockContents) => {
			const currentBlockContents = {
				...blockContents,
				...ids.reduce(
					(obj, id) => ({ ...obj, [id]: { loaded: "loading" } }),
					{},
				),
			};
			return currentBlockContents;
		});
		fetch(`${BLOCK_ENDPOINT}?ids=${ids.join(",")}`)
			.then((res) => res.json())
			.then((json) => {
				const currentBlockContents = json.reduce((obj, images, index) => {
					obj[ids[index]] = {
						loaded: "loaded",
						contents: images,
					};
					return obj;
				}, {});
				setBlockContents((blockContents) => {
					return { ...blockContents, ...currentBlockContents };
				});
			})
			.catch((e) => {
				// Remove blocks from blockContents
				setBlockContents((blockContents) => {
					const newBlockContents = {};
					Object.keys(blockContents).forEach((key) => {
						if (ids.includes(key)) {
							return;
						}
						newBlockContents[key] = blockContents[key];
					});
					return newBlockContents;
				});
			});
	};

	const queryDatabase = () => {
		setStatus("loading");
		const startCursor = databaseQuery?.next_cursor || undefined;
		fetch(
			`/api/notion/queryDatabase?id=${DATABASE_ID}&filter=${JSON.stringify(FILTER)}&sorts=${JSON.stringify(SORTS)}&page_size=${PAGE_SIZE}&start_cursor=${startCursor}`,
		)
			.then((res) => res.json())
			.then((json) => {
				setDatabaseQuery(json.response);
				setDatabaseResults([...databaseResults, ...json.response.results]);
				setStatus("loaded");
				const newIDs = json.response.results.map((result) => result.id);
				setBlockContents((blockContents) => {
					const currentBlockContents = {
						...blockContents,
						...newIDs.reduce(
							(obj, id) => ({ ...obj, [id]: { loaded: "initial" } }),
							{},
						),
					};
					return currentBlockContents;
				});
				loadBlocks(newIDs);
				setHasMore(json?.response?.has_more);
			})
			.catch((e) => {
				setStatus("loaded");
			});
	};

	React.useEffect(() => {
		queryDatabase();
	}, []);

	React.useEffect(() => {
		if (skeletonIsVisible && status === "loaded") {
			queryDatabase();
		}
	}, [skeletonIsVisible]);

	return (
		<div className="flex flex-col items-center bg-[#CCCDC8] min-h-screen">
			<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
				{databaseResults?.map((page) => (
					<NotionCard
						key={page.id}
						page={page}
						contents={
							blockContents[page.id]?.loaded === "loaded"
								? blockContents[page.id].contents
								: null
						}
					/>
				))}
			</ul>
			{hasMore && (
				<button
					onClick={() => {
						status === "loaded" && queryDatabase();
					}}
					className="px-4 py-32 bg-gray-200 border-1 border-gray-300 rounded-md disabled:bg-gray-300 disabled:text-gray-500"
					disabled={status === "loading"}
					ref={skeletonRef}
				>
					{status === "loading" ? "Loading..." : "Load More"}
				</button>
			)}
			<div className="py-4"></div>
		</div>
	);
}
