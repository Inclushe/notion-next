"use client";

import Image from "next/image";
import React from "react";
import useSWR from "swr";

const PAGE_ENDPOINT = "/api/notion/mock";
const BLOCK_ENDPOINT = "/api/notion/getPageData";

async function pageFetcher(endpoint) {
	const response = await fetch(endpoint);
	const json = await response.json();

	return json.response;
}

async function blockFetcher(endpoint, id) {
	const response = await fetch(endpoint + "?id=" + id);
	const json = await response.json();

	return json;
}

export default function Home() {
	const [count, setCount] = React.useState(0);
	const { data: pageData, error: pageError } = useSWR(
		PAGE_ENDPOINT,
		pageFetcher,
	);
	const { data: blockData, error: blockError } = useSWR(
		[BLOCK_ENDPOINT, pageData?.results[0].id],
		([url, id]) => blockFetcher(url, id),
	);

	console.log(pageData, pageError);
	console.log(blockData, blockError);

	return (
		<>
			<div>
				<ul>
					{blockData?.map((block) => (
						<li key={block.id}>
							{block.type}
							{block.type === "image" && (
								<img
									src={block?.image?.external?.url || block?.image?.file?.url}
									width={100}
								/>
							)}
						</li>
					))}
				</ul>
				<div className="flex flex-row gap-2">
					<pre className="text-xs">
						{JSON.stringify(pageData?.results[0], null, 2)}
					</pre>
					<pre className="text-xs">{JSON.stringify(blockData, null, 2)}</pre>
				</div>
			</div>
		</>
	);
}
