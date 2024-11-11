import { error } from "@sveltejs/kit";
import type { PageLoad } from "../../edit/[...permalink]/[lang=lang]/$types.js";

export const load: PageLoad = async ({ url }) =>
{
  const id = url.searchParams.get("draft");
  let article = {
    content: "",
    title: "",
  }
  let mapTag = [];
  try
  {
    return {}
  } catch (e)
  {
    throw error(500, { message: 'Internal server error' } as App.Error);
  }
};