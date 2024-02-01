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

<div class="details-template-mobile-component">
  <div class="wrap">
    <div class="avatar">
      <ProfileAvatar imageSrc={avatar} imageAlt={authorName} />
    </div>
    <div class="details">
      <div class="about">
        <div class="author">
          <a href={authorHref}>{authorName}</a>
          {#if ai}
            <IconBadgeAI />
          {/if}
        </div>
        <div class="date">
          <span>{date}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="extra">
    <div class="geo">
      <IconPinLocation />
      <span>{location}</span>
    </div>
    <div class="time">
      <span>{readTime}</span>
      <span>&centerdot;</span>
      <span>{duration}</span>
    </div>
  </div>
</div>

<style lang="scss">
  .details-template-mobile-component {
    span,
    a {
      text-wrap: nowrap;
    }

    display: flex;
    flex-direction: column;
    gap: 12px;

    font-weight: 400;
    font-size: 12px;
    line-height: 1em;
    .wrap {
      display: flex;
      gap: 10px;
      .details {
        .about {
          display: flex;
          flex-direction: column;
          gap: 6px;
          .author {
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: 600;
            font-size: 14px;
          }
        }
      }
    }
    .extra {
      display: flex;
      align-items: center;
      gap: 16px;
      .geo {
        display: flex;
        align-items: center;
        line-height: 14px;
      }
      .time {
        display: flex;
        gap: 8px;
      }
    }
  }
</style>
