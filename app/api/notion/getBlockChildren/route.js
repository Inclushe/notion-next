import { Client } from "@notionhq/client";

const notion = new Client({
	auth: process.env.NOTION_SECRET,
});

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const blockId = searchParams.get("id");
	const response = await notion.blocks.children.list({
		block_id: blockId,
		page_size: 50,
	});
	return Response.json({ response });
}
