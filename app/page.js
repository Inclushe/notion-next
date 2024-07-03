"use client";

import Image from "next/image";
import React from "react";
import useSWR from "swr";

const PAGE_ENDPOINT = "/api/notion/mock";
// const BLOCK_ENDPOINT = "/api/notion/getPageData";
const BLOCK_ENDPOINT = "/api/notion/mock/getPageData";

export default function Home() {
	const [count, setCount] = React.useState(0);
	const [pageData, setPageData] = React.useState(null);
	const [blockData, setBlockData] = React.useState(null);
	const [blockContents, setBlockContents] = React.useState({});
	const [status, setStatus] = React.useState("initial");

	React.useEffect(() => {
		loadPage();
	}, []);

	React.useEffect(() => {
		if (!pageData) return;
		const ids = pageData?.results.map((result) => result.id);
		loadBlocks(ids);
	}, [pageData]);

	const loadPage = () => {
		setStatus("loading");
		fetch(PAGE_ENDPOINT)
			.then((res) => res.json())
			.then((json) => {
				// console.log(json);
				setPageData(json.response);
				setStatus("loaded");
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const loadBlocks = (ids) => {
		setStatus("loading");
		fetch(`${BLOCK_ENDPOINT}?ids=${ids.join(",")}`)
			.then((res) => res.json())
			.then((json) => {
				const currentBlockContents = json.reduce((obj, images, index) => {
					obj[ids[index]] = images;
					return obj;
				}, {});
				setBlockContents(currentBlockContents);
				setStatus("loaded");
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const loadBlock = (id) => {
		setStatus("loading");
		fetch(`${BLOCK_ENDPOINT}?ids=${id}`)
			.then((res) => res.json())
			.then((json) => {
				// console.log(json);
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
				<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
					{pageData?.results?.map((page) => (
						<NotionCard
							key={page.id}
							page={page}
							contents={blockContents[page.id]}
						/>
					))}
				</ul>
			</div>
		</>
	);
}

export function NotionCard({ page, contents }) {
	// Where in properties has a named object with the id of 'title'
	const titleObject = Object.values(page?.properties).find(
		(prop) => prop?.id === "title",
	);
	const title = titleObject?.title?.[0]?.plain_text;
	return (
		<li className="bg-white shadow-sm rounded p-4" key={page.id}>
			<ul className="grid grid-cols-2 grid-rows-2 gap-2 mb-4">
				{contents?.map((block) => (
					<li key={block.id}>
						<NotionImage block={block} />
					</li>
				))}
			</ul>
			<p className="font-bold">{title}</p>
		</li>
	);
}

export function NotionImage({ block }) {
	return (
		<>
			{block.type === "image" && (
				<img
					src={block?.image?.external?.url || block?.image?.file?.url}
					alt={block?.title}
				/>
			)}
		</>
	);
}
