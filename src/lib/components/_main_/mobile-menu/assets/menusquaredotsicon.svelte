<script lang="ts">
  export let color: string = 'var(--icon-color)';
  export const contrastColor: string = 'var(--icon-contrast-color)';
  export let type: "outline" | "solid" = "outline";

  $: fill = color;
  $: fOpacity = type === "outline" ? "0" : "1";
  $: stroke = type === "outline" ? color : contrastColor;
</script>


<svg width="25" height="24" viewBox="0 0 25 24" {fill} fill-opacity={fOpacity} xmlns="http://www.w3.org/2000/svg">
<rect x="3.49658" y="2.99622" width="18.0075" height="18.0075" rx="5" stroke = {"outline" ? color : "none"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.99895 8.99874C9.99895 8.72249 9.775 8.49854 9.49874 8.49854C9.22249 8.49854 8.99854 8.72249 8.99854 8.99874C8.99854 9.275 9.22249 9.49895 9.49874 9.49895C9.775 9.49895 9.99895 9.275 9.99895 8.99874" {stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.0014 8.99874C16.0014 8.72249 15.7774 8.49854 15.5012 8.49854C15.2249 8.49854 15.001 8.72249 15.001 8.99874C15.001 9.275 15.2249 9.49895 15.5012 9.49895C15.7774 9.49895 16.0014 9.275 16.0014 8.99874" {stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.99895 15.0012C9.99895 14.725 9.775 14.501 9.49874 14.501C9.22249 14.501 8.99854 14.725 8.99854 15.0012C8.99854 15.2775 9.22249 15.5015 9.49874 15.5015C9.775 15.5015 9.99895 15.2775 9.99895 15.0012" {stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.0014 15.0012C16.0014 14.725 15.7774 14.501 15.5012 14.501C15.2249 14.501 15.001 14.725 15.001 15.0012C15.001 15.2775 15.2249 15.5015 15.5012 15.5015C15.7774 15.5015 16.0014 15.2775 16.0014 15.0012" {stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
