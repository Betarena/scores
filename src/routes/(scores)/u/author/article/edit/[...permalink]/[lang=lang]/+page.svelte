<script lang="ts">
  import EditArticle from "$lib/components/page/profile/pupblication/editor/EditArticle.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<EditArticle {data} />
