<script lang="ts">
  import Tag from "$lib/components/shared/tags/Tag.svelte";
  export let dark: boolean = false;
</script>

<div class="author-badges-component">
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
  <div class="gradient">    
  </div>
</div>

<style lang="scss">
  .author-badges-component {
    // mobile
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    overflow-y: hidden;
    &::-webkit-scrollbar { display: none; }
    gap: 4px;

    // tablet and desktop
    @media only screen and (min-width: 768px) {
      gap: 6px;
      overflow: visible;
      flex-wrap: wrap;
    }
  }
</style>
