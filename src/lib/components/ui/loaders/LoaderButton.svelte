<script lang="ts">
  import LoaderBadge from "./LoaderBadge.svelte";
  export let width: number = 104, r: number = 8, height: number = 42, clazz: string = '';

</script>

<LoaderBadge {width} {height} {r}  {clazz}/>