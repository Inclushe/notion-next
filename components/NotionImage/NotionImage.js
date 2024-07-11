import React from "react";

function NotionImage({ block }) {
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

export default NotionImage;
