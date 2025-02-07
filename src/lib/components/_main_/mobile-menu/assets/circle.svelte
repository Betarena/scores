<script lang="ts">
  export let color: string = 'var(--icon-color)';
  export const contrastColor: string = 'var(--icon-contrast-color)';
  export let type: "outline" | "solid" = "outline";

  $: fill = type === "outline" ? "none" : color;
  $: stroke = type === "outline" ? color : contrastColor;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M17.8778 20.0902C16.1693 21.3315 14.1117 22 11.9999 22C9.88812 22 7.83054 21.3315 6.12206 20.0902M16.3836 3.01206C18.2817 3.93781 19.838 5.44068 20.8294 7.30528C21.8208 9.16989 22.1965 11.3005 21.9026 13.3917M2.09733 13.3916C1.80343 11.3004 2.17911 9.16979 3.17053 7.30519C4.16196 5.44059 5.71823 3.93771 7.6163 3.01196M17.4999 12C17.4999 15.0376 15.0375 17.5 11.9999 17.5C8.96235 17.5 6.49991 15.0376 6.49991 12C6.49991 8.96244 8.96235 6.5 11.9999 6.5C15.0375 6.5 17.4999 8.96244 17.4999 12Z" stroke="{stroke}" stroke-width="1.66" stroke-linecap="round" stroke-linejoin="round"/>
</svg>