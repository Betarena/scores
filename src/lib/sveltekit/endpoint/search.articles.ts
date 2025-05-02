import { json, RequestHandler } from "@sveltejs/kit";
import { searchArticles } from "@betarena/scores-lib/dist/functions/v8/search.js";

export const ArticlesSearchEndpoint: RequestHandler = async ({url}) => {
  const text = url.searchParams.get('search') || '';
  const page = url.searchParams.get('page') || '0';
  const limit = url.searchParams.get('limit') || '10';
  const offset = parseInt(page) * parseInt(limit);
  const result = await searchArticles({text, offset, limit: parseInt(limit)})
  return json({articles: result})
};