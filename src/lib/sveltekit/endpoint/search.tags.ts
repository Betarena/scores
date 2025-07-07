import { searchTags } from "@betarena/scores-lib/dist/functions/v8/search.js";
import { json, RequestHandler } from "@sveltejs/kit";

export const TagsSearchEndpoint: RequestHandler = async ({url}) => {
  const text = decodeURIComponent(url.searchParams.get('search') || '');
  const page = url.searchParams.get('page') || '0';
  const limit = url.searchParams.get('limit') || '10';
  const offset = parseInt(page) * parseInt(limit);
  const result = await searchTags({text, offset, limit: parseInt(limit)})
  return json({tags: result})
};