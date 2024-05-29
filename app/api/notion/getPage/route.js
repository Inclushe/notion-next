import { Client } from "@notionhq/client";

const notion = new Client({
	auth: process.env.NOTION_SECRET,
});

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const pageId = searchParams.get("id");
	const response = await notion.pages.retrieve({ page_id: pageId });
	return Response.json({ response });
}
