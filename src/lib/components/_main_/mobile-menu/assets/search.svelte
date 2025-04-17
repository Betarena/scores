<script lang="ts">
  export let color: string = 'var(--icon-color)';
  export const contrastColor: string = 'var(--icon-contrast-color)';
  export let type: "outline" | "solid" = "outline";

  $: fill = type === "outline" ? "none" : color;
  $: stroke = type === "outline" ? color : contrastColor;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="{stroke}" stroke-width="1.66" stroke-linecap="round" stroke-linejoin="round"/>
</svg>