<div class="content-section-padding-horizontal">
  <slot />
</div>

<style lang="scss">
  .content-section-padding-horizontal {
    padding: 0 24px;
    padding-right: var(--mobile-padding-right, 24px);
    padding-left: var(--mobile-padding-left, 24px);

    // tablet and desktop
    @media only screen and (min-width: 768px) {
      padding: 0 80px;
    }
  }
</style>
