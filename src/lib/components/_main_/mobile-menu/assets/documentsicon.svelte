<script lang="ts">
  export let color: string = 'var(--colors-foreground-fg-quaternary-400)';
  export const contrastColor: string = 'var(--icon-contrast-color)';
  export let type: "outline" | "solid" = "outline";

  $: fill = type === "outline" ? "none" : color;
  $: stroke = type === "outline" ? color : contrastColor;
</script>

<svg width="25" height="24" viewBox="0 0 25 24" {fill} xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.914 6.414L16.086 3.586C15.711 3.211 15.202 3 14.672 3H7.5C6.395 3 5.5 3.895 5.5 5V19C5.5 20.105 6.395 21 7.5 21H17.5C18.605 21 19.5 20.105 19.5 19V7.828C19.5 7.298 19.289 6.789 18.914 6.414V6.414Z" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.5 8H15.5C14.948 8 14.5 7.552 14.5 7V3" {stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.5 11H14.5" {stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.5 14H14.5" {stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.5 17H12.83" {stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
