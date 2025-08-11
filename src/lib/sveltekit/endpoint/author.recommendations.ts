import { getRecommendedAuthors } from "@betarena/scores-lib/dist/functions/v8/authors.profile";
import { json, RequestHandler } from "@sveltejs/kit";

export const PostAuthorRecommendations: RequestHandler = async ({ request }) => {
  try {
    const { lang, user, country } = await request.json();
    console.log('Received request for author recommendations:', { lang, user, country });
    // For now, using mock data. Replace with actual implementation when library is built.
    const recommendedAuthors = await getRecommendedAuthors({ country, lang: lang || user.language, user });

    return json({
      success: true,
      data: {
        authors: recommendedAuthors,
      }
    });
  } catch (error) {
    console.error('Error fetching author recommendations:', error);
    
    return json({
      success: false,
      error: 'Failed to fetch author recommendations'
    }, { status: 500 });
  }
};
