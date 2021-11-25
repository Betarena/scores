<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang='ts'>
	import { goto, invalidate, prefetch, prefetchRoutes } from '$app/navigation';

	import { langSelect } from '$lib/store/lang-select'

    // ... redirecting the users to the correct translation page;
    redirect()
    async function redirect() {
        await goto(`/${$langSelect}`)
    }
</script>