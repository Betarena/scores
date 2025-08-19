import { entrySchemeTranslation } from "@betarena/scores-lib/dist/functions/v8/translation.js";
import type { TranslationSchema } from "@betarena/scores-lib/types/v8/core.translation.js";
import { json, RequestHandler } from "@sveltejs/kit";

export const GetTranslations: RequestHandler = async ({ url }) => {
  const language = url.searchParams.get("lang") || "";
  const field = url.searchParams.get("field") || "data";
  const lang_type = url.searchParams.get("lang_type") || "enum_lang_enum";
  const table = url.searchParams.get("table") as keyof TranslationSchema || "";
  const result = await entrySchemeTranslation({ language, table, field, lang_type, cacheCheck: false });
  const translations = {...result[0]?.get(language)?.translation}
  return json(translations);
};