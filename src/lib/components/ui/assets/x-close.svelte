<script>
  export let color = "var(--colors-foreground-fg-quinary)";
  export let size = 24
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
>
  <path
    d="M18 6L6 18M6 6L18 18"
    stroke="{color}"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
