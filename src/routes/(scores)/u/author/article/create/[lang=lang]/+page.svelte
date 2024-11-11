<script lang="ts">
  import CreateArticle from "$lib/components/page/profile/pupblication/editor/CreateArticle.svelte";
  import { PageData } from ".svelte-kit/types/src/routes/(scores)/u/author/article/create/[lang=lang]/$types.js";

  export let data: PageData;
</script>

<CreateArticle {data} />
