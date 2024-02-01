<script lang="ts">
  import ProfileAvatar from "$lib/components/shared/avatar/ProfileAvatar.svelte";
  import IconBadgeAI from "$lib/components/shared/icons/IconBadgeAI.svelte";
  import IconPinLocation from "$lib/components/shared/icons/IconPinLocation.svelte";

  export let avatar: string | undefined = undefined;
  export let authorName: string;
  export let authorHref: string;
  export let date: string;
  export let location: string;
  export let readTime: string;
  export let duration: string;
  export let ai: boolean = false;
</script>

<div class="details-template-tablet-component">
  <div class="avatar">
    <ProfileAvatar imageSrc={avatar} imageAlt={authorName} />
  </div>
  <div class="details">
    <div class="title">
      <div class="author">
        <a href={authorHref}>{authorName}</a>
        {#if ai}
          <IconBadgeAI />
        {/if}
      </div>
      <div class="time">
        <span>{readTime}</span>
        <span>&centerdot;</span>
        <span>{duration}</span>
      </div>
    </div>
    <div class="subtitle">
      <div class="date">
        <span>{date}</span>
      </div>
      <div class="geo">
        <IconPinLocation />
        <span>{location}</span>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .details-template-tablet-component {
    span,
    a {
      text-wrap: nowrap;
    }

    display: flex;
    gap: 12px;

    font-weight: 400;
    font-size: 12px;
    line-height: 1em;
    .details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .title {
        display: flex;
        align-items: center;
        gap: 16px;
        .author {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
          line-height: 14px;
          a:hover {
            text-decoration: underline !important; // override global css
          }
        }
        .time {
          display: flex;
          gap: 8px;
        }
      }
      .subtitle {
        display: flex;
        align-items: center;
        gap: 12px;
        .geo {
          display: flex;
          align-items: center;
          line-height: 14px;
        }
      }
    }
  }
</style>
