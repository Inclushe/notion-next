import mockData from "./mockData.json";

export async function GET(request) {
	return Response.json(mockData);
}
