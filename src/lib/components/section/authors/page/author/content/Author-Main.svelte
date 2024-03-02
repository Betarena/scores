<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Authors Main                                                              │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

  import { onMount } from 'svelte';

  import icon_location_dark from './assets/icon-location-dark.svg';
  import icon_location from './assets/icon-location.svg';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { monthNames } from '$lib/utils/dates.js';

  import type { IArticleData } from '@betarena/scores-lib/types/types.authors.articles.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  export let
    /**
     * @augments IArticleData
    */
    widgetData: IArticleData
  ;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'author⮕w⮕author-content⮕main',
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ],
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  let
    /**
     * @description
     *  📣 Target data `map`.
    */
    tagMap = new Map(widgetData.tags_key_pair),
    /**
     * @description
     *  📣 Target assets `map`.
    */
    badgeMap = new Map(widgetData.badge_key_pair),
    /**
     * @description
     *  📣 Wether to execute animation.
    */
    executeAnimation = false
  ;

  $: ({ theme } = { ...$userBetarenaSettings });

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    () =>
    {
      setTimeout
      (
        () =>
        {
          executeAnimation = true;
        }, 100
      );

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id="{CNAME}"
>
  <!--
  ▓ NOTE:
  ▓ > article title
  -->
  <h1
    class=
    "
    s-38
    w-500
    m-b-32
    color-black-2
    m-0
    "
    style=
    "
    line-height: 54px;
    "
  >
    {widgetData.data?.title ?? ''}
  </h1>

  <!--
  ▓ NOTE:
  ▓ > article tags
  -->
  <div
    id="tags-box"
    class=
    "
    m-b-34
    "
  >
    <div
      id="tags-box-scroll"
    >
      <!-- [🐞] -->
      <!-- {#each [...widgetData.tags, ...widgetData.tags, ...widgetData.tags] as item} -->
      {#each [...widgetData.tags] as item}
        <div
          class=
          "
          tag-pill
          "
        >
          <p
            class=
            "
            s-14
            w-400
            color-black-2
            no-wrap
            "
          >
            {tagMap.get(item) ?? ''}
          </p>
        </div>
      {/each}
    </div>
  </div>

  <!--
  ▓ NOTE:
  ▓ > article author box
  -->
  <div
    class=
    "
    row-space-start
    m-b-24
    "
    style=
    "
    align-items: flex-start;
    "
  >

    <!--
    ▓ NOTE:
    ▓ > article author avatar
    -->
    <img
      id='user-avatar'
      src={widgetData.authors__authors__id__nested?.data?.avatar ?? ''}
      alt='user_avatar'
      title={widgetData.authors__authors__id__nested?.data?.username ?? ''}
      loading='lazy'
      class=
      "
      m-r-12
      effect
      "
      class:animate={executeAnimation}
    />

    <!--
    ▓ NOTE:
    ▓ > article author further information
    -->
    <div>
      <!--
      ▓ NOTE:
      ▓ > article author main info
      -->
      <div
        class=
        "
        row-space-start
        width-auto
        "
      >
        <!--
        ▓ NOTE:
        ▓ > article author name
        -->
        <p
          class=
          "
          s-14
          w-600
          color-black-2
          m-r-8
          no-wrap
          "
        >
          {widgetData.authors__authors__id__nested?.data?.username ?? ''}
        </p>

        <!--
        ▓ NOTE:
        ▓ > article author badges
        -->
        <div
          class=
          "
          row-space-start
          width-auto
          m-r-16
          "
        >
          {#each widgetData.authors__authors__id__nested?.data?.badges ?? [] as item}
            <img
              id=''
              src={badgeMap.get(item)?.data?.image ?? ''}
              alt={badgeMap.get(item)?.data?.description ?? ''}
              title={badgeMap.get(item)?.data?.description ?? ''}
              loading='lazy'
            />
          {/each}
        </div>

        <!--
        ▓ NOTE:
        ▓ > article author last active
        -->
        <p
          class=
          "
          s-12
          color-black-3
            dark-v1
          "
        >
          11 mins
          <span
            class=
            "
            m-r-5
            m-l-5
            "
          >
           •
          </span>
          2 day ago
        </p>
      </div>

      <!--
      ▓ NOTE:
      ▓ > article author extra info
      -->
      <div
        class=
        "
        row-space-start
        "
      >
        <!--
        ▓ NOTE:
        ▓ > article author creation date
        -->
        <p
          class=
          "
          s-12
          color-black-3
            dark-v1
          no-wrap
          m-r-12
          "
        >
          {monthNames[new Date(widgetData.authors__authors__id__nested?.data?.creation_date ?? '').getMonth()]}
          {new Date(widgetData.authors__authors__id__nested?.data?.creation_date ?? '').getDate()},
          {new Date(widgetData.authors__authors__id__nested?.data?.creation_date ?? '').getFullYear()}
        </p>

        <!--
        ▓ NOTE:
        ▓ > article author location
        -->
        <div
          class=
          "
          row-space-start
          "
        >
          <img
            id=''
            src={theme == 'Dark' ? icon_location_dark : icon_location}
            alt={theme == 'Dark' ? icon_location_dark : icon_location}
            title={theme == 'Dark' ? icon_location_dark : icon_location}
            loading='lazy'
            class=
            "
            m-r-5
            "
          />
          <p
            class=
            "
            s-12
            color-black-3
              dark-v1
            "
          >
            {widgetData.authors__authors__id__nested?.data?.location ?? ''}
          </p>
        </div>
      </div>

      <!--
      ▓ NOTE:
      ▓ > article author description / about
      -->
      <p
        class=
        "
        s-12
        color-black-3
          dark-v1
        m-t-12
        "
      >
        {widgetData.authors__authors__id__nested?.data?.about ?? ''}
      </p>
    </div>

  </div>

  <!--
  ▓ NOTE:
  ▓ > article banner
  src={widgetData.seo_details?.twitter_card.image}
  -->
  <img
    id='preview-banner'
    src="https://pbs.twimg.com/media/F5rQ5FPWkAASrF4.jpg:large"
    alt={widgetData.seo_details?.twitter_card.image_alt}
    title={widgetData.data?.title}
    loading='lazy'
    class=
    "
    m-b-24
    "
  />

  <!--
  ▓ NOTE:
  ▓ > article text
  -->
  <div
    id='content'
  >
    {@html widgetData.data?.content}
  </div>
</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#author⮕w⮕author-content⮕main
  {
    div#tags-box
    {
      /* 🎨 style */
      overflow: hidden;

      div#tags-box-scroll
      {
        /* 🎨 style */
        overflow-x: scroll;
        overflow-y: hidden;
        display: flex;
        gap: 10px;

        &::-webkit-scrollbar
        {
          /* Hide scrollbar for Chrome, Safari and Opera */
          display: none;
          /* Hide scrollbar for IE, Edge and Firefox */
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        div.tag-pill
        {
          /* 🎨 style */
          min-height: 26px;
          height: 26px;
          max-height: 26px;
          padding: 3px 12px;
          border-radius: 100px;
          background-color: var(--grey-color);
          cursor: pointer;

          &:hover
          {
            /* 🎨 style */
            background-color: var(--primary) !important;

            p
            {
              /* 🎨 style */
              color: var(--white) !important;
            }
          }
        }
      }
    }

    img#preview-banner
    {
      /* 🎨 style */
      width: 100%;
      max-height: 352px;
      object-fit: cover;
    }

    img#user-avatar
    {
      /* 🎨 style */
      width: 44px;
      height: 44px;
      border-radius: 50%;

      &.effect
      {
        transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        filter: blur(40px);
        transform: scaleX(1.1) scaleY(1.1);
      }

      &.animate
      {
        filter: none;
        transform: none;
      }
    }

    div#content
    {
      // ▓ IMPORTANT
      :global
      {
        *
        {
          /* 🎨 style */
          color: var(--dark-theme);
        }

        @mixin header
        {
          /* 🎨 style */
          line-height: 32px;
          font-weight: 800;
          margin: 40px 0 16px 0;
        }

        a
        {
          /* 🎨 style */
          text-decoration: underline !important;
          color: var(--primary) !important;
          font-weight: 500;
          width: fit-content !important;
          margin: 0;
          display: initial;
        }

        p
        {
          /* 🎨 style */
          font-size: 18px;
          line-height: 28px;
          color: var(--dark-theme);
          margin-bottom: 20px;
          font-weight: 300;
        }

        h2
        {
          /* 🎨 style */
          @include header;
          font-size: 24px;
        }

        h3,
        h4,
        h5
        {
          /* 🎨 style */
          @include header;
          font-size: 20px;
        }

        section
        {
          /* 🎨 style */
          all: unset;
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 560px)
  {
    div#author⮕w⮕author-content⮕main
    {
      div#content
      {
        // ▓ IMPORTANT
        :global
        {
          @mixin header
          {
            /* 🎨 style */
            line-height: 32px;
            font-weight: 700;
            margin: 40px 0 16px 0;
          }

          p
          {
            /* 🎨 style */
            line-height: 30px;
          }

          h2
          {
            /* 🎨 style */
            @include header;
            font-size: 24px;
          }

          h3
          , h5
          {
            /* 🎨 style */
            @include header;
            font-size: 20px;
          }

          section.faq-container
          {
            /* 🎨 style */
            padding: 0;
          }
        }
      }
    }
  }

  @media only screen
  and (min-width: 1160px)
  {
    div#author⮕w⮕author-content⮕main
    {
      div#content
      {
        // ▓ IMPORTANT
        :global
        {
          @mixin header
          {
            /* 🎨 style */
            line-height: 32px;
            font-weight: 700;
            margin: 40px 0 16px 0;
          }

          p
          {
            /* 🎨 style */
            font-size: 20px;
            line-height: 32px;
          }

          h2
          {
            /* 🎨 style */
            @include header;
            font-size: 24px;
          }

          h3
          , h5
          {
            /* 🎨 style */
            @include header;
            font-size: 20px;
          }

          section.faq-container
          {
            /* 🎨 style */
            padding: 0;
          }
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  .dark-mode
  {
    div#author⮕w⮕author-content⮕main
    {
      div#tags-box
      {
        div#tags-box-scroll
        {
          div.tag-pill
          {
            /* 🎨 style */
            background-color: var(--dark-theme-1);
          }
        }
      }

      div#content
      {
        // ▓ IMPORTANT
        :global
        {
          *
          {
            /* 🎨 style */
            color: var(--white);
          }
        }
      }
    }
  }

</style>
