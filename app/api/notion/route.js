import { Client } from "@notionhq/client";

const notion = new Client({
	auth: process.env.NOTION_SECRET,
});

export async function GET(request) {
	const databaseId = "cbdf16ae344e4c83b16f94b5e6be36ca";
	const response = await notion.databases.query({
		database_id: databaseId,
		filter: {
			and: [
				{
					property: "Author",
					rich_text: {
						contains: "sonylogos",
					},
				},
				{
					property: "Tags",
					multi_select: {
						does_not_contain: "Hide",
					},
				},
			],
		},
		sorts: [
			{
				property: "Tweet Posted At",
				direction: "descending",
			},
		],
	});
	return Response.json({ response });
}
