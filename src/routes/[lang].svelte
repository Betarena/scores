<!-- ===================
	COMPONENT JS - MODULE 
    [TypeScript Written]
=================== -->

<script context="module">
    // ... pre-loading function from svelte-kit
    export async function load({ page }) {
        if (dev) console.debug('page.params', page.params)
        const { lang } = page.params
        // ...
        if (dev) console.debug('lang', lang)
        return lang
    }
</script>

<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
    // ...
	import { amp, browser, dev, mode, prerendering } from '$app/env'
    // ...
    import SvelteSeo from "svelte-seo"
	// ...
	import header_bg from '$lib/header-background.svg'
    // ...
    // export let lang: string
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

<div id='background-image' />

<section>
	
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
	#background-image {
        background-image: url(/src/lib/header-background.svg);
        background-repeat: no-repeat;
        background-size: cover;
        background-origin: border-box;
        background-position: bottom;
        height: 495px;
	}
	
	section {
		
	}
</style>