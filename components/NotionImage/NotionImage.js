import React from "react";

function NotionImage({ className, block }) {
	return (
		<>
			{block.type === "image" && (
				<img
					className={className}
					src={block?.image?.external?.url || block?.image?.file?.url}
					alt={block?.title}
				/>
			)}
		</>
	);
}

export default NotionImage;
