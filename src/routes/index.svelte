<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';
	import { amp, browser, dev, mode, prerendering } from '$app/env';

	import { langSelect } from '$lib/store/lang-select'

    // ... redirecting the users to the correct translation page;
    // $: if (dev) console.debug('$langSelect', $langSelect)
    if (browser && $langSelect != undefined) {
        redirect()
    }
    async function redirect() {
        await goto(`/${$langSelect}`)
    }
</script>