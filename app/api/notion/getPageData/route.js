import { Client } from "@notionhq/client";

const notion = new Client({
	auth: process.env.NOTION_SECRET,
});

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const blockIds = searchParams.get("ids");
	const blockPromises = blockIds.split(",").map((id) => {
		return new Promise((resolve, reject) => {
			resolve(getPageDataFromID(id));
		});
	});
	const allResults = await Promise.all(blockPromises);
	return Response.json(allResults);
}

async function getPageDataFromID(id) {
	let response = await notion.blocks.children.list({
		block_id: id,
		page_size: 50,
	});
	const newId = response.results[0].id;
	response = await notion.blocks.children.list({
		block_id: newId,
		page_size: 50,
	});
	const results = response.results;
	return results;
}
