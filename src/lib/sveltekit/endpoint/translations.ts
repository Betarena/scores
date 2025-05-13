import { _GraphQL } from "@betarena/scores-lib/dist/classes/_graphql.js";
import { entrySchemeTranslation } from "@betarena/scores-lib/dist/functions/v8/translation.js";
import { json, RequestHandler } from "@sveltejs/kit";

export const GetTranslations: RequestHandler = async ({ url }) => {
  const language = url.searchParams.get("lang") || "";
  const table = (url.searchParams.get("table") || "") as "search";
  const result = await entrySchemeTranslation({language, table});
  const translations = {...result[0]?.get(language)?.translation}
  return json(translations);
};