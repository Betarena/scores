// ...
export interface Hasura_Complete_Pages_SEO {
    scores_hreflang_dev: {
      hreflang: string
      link: string
    }[]
    scores_seo_homepage_dev: {
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
    scores_seo_block_homepage_dev: {
      html: string
      lang: string
      title: string
    }[]
}