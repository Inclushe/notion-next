"use client";

import React from "react";

const DATABASE_ID = "cbdf16ae344e4c83b16f94b5e6be36ca";
const FILTER = {
	and: [
		{
			property: "Author",
			rich_text: {
				contains: "sonylogos",
			},
		},
		{
			property: "Tags",
			multi_select: {
				does_not_contain: "Hide",
			},
		},
	],
};
const SORTS = [
	{
		property: "Tweet Posted At",
		direction: "descending",
	},
];
const PAGE_SIZE = 10;

export default function Page() {
	const [databaseQuery, setDatabaseQuery] = React.useState(null);
	const [databaseResults, setDatabaseResults] = React.useState([]);

	function handleClick() {
		const startCursor = databaseQuery?.next_cursor || undefined;
		fetch(
			`/api/notion/queryDatabase?id=${DATABASE_ID}&filter=${JSON.stringify(FILTER)}&sorts=${JSON.stringify(SORTS)}&page_size=${PAGE_SIZE}&start_cursor=${startCursor}`,
		)
			.then((res) => res.json())
			.then((json) => {
				setDatabaseQuery(json.response);
				setDatabaseResults([...databaseResults, ...json.response.results]);
			})
			.catch((e) => {
				console.error(e);
			});
	}
	return (
		<>
			<div className="bg-red-50">lol</div>
			<button onClick={handleClick}>Click</button>
			<ul>
				{databaseResults.map((result) => (
					<li key={result.id}>{result.id}</li>
				))}
			</ul>
		</>
	);
}
