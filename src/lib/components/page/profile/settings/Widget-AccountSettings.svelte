<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Overview                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Code Format   // V.8.0                                                         │
│ ➤ Status        // 🔒 LOCKED                                                     │
│ ➤ Author(s)     // @migbash                                                      │
│ ➤ Maintainer(s) // @migbash                                                      │
│ ➤ Created on    // February 21st, 2023                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ BETARENA (Module) :: User Profile :: Account Settings Widget                     │
│ |: User Profile :: Account Settings Widget
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

	import { page } from '$app/stores';

	import { getDownloadURL, ref, uploadString } from 'firebase/storage';

	import { storage } from '$lib/firebase/init';
	import { storePageProfileSettings } from '$lib/store/page.profile.settings.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog, errlog, log_v3 } from '$lib/utils/debug';
	import { viewportChangeV2 } from '$lib/utils/device.js';
	import { deleteUserProfile, updateUserProfileData } from '$lib/utils/user.js';
	import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';

	import ModalConnectWallet from './Modal-ConnectWallet.svelte';
	import ModalDeleteAccount from './Modal-DeleteAccount.svelte';
	import ModalProfilePictureCrop from './Modal-ProfilePictureCrop.svelte';

  import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

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
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 767, true ],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 768, true ]
  ;

  let
    /**
     * @description
     * 📝
     */
    noWidgetData: boolean = true,
    /**
     * @description
     *  📝 Instance of `FileList`
     * @ntoe
     *  📝 `file` is of type `FileList`, not an Array.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/FileList
     */
    files: HTMLInputElement['files'],
    /**
     * @description
     * 📝
     */
    fileInputElem: HTMLInputElement,
    /**
     * @description
     * 📝
     */
    usernameInput: string = $userBetarenaSettings.user?.scores_user_data?.username,
    /**
     * @description
     * 📝
     */
    nameInput: string = $userBetarenaSettings.user?.scores_user_data?.name || '',
    /**
     * @description
     * 📝
     */
    aboutInput: string = $userBetarenaSettings.user?.scores_user_data?.about || '',
    /**
     * @description
     * 📝
     */
    isShowAccountDeletionModal = false,
    /**
     * @description
     * 📝
     */
    isShowWalletModal = false,
    /**
     * @description
     * 📝
     */
    isShowProfilePictureCropModal = false,
    /**
     * @description
     * 📝
     */
    svelteComponentModalProfilePictureCrop: ModalProfilePictureCrop
  ;

  $: ( { windowWidth } = $sessionStore );
  $: ( { globalState, globalStateErrors, globalStateErrorUsername } = $storePageProfileSettings );

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  $: [VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1]]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0]
    )
  ;

  $: profilePicExists
    = $userBetarenaSettings.user?.scores_user_data
      ?.profile_photo == undefined
      ? false
      : true
  ;
  $: isWalletConnected
    = $userBetarenaSettings.user?.scores_user_data
      ?.web3_wallet_addr == undefined
      ? false
      : true
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  async function selectUserProfilePicture
  (
  ): Promise < void >
  {
    // [🐞]
    for (const file_ of files ?? [])
      // [🐞]
      dlog
      (
        `${file_.name}: ${file_.size} ${typeof file_} type`,
        true
      );
    ;

    if (!files || files.length == 0)
      return;
    ;

    // ╭─────
    // │ NOTE:
    // │ |: Limit file size to 10MB
    // ╰─────
    if (files[0].size >= 10000000)
    {
      // [🐞]
      alert
      (
        'WARNING: Uploaded picture is too large. Limit is 10MB.'
      );

      files = undefined;

      return;
    }

    svelteComponentModalProfilePictureCrop.load_picture(files[0]);
    isShowProfilePictureCropModal = true;
    files = undefined;

    return;
  }

  async function updateUserProfilePicture
  (
    event
  ): Promise < void >
  {
    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        // [🐞]
        log_v3
        (
          {
            strGroupName: 'updateUserProfilePicture(..)',
            msgs:
            [
              '🟢 Updating user profile picture...',
              `🔗 ${event?.detail?.img}`
            ]
          }
        );

        isShowProfilePictureCropModal = false;

        const
          /**
           * @description
           * 📝
           */
          instStorageDocRef
            = ref
            (
              storage,
              `Users_data/${$userBetarenaSettings.user?.firebase_user_data?.uid}/profile-pic.png`
            ),
          /**
           * @description
           * 📝
           */
          dataRes0
            = await uploadString
            (
              instStorageDocRef,
              event?.detail?.img,
              'data_url'
            ),
          /**
           * @description
           * 📝
           */
          dataRes1
            = await getDownloadURL
            (
              instStorageDocRef
            )
        ;

        // [🐞]
        log_v3
        (
          {
            strGroupName: 'updateUserProfilePicture(..) // END',
            msgs:
            [
              '🟢 Uploaded file!',
              `🔗 ${dataRes0.ref.fullPath}`,
              `🔗 ${dataRes1}`
            ]
          }
        );

        await updateUserProfileData
        (
          {
            profile_photo: dataRes1
          }
        );

        return;
      }
    );
    return;
  }

  async function deleteUserProfilePicture
  (
  ): Promise < void >
  {
    if (!profilePicExists)
    {
      fileInputElem.click();
      return;
    }

    updateUserProfileData
    (
      {
        profile_photo: null
      }
    );

    return;
  }

  async function helperConnectWeb3Wallet
  (
  ): Promise < void >
  {
    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        if (isWalletConnected)
        {
          // [🐞]
          dlog('Removing user wallet web3 connection...');

          updateUserProfileData
          (
            {
              wallet_id: null
            }
          );

          return;
        }

        storePageProfileSettings.updateData
        (
          [
            [ 'globalStateAdd', 'Processing' ]
          ]
        );

        isShowWalletModal = true;

        return;
      },
      (
        error
      ) =>
      {
        // [🐞]
        errlog(`helperConnectWeb3Wallet() error: ${error}`);

        storePageProfileSettings.updateData
        (
          [
            [ 'globalStateRemove', 'Processing' ]
          ]
        );

        return;
      }
    );
    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  $: if (profileTrs != undefined)
    noWidgetData = false;
  ;

  $: if (files != undefined)
    selectUserProfilePicture();
  ;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

<!--
[component]
|: Delete Account Modal
-->
{#if isShowAccountDeletionModal}
  <ModalDeleteAccount
    on:toggle_delete_modal=
    {
      () =>
      {
        isShowAccountDeletionModal = false;
        return;
      }
    }
    on:delete_account=
    {
      async (
      ) =>
      {
        await deleteUserProfile();
        return;
      }
    }
  />
{/if}

<!--
[component]
|: Wallet (web3) Connect Modal
-->
{#if isShowWalletModal}
	<ModalConnectWallet
		on:toggle_delete_modal=
    {
      () =>
      {
        isShowWalletModal = false;
        return;
      }
    }
		on:connect_wallet_action=
    {
      async (
        event
      ) =>
      {
        isShowWalletModal = false;
        await updateUserProfileData
        (
          {
            wallet_id: event.detail.wallet_id
          }
        );
        return;
      }
    }
	/>
{/if}

<!--
[component]
|: Crop Profile Picture Modal
-->
<ModalProfilePictureCrop
  bind:this={svelteComponentModalProfilePictureCrop}
  modal_pic_crop_show={isShowProfilePictureCropModal}
  on:toggle_delete_modal=
  {
    () =>
    {
      isShowProfilePictureCropModal = false;
      fileInputElem.value = '';
      return;
    }
  }
  on:upload_selected_img=
  {
    async (
      event
    ) =>
    {
      await updateUserProfilePicture(event);
      return;
    }
  }
/>

<!--
Profile Settings
-->
{#if !noWidgetData}

  <div
    id="account-settings-widget-box"
    class:dark={$userBetarenaSettings.theme == 'Dark'}
  >

    <!--
    WIDGET TITLE
    -->
    <h2
      class=
      "
      w-500
      s-20
      m-b-24
      text-color
      "
      style="margin-top: 0px;"
    >
      {profileTrs.profile?.acc_settings}
    </h2>

    <!--
    [ℹ] first row
    <-contents->
    [ℹ] profile photo text
    [ℹ] profile photo remove/upload
    <-conditional->
    -->
    <div
      class=
      {
        !VIEWPORT_TABLET_INIT[1]
          ? 'row-space-out m-b-24'
          : 'm-b-24'
      }
    >

      <!--
      PROFILE PHOTO - ROW
      -->
      <div
        class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
      >
        <p
          class=
          "
            s-16
            w-500
            text-color
            m-b-5
          "
          class:m-b-6={VIEWPORT_MOBILE_INIT[1]}
        >
          {profileTrs.profile?.profile_photo}
        </p>
        <span
          class=
          "
            m-t-5
            s-14
            color-grey
          "
        >
          {profileTrs.profile?.profile_photo_desc}
        </span>
      </div>

      <!--
      PROFILE PICTURE ACTION - ROW
      -->
      <button
        class="
          btn-hollow
          w-500
          s-14
          text-color
        "
        on:click=
        {
          () =>
          {
            deleteUserProfilePicture();
            return;
          }
        }
      >
        {!profilePicExists
          ? profileTrs.profile?.upload
          : profileTrs.profile?.remove}
      </button>

      <!--
      PROFILE PICTURE INPUT
      -->
      {#if !profilePicExists}
        <input
          accept="image/png, image/jpeg"
          id="avatar"
          class="custom-file-input"
          name="avatar"
          bind:this={fileInputElem}
          bind:files
          type="file"
          disabled={globalState.has('Processing')}
        />
      {/if}

    </div>

    <!--
    [ℹ] second row
    <-contents->
    [ℹ] username text
    [ℹ] username update
    -->
    <div
      class=
      "
      m-b-24
      "
    >

      <!--
      <-contents->
      [ℹ] username text
      [ℹ] username "required"
      -->
      <div
        class=
        "
        row-space-start
        m-b-16
        "
      >
        <!--
        <-contents->
        [ℹ] name "head" text
        [ℹ] name "required" text
        [ℹ] (user) text description
        -->
        <div>
          <!--
          <-contents->
          [ℹ] name "head" text
          [ℹ] name "required" text
          -->
          <div
            class="
              row-space-start
              m-b-5
            ">
            <!--
            [ℹ] name "head" text
            -->
            <p
              class="
              s-16
              w-500
              m-r-6
              text-color
            "
            >
              {profileTrs.profile?.username}
            </p>
            <!--
            [ℹ] name "required" text
            -->
            <p
              class="
                required-pill-tag
                s-12
              "
            >
              {profileTrs.profile?.required_field}
            </p>
          </div>
          <!--
          [ℹ] (user) text description
          -->
          <span
            class="
              s-14
              color-grey
            "
          >
            {profileTrs.profile?.name_desc}
          </span>
        </div>
      </div>

      <!--
      [ℹ] name input
      -->
      <input
        type="text"
        placeholder={profileTrs.profile?.username}
        aria-placeholder="Username input here"
        aria-label="Username input"
        bind:value={usernameInput}
        class:input-error={globalStateErrors.has('ErrorUsername')}
      />

      <!--
      <-conditional->
      [ℹ] error message input
      -->
      {#if globalStateErrors.has('ErrorUsername')}
        <p
          class="
            s-14
            color-error
          ">
          {globalStateErrorUsername}
        </p>
      {/if}

    </div>
    <!--
    [ℹ] third row
    <-contents->
    [ℹ] name text
    [ℹ] name update
    -->
    <div
      class=
      "
        m-b-24
      "
    >

      <!--
      <-contents->
      [ℹ] name text
      -->
      <div
        class="
          row-space-start
          m-b-16
        "
      >
        <!--
        <-contents->
        [ℹ] name "head" text
        [ℹ] (user) text description
        -->
        <div>
          <!--
          <-contents->
          [ℹ] name "head" text
          -->
          <div
            class="
              row-space-start
              m-b-5
            ">
            <!--
            [ℹ] name "head" text
            -->
            <p
              class="
              s-16
              w-500
              m-r-6
              text-color
            "
            >
              {profileTrs.profile?.name_2}
            </p>

          </div>
          <!--
          [ℹ] (user) text description
          -->
          <span
            class="
              s-14
              color-grey
            "
          >
            {profileTrs.profile?.name_description}
          </span>
        </div>
      </div>

      <!--
      [ℹ] name input
      -->
      <input
        type="text"
        placeholder={profileTrs.profile?.name_2_form_field}
        aria-placeholder="Name input here"
        aria-label="Name input"
        bind:value={nameInput}
      />

    </div>
    <!--
    [ℹ] fourth row
    <-contents->
    [ℹ] about text
    [ℹ] about update
    -->
    <div
      class=
      "
        m-b-24
      "
    >

      <!--
      <-contents->
      [ℹ] about text
      -->
      <div
        class="
          row-space-start
          m-b-16
        "
      >
        <!--
        <-contents->
        [ℹ] name "head" text
        [ℹ] (user) text description
        -->
        <div>
          <!--
          <-contents->
          [ℹ] name "head" text
          -->
          <div
            class="
              row-space-start
              m-b-5
            ">
            <!--
            [ℹ] name "head" text
            -->
            <p
              class="
              s-16
              w-500
              m-r-6
              text-color
            "
            >
              {profileTrs.profile?.about}
            </p>
          </div>
          <!--
          [ℹ] (user) text description
          -->
          <span
            class="
              s-14
              color-grey
            "
          >
            {profileTrs.profile?.about_description }
          </span>
        </div>
      </div>

      <!--
      [ℹ] about textarea input
      -->
      <div class="textarea-wrapper">

      <textarea
        class="input"
        maxlength="256"
        cols="10"
        rows="3"
        placeholder={profileTrs.profile?.about_form_field}
        aria-placeholder="Username input here"
        aria-label="Username input"
        bind:value={aboutInput}
      />
      <span class="counter">{aboutInput.length}/256</span>
    </div>

    </div>

    <!--
    [ℹ] fifth row
    <-contents->
    [ℹ] cryptocurrency wallet text
    [ℹ] cryptocurrency wallet update
    -->
    <div
      class=
      {
        !VIEWPORT_TABLET_INIT[1]
          ? 'row-space-out m-b-24'
          : 'm-b-24'
      }
    >
      <!--
      [ℹ] username text (box)
      -->
      <div class:m-b-16={VIEWPORT_MOBILE_INIT[1]}>
        <p
          class="
            s-16
            w-500
            text-color
            m-b-5
          "
          class:m-b-6={VIEWPORT_MOBILE_INIT[1]}
        >
          {profileTrs.profile?.crypto_title}
        </p>
        <span
          class="
            s-14
            color-grey
          "
        >
          {profileTrs.profile?.crypto_desc}
        </span>
      </div>
      <!--
      [ℹ] button action
      -->
      <button
        class=
        "
        btn-hollow
        w-500
        s-14
        text-color
        "
        class:m-l-24={!VIEWPORT_TABLET_INIT[1]}
        on:click=
        {
          () =>
          {
            helperConnectWeb3Wallet();
            return;
          }
        }
      >
        {!isWalletConnected
          ? profileTrs.profile?.connect_wallet_title
          : profileTrs.profile?.disconnect_wallet_title}
      </button>
    </div>

    <!--
    SAVE SETTINGS (BTN)
    -->
    <button
      class=
      "
      btn-primary-v2
      w-500
      s-14
      "
      on:click=
      {
        async () =>
        {
          await updateUserProfileData
          (
            {
              username: usernameInput,
              name: nameInput,
              about: aboutInput
            }
          );
          return;
        }
      }
    >
      {profileTrs.profile?.save}
    </button>

    <!--
    DIVIDER
    -->
    <div
      id="settings-hr-divider"
      class=
      {
        !VIEWPORT_MOBILE_INIT[1]
          ? 'm-t-20  m-b-20'
          : 'm-t-30 m-b-30'
      }
    />

    <!--
    [ℹ] six row
    <-contents->
    [ℹ] delete text / desc
    [ℹ] delete account (action)
    -->
    <div
      class=
      {
        !VIEWPORT_TABLET_INIT[1]
          ? 'row-space-out m-b-24'
          : ''
      }
    >

      <!--
      [ℹ] delete text / desc
      -->
      <div
        class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
      >

        <p
          class=
          "
            s-16
            w-500
            color-red-bright
          "
          class:m-b-6={VIEWPORT_MOBILE_INIT[1]}
        >
          {profileTrs.profile?.delete_account_title}
        </p>

        <span
          class=
          "
            s-14
            color-grey
          "
        >
          {profileTrs.profile?.delete_desc}
        </span>

      </div>

      <!--
      [ℹ] delete action (btn)
      -->
      <button
        class=
        "
          btn-hollow
          w-500
          s-14
          color-red-bright
          danger
        "
        on:click=
        {
          () =>
          {
            isShowAccountDeletionModal = true;
            return;
          }
        }
      >
        {profileTrs.profile?.delete_account_title}
      </button>

    </div>

  </div>

{/if}

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
  profile [settings] widget
  */
	div#account-settings-widget-box
  {
		background: var(--colors-background-bg-secondary, #232323);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 20px;

    .text-color {
      color: var(--text-color);
    }
	}

	input[type='text'], textarea
  {
		/* white theme/gray */
		border: 1px solid var(--grey-shade);
		box-sizing: border-box;
		border-radius: 8px;
		padding: 20px 12px;
		width: 100%;
		height: 44px;
		outline: none;
		font-size: 14px;
	}
  textarea
  {
    height: 88px;
    padding: 20px 11px;
    resize: none;
    font-family: Arial, Helvetica, sans-serif;
    position: relative;
    white-space: normal !important;
  }
  .textarea-wrapper
  {
    position: relative;
  }
  .textarea-wrapper .counter
  {
    position: absolute;
    bottom: 10px;
    right: 14px;
    font-size: 14px;
    color: var(--grey);
  }
	input[type='text']:hover,
  textarea:hover
  {
		border: 1px solid var(--grey);
	}
	input[type='text']:focus,
  textarea:focus
  {
		border: 1px solid var(--colors-background-bg-secondary, #232323);
	}
	input[type='text'][placeholder],
  textarea[placeholder]
  {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
  input[type='text'].input-error,
  textarea.input-error
  {
    border: 1px solid var(--red-bright) !important;
  }

	button
  {
		width: 100%;
	}

	div#settings-hr-divider
  {
		width: 100%;
		height: 1px;
		background-color: var(--grey-color);
	}

	p.required-pill-tag
  {
		padding: 3px 8px;
		height: 24px;
		background-color: var(--oragne-pale-bg);
    color: var(--primary-fade);
		border-radius: 32px;
	}

	.custom-file-input
  {
		opacity: 0;
		position: absolute;
		z-index: -1;
	}

	/*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	@media only screen
  and (min-width: 575px)
  {
		button
    {
			width: auto;
		}
	}

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#account-settings-widget-box.dark
  {
		// box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
		background-color: var(--colors-background-bg-secondary, #232323);
	}

  div#account-settings-widget-box.dark input[type='text'], div#account-settings-widget-box.dark textarea
  {
    background: var(--colors-background-bg-secondary, #232323);
    border: 1px solid var(--dark-theme-1-2-shade);
    color: var(--white)
  }

  div#account-settings-widget-box.dark div#settings-hr-divider
  {
    background-color: var(--dark-theme-1-2-shade);
  }

  div#account-settings-widget-box.dark p.required-pill-tag
  {
    color: var(--primary-fade)
  }

  div#account-settings-widget-box.dark button.btn-hollow.danger
  {
    border: 1px solid var(--dark-theme-1-2-shade) !important;
  }

  div#account-settings-widget-box.dark input[type='text']:hover,
  div#account-settings-widget-box.dark input[type='text']:focus,
  div#account-settings-widget-box.dark textarea:focus
  div#account-settings-widget-box.dark textarea:hover
  {
    border: 1px solid var(--dark-theme-1-3-shade)!important;
  }

</style>
