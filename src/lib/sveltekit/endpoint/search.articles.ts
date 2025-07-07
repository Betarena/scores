import { json, RequestHandler } from "@sveltejs/kit";
import { searchArticles } from "@betarena/scores-lib/dist/functions/v8/search.js";

export const ArticlesSearchEndpoint: RequestHandler = async ({url, locals}) => {
  const text = decodeURIComponent( url.searchParams.get('search') || '');
  const page = url.searchParams.get('page') || '0';
  const limit = url.searchParams.get('limit') || '10';
  const offset = parseInt(page) * parseInt(limit);
  const lang = locals.user?.lang ?? "en";
  const result = await searchArticles({ text, offset, limit: parseInt(limit), lang });
  return json(result)
};