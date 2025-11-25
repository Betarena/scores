import { getRecommendedTags } from "@betarena/scores-lib/dist/functions/v8/authors.tags";
import { json, RequestHandler } from "@sveltejs/kit";

export const PostTagsRecommendations: RequestHandler = async ({ request }) => {
  try {
    const { lang, user, country } = await request.json();
    const recommendedTags = await getRecommendedTags({ 
      country, 
      lang: lang || user.lang, 
      user 
    });

    return json({
      success: true,
      data: {
        tags: recommendedTags,
      }
    });
  } catch (error) {
    console.error('Error fetching tag recommendations:', error);

    return json({
      success: false,
      error: 'Failed to fetch tag recommendations'
    }, { status: 500 });
  }
};
