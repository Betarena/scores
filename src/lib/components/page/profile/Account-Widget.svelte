<!--===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { auth, db_firestore, storage } from "$lib/firebase/init";
	import { userBetarenaSettings } from "$lib/store/user-settings";
	import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

	import type { REDIS_CACHE_SINGLE_profile_translation } from "$lib/models/profile/account-setting/types";

	import { dlog, errlog } from "$lib/utils/debug";
	import { viewport_change } from "$lib/utils/platform-functions";
	import { deleteUser } from "firebase/auth";
	import { deleteDoc, doc, updateDoc } from "firebase/firestore";
	import { onMount } from "svelte";

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let RESPONSE_PROFILE_DATA: REDIS_CACHE_SINGLE_profile_translation
  // FIXME: missing Upload / Remove - Profile Picture Translation
  dlog(RESPONSE_PROFILE_DATA, true)

  let files: HTMLInputElement["files"];
  let fileInputElem: HTMLInputElement;
  let usernameInput: string;
  let profile_picture_exists:   boolean = false;
  let profile_wallet_connected: boolean = false;
  let processing: boolean = false;

	$: if (files) {
		upload_profile_picture()
	}

  $: profile_picture_exists = 
    $userBetarenaSettings?.user?.scores_user_data?.profile_photo == undefined 
    ? false 
    : true
  ;
  $: profile_wallet_connected = 
    $userBetarenaSettings?.user?.scores_user_data?.web3_wallet_addr == undefined 
    ? false 
    : true
  ;
  $: usernameInput = $userBetarenaSettings?.user?.scores_user_data?.username;
  
  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // TODO:
    // -> add profile picture crop (circular) step
  async function upload_profile_picture (): Promise < void > {
    // NOTE: `file` is of type `FileList`, not an Array:
		// DOC: https://developer.mozilla.org/en-US/docs/Web/API/FileList
    processing = true;
		for (const file_ of files) {
      dlog(`${file_.name}: ${file_.size} bytes`, false)
		}
    const storageRef = ref(
      storage, 
      `Users_data/${$userBetarenaSettings?.user?.firebase_user_data?.uid}.png`
    );
    // [ℹ] 'files' comes from the Blob or File API
    uploadBytes(storageRef, files[0])
    .then(async(snapshot) => {
      dlog('🟢 Uploaded file!')
      const url = await snapshot.ref.fullPath;
      dlog(url, true)
      console.log(url);
      getDownloadURL(storageRef)
      .then(async(url_) => {
        dlog(url_, true)
        userBetarenaSettings.updateProfilePicture(url_)
        // [ℹ] (update) from Firebase - Firestore
        const userRef = doc(
          db_firestore, 
          "betarena_users",
          $userBetarenaSettings?.user?.firebase_user_data?.uid
        );
        await updateDoc(userRef, {
          profile_photo: url_
        });
      })
    });
    processing = false;
  }

  async function remove_picture (): Promise < void > {
    if (!profile_picture_exists) {
      fileInputElem.click()
      return;
    }
    dlog('🔵 Removing user profile picture')
    // [ℹ] remove from localStorage()
    userBetarenaSettings.updateProfilePicture(undefined)
    // [ℹ] remove (update) from Firebase - Firestore
    const userRef = doc(
      db_firestore, 
      "betarena_users",
      $userBetarenaSettings?.user?.firebase_user_data?.uid
    );
    await updateDoc(userRef, {
      profile_photo: null
    });
    // [ℹ] remove from Firebase - Storage
    const desertRef = ref(
      storage, 
      `Users_data/${$userBetarenaSettings?.user?.firebase_user_data?.uid}.png`
    );
    deleteObject(desertRef).then(() => {
      dlog('ℹ️ Success - Profile picture removed')
    }).catch((error) => {
      errlog(error)
    });
  }

  /**
   * @description updates user's username on
   * firebase services; and localStorage
   * @returns
   */
  async function update_username (): Promise < void > {
    dlog('🔵 Username (update)')
    // [ℹ] (update)from localStorage()
    userBetarenaSettings.updateUsername(usernameInput)
    // [ℹ] (update)from Firebase - Firestore
    const userRef = doc(
      db_firestore, 
      "betarena_users",
      $userBetarenaSettings?.user?.firebase_user_data?.uid
    );
    await updateDoc(userRef, {
      username: usernameInput
    });
  }

  // TODO: update wallet address (+connect/disconnect)
    // -> connect to MetaMask and retrieve data
    // -> update Firestore: wallet-id + providers
    // -> display on Moralis/Users
  async function connect_wallet (): Promise < void > {
    // DOC: REF -> [1]
    try {
      processing = true
      auth_service = 'wallet'
      // [ℹ] restrict only to MetaMask (original)
      if (!provider('isMetaMask')[0]) {
        dlog("🔴 Moralis Auth not found!")
        alert('Please install the MetaMask Wallet Extension!')
        processing = false
        return
      }
      // [ℹ] create Moralis instance
      const moralisAuth = getMoralisAuth(app);
      // NOTE: default sign-in opt. is Metamask
      const moralis_auth = await signInWithMoralis(moralisAuth);
      dlog("🟢 Moralis Auth")
      success_auth_wrap(
        null, 
        moralis_auth?.credentials?.user?.displayName,
        auth_service
      )
    } catch (error) {
      errlog(`Moralis Auth error: ${error}`)
      processing = false;
    }
  }
  
  // TODO: save settings (persist changes made to current instance)
    // -> to localStorage()
    // -> firestore
  async function save_settings (): Promise < void > {

  }
  
  /**
   * @description removes user's data from all sources:
   * firebase services; and clears up localstorage; redirects
   * to main page
   * @returns
   */
  async function delete_user (): Promise < void > {
    dlog('🔵 Init - delete_user', true)
    // [ℹ] remove from Firebase - Storage
    const desertRef = ref(
      storage, 
      `Users_data/${$userBetarenaSettings?.user?.firebase_user_data?.uid}.png`
    );
    deleteObject(desertRef)
    .then(() => {
      dlog('ℹ️ Success - Profile picture removed')
    }).catch((error) => {
      errlog(error)
    });
    // [ℹ] remove from Firebase - Firestore
    // DOC: https://firebase.google.com/docs/firestore/manage-data/delete-data
    await deleteDoc(doc(
      db_firestore, 
      "betarena_users", 
      $userBetarenaSettings?.user?.firebase_user_data?.uid
    ));
    // [ℹ] remove from Firebase - Auth
    // DOC: https://firebase.google.com/docs/auth/web/manage-users#delete_a_user
    const user = auth.currentUser;
    deleteUser(user)
    .then(() => {
      dlog('ℹ User deleted from Auth')
    }).catch((error) => {
      errlog(error)
    });
    // [ℹ] from localStorage()
    userBetarenaSettings.signOutUser()
    dlog('🟢 Success! User deleted', true)
    // goto('/', {replaceState: true})
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES | IMPORTANT
  // ~~~~~~~~~~~~~~~~~~~~~

  const TABLET_VIEW = 768
  const MOBILE_VIEW = 767 // 768 - Tablet (start)
  let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] = viewport_change (
      TABLET_VIEW,
      MOBILE_VIEW
    )
		window.addEventListener('resize', function () {
		  [tabletExclusive, mobileExclusive] = viewport_change (
        TABLET_VIEW,
        MOBILE_VIEW
      )
		});
  });
</script>

<!--===============
COMPONENT HTML 
=================-->

<div
  id="account-settings-widget-box">
  <!-- 
  [ℹ] widget title
  -->
  <h2
    class="
      w-500
      s-20
      m-b-24
    "
    style="margin-top: 0px;">
    {RESPONSE_PROFILE_DATA?.acc_settings}
  </h2>
  <!-- 
  [ℹ] first row
  <-contents->
  [ℹ] profile photo text
  [ℹ] profile photo remove/upload
  <-conditional->
  -->
  <div
    class={!tabletExclusive ? 'row-space-out m-b-24' : 'm-b-24'}>
    <!-- 
    [ℹ] profile photo section row
    -->
    <div
      class:m-b-16={mobileExclusive}>
      <p
        class="
          s-16
          w-500
        "
        class:m-b-6={mobileExclusive}>
        {RESPONSE_PROFILE_DATA?.profile_photo}
      </p>
      <span
        class="
          m-t-5
          s-14
          color-grey
        ">
        {RESPONSE_PROFILE_DATA?.profile_photo_desc}
      </span>
    </div>
    <!-- 
    [ℹ] profile picture action (btn)
    -->
    <button
      class="
        btn-hollow
        w-500
        s-14
      "
      on:click={() => remove_picture()}>
      {!profile_picture_exists ? 'Upload' : 'Remove'}
    </button>
    <!-- 
    [ℹ] profile picture input
    -->
    {#if !profile_picture_exists}
      <input
        accept="image/png, image/jpeg"
        id="avatar"
        class="custom-file-input"
        name="avatar"
        bind:this={fileInputElem}
        bind:files={files}
        type="file"
        disabled={processing}
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
    class="
      m-b-24  
    ">
    <!-- 
    <-contents->
    [ℹ] username text
    [ℹ] username "required"
    -->
    <div
      class="
        row-space-start
        m-b-16
      ">
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
          class="row-space-start">
          <!-- 
          [ℹ] name "head" text
          -->
          <p
            class="
              s-16
              w-500
              m-r-6
            ">
            {RESPONSE_PROFILE_DATA?.username}
          </p>
          <!-- 
          [ℹ] name "required" text
          -->
          <p
            class="
              required-pill-tag
              s-12
            ">
            {RESPONSE_PROFILE_DATA?.required_field}
          </p>
        </div>
        <!-- 
        [ℹ] (user) text description
        -->
        <span
          class="
            s-14
            color-grey
          ">
          {RESPONSE_PROFILE_DATA?.name_desc}
        </span>
      </div>
    </div>
    <!-- 
    [ℹ] name input
    -->
    <input
      type="text"
      placeholder="{RESPONSE_PROFILE_DATA?.username}"
      aria-placeholder="Username input here"
      aria-label="Username input"
      bind:value={usernameInput}
    />
  </div>
  <!-- 
  [ℹ] third row
  <-contents->
  [ℹ] cryptocurrency wallet text
  [ℹ] cryptocurrency wallet update
  -->
  <div
    class={!tabletExclusive ? 'row-space-out m-b-24' : 'm-b-24'}>
    <!-- 
    [ℹ] username text (box)
    -->
    <div
      class:m-b-16={mobileExclusive}>
      <p
        class="
          s-16
          w-500
        "
        class:m-b-6={mobileExclusive}>
        {RESPONSE_PROFILE_DATA?.crypto_title}
      </p>
      <span
        class="
          s-14
          color-grey
        ">
        {RESPONSE_PROFILE_DATA?.crypto_desc}
      </span>
    </div>
    <!-- 
    [ℹ] button input
    -->
    <button
      class="
        btn-hollow
        w-500
        s-14
      ">
      {!profile_wallet_connected ? RESPONSE_PROFILE_DATA?.connect_wallet_title : RESPONSE_PROFILE_DATA?.disconnect_wallet_title}
    </button>
  </div>
  <!-- 
  [ℹ] save settings (button)
  -->
  <button
    class="btn-primary-v2"
    on:click={() => update_username()}>
    {RESPONSE_PROFILE_DATA?.save}
  </button>
  <!-- 
  [ℹ] divider
  -->
  <div
    id="settings-hr-divider"
    class={!mobileExclusive ? 'm-t-20  m-b-20' : 'm-t-30 m-b-30'}
  />
  <!-- 
  [ℹ] fourth row
  <-contents->
  [ℹ] delete text / desc
  [ℹ] delete account (action)
  -->
  <div
    class={!tabletExclusive ? 'row-space-out m-b-24' : ''}>
    <!-- 
    [ℹ] delete text / desc
    -->
    <div
      class:m-b-16={mobileExclusive}>
      <p
        class="
          s-16
          w-500
          color-red-bright
        "
        class:m-b-6={mobileExclusive}>
        {RESPONSE_PROFILE_DATA?.delete_account_title}
      </p>
      <span
        class="
          s-14
          color-grey
        ">
        {RESPONSE_PROFILE_DATA?.delete_desc}
      </span>
    </div>
    <!-- 
    [ℹ] delete action (btn)
    -->
    <button
      class="
        btn-hollow
        w-500
        s-14
        color-red-bright
      "
      on:click={() => delete_user()}>
      {RESPONSE_PROFILE_DATA?.delete_account_title}
    </button>
  </div>
</div>

<!--===============
COMPONENT STYLE
=================-->

<style>
  /* profile [settings] widget */
  div#account-settings-widget-box {
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 20px;
  }

  input[type='text'] {
    /* white theme/gray */
    border: 1px solid var(--grey-shade);
    box-sizing: border-box;
    border-radius: 8px;
    padding: 20px 12px;
    width: -webkit-fill-available;
    height: 44px;
    outline: none;
    font-size: 14px;
  } input[type='text']:hover {
    border: 1px solid var(--grey);
  } input[type='text']:focus {
    border: 1px solid var(--dark-theme-1);
  } input[type='text'][placeholder] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  button {
    width: -webkit-fill-available;
  }

  div#settings-hr-divider {
    width: 100%;
    height: 1px;
    background-color: var(--grey-color);
  }

  p.required-pill-tag {
    padding: 3px 8px;
    height: 24px;
    background-color: var(--oragne-pale-bg);
    border-radius: 32px;
  }

  /* input - custom file upload */
  .custom-file-input {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  /* ====================
    RESPONSIVNESS
  ==================== */

  @media only screen and (min-width: 575px)  {
    button {
      width: auto;
    }
  }

</style>