<script lang="ts">
  import { Tweened } from "svelte/motion";
  export let store: Tweened<any>;

</script>

<slot value={$store} />
