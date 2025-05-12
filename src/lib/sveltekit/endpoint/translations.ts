import { _GraphQL } from "@betarena/scores-lib/dist/classes/_graphql.js";
import { entrySchemeTranslation } from "../../../../../scores-lib/src/functions/v8/translation.js";
import { json, RequestHandler } from "@sveltejs/kit";

export const GetTranslations: RequestHandler = async ({ url }) => {
  const language = url.searchParams.get("lang") || "";
  const table = (url.searchParams.get("table") || "") as any;
  const result = await entrySchemeTranslation({language, table});  console.log("TRANSLATIONS: ", language, result);
  const translations = {...result[0].get(language).translation}
  return json(translations);
};