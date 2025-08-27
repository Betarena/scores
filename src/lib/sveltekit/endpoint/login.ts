
import { json, RequestHandler } from "@sveltejs/kit";

export const GetLoginData: RequestHandler = async ({ url, locals: { user }, fetch }) => {
    const lang = (url.searchParams.get("lang") || user.lang || "EN").toLowerCase();
    const res = await Promise.all([
       fetch(`/api/data/translations?lang=${lang}&table=authentication&lang_type=String`),
       fetch(`/api/data/translations?lang=${lang}&table=scores_endpoints_translations&lang_type=String&field=countries_translation`),
    ]);
    const data = await Promise.all(res.map(r => r.json()));
    return json({ data });
};

