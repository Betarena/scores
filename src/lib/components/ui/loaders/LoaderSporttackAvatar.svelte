<script lang="ts">
  import LoaderBadge from './LoaderBadge.svelte';
  export let size = 48;
</script>


<LoaderBadge width={size} height={size} r={4} {...$$restProps}/>

