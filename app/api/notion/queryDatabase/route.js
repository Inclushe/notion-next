import { Client } from "@notionhq/client";
import { search } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
	auth: process.env.NOTION_SECRET,
});

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const database_id = searchParams.get("id");
	let filter = searchParams.get("filter") || undefined;
	if (filter === "undefined") {
		filter = undefined;
	}
	if (filter) {
		filter = JSON.parse(filter);
	}
	const sorts = JSON.parse(searchParams.get("sorts"));
	const page_size = Number(searchParams.get("page_size"));
	let start_cursor = searchParams.get("start_cursor") || undefined;
	if (start_cursor === "undefined") {
		start_cursor = undefined;
	}
	try {
		const response = await notion.databases.query({
			database_id,
			filter,
			sorts,
			page_size,
			start_cursor,
		});
		return Response.json({ response });
	} catch (e) {
		console.error(e);
		return Response.json({ response: null });
	}
}
