<script lang="ts">
    import WidgetPublicationCreate from '$lib/components/page/profile/punblication/Widget-PublicationCreate.svelte';
    import type { PageData } from '.svelte-kit/types/src/routes/(scores)/u/author/create/[lang=lang]/$types.js';

    export let data: PageData;
</script>

<WidgetPublicationCreate {data} />