import React from "react";
import NotionImage from "@/components/NotionImage";

function NotionCard({ page, contents }) {
	// Where in properties has a named object with the id of 'title'
	const titleObject = Object.values(page?.properties).find(
		(prop) => prop?.id === "title",
	);
	const title = titleObject?.title?.[0]?.plain_text;
	return (
		<li className="bg-white shadow-sm rounded p-4" key={page.id}>
			<ul className="grid grid-cols-2 grid-rows-2 gap-2 mb-4">
				{[...Array(4)].map((_, index) => (
					<li className="bg-[#CCCDC8] aspect-square" key={index}>
						{contents?.[index]?.type === "image" && (
							<NotionImage block={contents[index]} />
						)}
					</li>
				))}
			</ul>
			<p className="font-bold">{title}</p>
		</li>
	);
}

export default NotionCard;
