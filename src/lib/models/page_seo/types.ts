// ...
export interface Hasura_Complete_Pages_SEO {
    scores_seo_homepage: {
        lang: string
        main_data: {
            canonical: string,
            noindex: boolean,
            keywords: string,
            nofollow: boolean,
            title: string,
            description: string
        }
        twitter_card: {
            image: string,
            title: string,
            site: string,
            imageAlt: string,
            description: string
        }
        opengraph: {
            height: string,
            images_url: string,
            locale: string,
            url: string,
            width: string,
            title: string,
            type: string,
            description: string,
            alt: string
        }
    }[]
}