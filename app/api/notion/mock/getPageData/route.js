import mockData from "./getPageData.json";

export async function GET(request) {
	return Response.json(mockData);
}
