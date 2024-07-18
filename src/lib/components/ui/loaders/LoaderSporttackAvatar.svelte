<script lang="ts">
  import LoaderBadge from './LoaderBadge.svelte';
  export let width = 48;
  export let height = 48;
</script>


<LoaderBadge {width} {height} r={4} {...$$restProps}/>

