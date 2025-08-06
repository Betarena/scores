
import { json, RequestHandler } from "@sveltejs/kit";

export const GetLoginData: RequestHandler = async ({ url, locals: { user }, fetch }) => {
    const lang = (url.searchParams.get("search") || user.lang || "EN").toLowerCase();
    let res = await Promise.all([
       fetch(`/api/data/translations?lang=${lang}&table=auth_translations&lang_type=String&field=translation`),
       fetch(`/api/data/translations?lang=${lang}&table=scores_endpoints_translations&lang_type=String&field=countries_translation`),
    ]);
    const data = await Promise.all(res.map(r => r.json()));
    return json({ data });
};

