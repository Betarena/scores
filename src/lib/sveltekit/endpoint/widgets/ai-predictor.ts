import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { getAiPredictionWidgetData } from '../../../../../../scores-lib/src/functions/v8/widgets/ai-predictions';

export const GetAiPredictionWidgetData: RequestHandler = async ({ url, locals, fetch }) => {
    if (!locals.user?.uid) {
        return json({ message: "User is not authenticated" }, { status: 401 });
    }
    const id = url.searchParams.get("id");
    if (!id) {
        return json({ message: "Prediction ID is required" }, { status: 400 });
    }
    const data = await getAiPredictionWidgetData({ id: Number(id) });
    return json({...data});
};