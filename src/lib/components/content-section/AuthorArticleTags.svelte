<script lang="ts">
  import Tag from "$lib/components/shared/tags/Tag.svelte";
  export let dark: boolean = false;
</script>

<div class="author-article-tags-component">
  <Tag text="Bitcoin" {dark}/>
  <Tag text="Intermediate" {dark}/>
  <Tag text="Ethnology" {dark}/>
  <Tag text="Bitcoin" {dark}/>
  <Tag text="Intermediate" {dark}/>
  <Tag text="Ethnology" {dark}/>
  <Tag text="Bitcoin" {dark}/>
  <Tag text="Intermediate" {dark}/>
  <Tag text="Ethnology" {dark}/>
  <Tag text="Bitcoin" {dark}/>
  <Tag text="Intermediate" {dark}/>
  <Tag text="Ethnology" {dark}/>
</div>

<style lang="scss">
  .author-article-tags-component {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    // mobile
    gap: 4px;
    // tablet and desktop
    @media only screen and (min-width: 768px) {
      gap: 6px;
    }
  }
</style>
