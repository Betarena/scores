import { getAiPredictionWidgetData } from '@betarena/scores-lib/dist/functions/v8/widgets/ai-predictions';
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GetAiPredictionWidgetData: RequestHandler = async ({ url, locals, fetch }) => {
    const { user } = locals;
    if (!user?.uid) {
        return json({ message: "User is not authenticated" }, { status: 401 });
    }
    const id = url.searchParams.get("id");
    const lang = url.searchParams.get("lang") || locals.user.lang || "en";
    if (!id) {
        return json({ message: "Prediction ID is required" }, { status: 400 });
    }
    const [widget, translations] = await Promise.all([getAiPredictionWidgetData({ id: Number(id) }), fetch(`/api/data/translations?table=widget_aiprediction&lang=${lang}&lang_type=String`)]);
    return json({ widget_data: widget.data, widget_translations: await translations.json() });
};