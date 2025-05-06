import { getSuggestions, updateSuggestPopularity } from "../../../../../scores-lib/src/functions/v8/search.js";
import { json, RequestHandler } from "@sveltejs/kit";

export const SuggestionsSearchEndpoint: RequestHandler = async ({ url }) => {
  const text = url.searchParams.get("search") || "";
  const limit = url.searchParams.get("limit") || "5";
  const result = await getSuggestions({
    text,
    limit:  Number(limit),
  });
  return json({ suggestions: result });
};

export const SuggestionsPostEndpoint: RequestHandler = async ({ request }) => {
  const body = await request.json();
  await updateSuggestPopularity({suggestion: body.suggest})
  return json({ suggestions: [] });
};
