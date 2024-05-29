import { Client } from "@notionhq/client";

const notion = new Client({
	auth: process.env.NOTION_SECRET,
});

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	let blockId = searchParams.get("id");
	let response = await notion.blocks.children.list({
		block_id: blockId,
		page_size: 50,
	});
	blockId = response.results[0].id;
	response = await notion.blocks.children.list({
		block_id: blockId,
		page_size: 50,
	});
	const results = response.results;
	return Response.json(results);
}
