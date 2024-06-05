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
	const [blockData, setBlockData] = React.useState(null);
	const [status, setStatus] = React.useState("initial");

	console.log(pageData, pageError);
	console.log(blockData);

	const loadPage = (id) => {
		setStatus("loading");
		fetch(BLOCK_ENDPOINT + "?id=" + id)
			.then((res) => res.json())
			.then((json) => {
				setBlockData(json);
				setStatus("loaded");
			})
			.catch((e) => {
				console.error(e);
			});
	};

	return (
		<>
			<div className="flex items-start bg-[#CCCDC8]">
				<ul>
					{pageData?.results?.map((page) => {
						// Where in properties has a named object with the id of 'title'
						const titleObject = Object.values(page?.properties).find(
							(prop) => prop?.id === "title",
						);
						const title = titleObject?.title?.[0]?.plain_text;
						return (
							<li key={page.id}>
								<a
									onClick={() => {
										loadPage(page.id);
									}}
									className="text-blue-700 underline cursor-pointer"
								>
									{title}
								</a>
							</li>
						);
					})}
				</ul>
				<div class="sticky top-0 w-full">
					{status === "loading" && <>Loading...</>}
					{status === "loaded" && (
						<>
							<p>{console.log(blockData)}</p>
							<ul className="grid grid-cols-2 grid-rows-2 gap-2">
								{blockData?.map((block) => (
									<li key={block.id}>
										{block.type === "image" && (
											<img
												src={
													block?.image?.external?.url || block?.image?.file?.url
												}
												alt={block?.title}
											/>
										)}
									</li>
								))}
							</ul>
						</>
					)}
				</div>
			</div>
			<div className="flex flex-row gap-2">
				{/* <pre className="text-xs">{console.log(pageData?.results[0])}</pre>
				<pre className="text-xs">{JSON.stringify(blockData, null, 2)}</pre> */}
			</div>
		</>
	);
}
