<script lang="ts">
  import ProfileAvatar from "$lib/components/shared/avatar/ProfileAvatar.svelte";
  import IconBadgeAI from "$lib/components/shared/icons/IconBadgeAI.svelte";
</script>

<div class="author-article-details-component">
  <div class="avatar">
    <ProfileAvatar />
  </div>
  <div class="details">
    <div class="about">
      <div class="author">
        <span>Tiago Luchtenberg</span>
        <IconBadgeAI />
      </div>
      <div class="time">
        <span>11mins</span>
        <span>&centerdot;</span>
        <span>2 day ago</span>
      </div>
    </div>
    <div class="geo">
      <span>December 4, 2023</span>
      <span>Chicago, IL</span>
    </div>
    <div class="description">
      <span
        >Tiago covers lifestyle content and local news for the Chicaco area.</span>
    </div>
  </div>
</div>

<style lang="scss">
  .author-article-details-component {
    display: flex;
    flex-direction: row;
    // mobile
    gap: 10px;
    // tablet and desktop
    @media only screen and (min-width: 768px) {
      gap: 12px;
    }
    .avatar {

    }
  }
</style>
