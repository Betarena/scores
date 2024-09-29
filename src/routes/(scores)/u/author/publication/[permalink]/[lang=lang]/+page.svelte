<script lang="ts">
    import WidgetPublication from '$lib/components/page/profile/pupblication/Widget-Publication.svelte';
    import type { PageData } from '.svelte-kit/types/src/routes/(scores)/u/author/create/[lang=lang]/$types.js';

    export let data: PageData;
</script>

<WidgetPublication {data} />