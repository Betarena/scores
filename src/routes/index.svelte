<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation'
	import { amp, browser, dev, mode, prerendering } from '$app/env'

	import { userBetarenaSettings } from '$lib/store/user-settings'

	import header_bg from '$lib/header-background.svg'
    
    import SvelteSeo from 'svelte-seo'
    import FeaturedMatchWidget from '$lib/components/featured_match/FeaturedMatch_Widget.svelte';

    // ... redirecting the users to the correct translation page [THAT IS NOT EN]
    $: if (dev) console.debug('$userBetarenaSettings', $userBetarenaSettings)
    // ...
    if (browser && $userBetarenaSettings != undefined && $userBetarenaSettings.lang != 'en') {
        redirect()
    }
    // ...
    async function redirect() {
        await goto(`/${$userBetarenaSettings.lang}`)
    }
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- adding SEO title and meta-tags to the /basket page -->
<SvelteSeo
    title='Betarena'
    description='Betarena'
    keywords='Betarena, 
        scores platform'
    noindex={false}
    nofollow={false}
    canonical='https://www.betarena.com/'
    twitter={{
        site: "@username",
        title: "Betarena",
        description: "Betarena",
        image: "https://www.example.com/images/cover.jpg",
        imageAlt: "Alt text for the card!",
    }}
    openGraph={{
        title: 'Betarena',
        description: 'Betarena',
        url: 'https://www.betarena.com/',
        type: 'website',
        images: [
            {
                url: 'https://www.example.com/images/og-image.jpg',
                width: 850,
                height: 650,
                alt: 'Og Image Alt'
            }
        ]
    }}
    jsonLd={{
        '@type': 'Article',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://example.com/article'
        },
        headline: 'Article headline',
        image: [
            'https://example.com/photos/1x1/photo.jpg',
            'https://example.com/photos/4x3/photo.jpg',
            'https://example.com/photos/16x9/photo.jpg'
        ],
        datePublished: '2020-08-03T17:31:37Z',
        dateModified: '2020-08-20T09:31:37Z',
        author: {
            '@type': 'Person',
            name: 'John Doe'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Google',
            logo: {
                '@type': 'ImageObject',
                url: 'https://example.com/logo.jpg'
            }
        }
    }}
/>

<!-- ===================
	COMPONENT HTML
=================== -->

<section id='home-page'>

    <div />

    <div />

    <FeaturedMatchWidget />
	
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
	section#home-page {
        display: grid;
        max-width: 1430px;
        grid-template-columns: 1fr;
	}

    /* 
    RESPONSIVE FOR TABLET (&+) [768px] */
    @media only screen and (min-width: 768px) {
        section#home-page {
            grid-template-columns: 1fr;
        }
    }

    /* 
    RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
    @media only screen and (min-width: 1024px) {
        section#home-page {
            gap: 20px;
            grid-template-columns: minmax(auto, 328px) minmax(auto, 502px) minmax(auto, 502px);
        }
    }
</style>