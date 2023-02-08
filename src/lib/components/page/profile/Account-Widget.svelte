<!--===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { db_firestore, storage } from "$lib/firebase/init";
	import { userBetarenaSettings } from "$lib/store/user-settings";
	import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

	import type { REDIS_CACHE_SINGLE_profile_translation } from "$lib/models/profile/account-setting/types";

	import { dlog, errlog } from "$lib/utils/debug";
	import { doc, updateDoc } from "firebase/firestore";

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let RESPONSE_PROFILE_DATA: REDIS_CACHE_SINGLE_profile_translation
  // FIXME: missing Upload / Remove - Profile Picture Translation
  dlog(RESPONSE_PROFILE_DATA, true)

  let files;
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

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function upload_profile_picture () {
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

  async function remove_picture () {
    if (!profile_picture_exists) return;
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

  // TODO: update username
  // TODO: update wallet address (+connect/disconnect)
    // -> update Firestore: wallet-id + providers
  // TODO: save settings (persist changes made to current instance)
    // -> to localStorage()
    // -> firestore
  // TODO: delete account action

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

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
    class="
      row-space-out
      m-b-24  
    ">
    <div>
      <p
        class="
          s-16
          w-500
        ">
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
    <label
      for="avatar">
      <div
        class="
          btn-hollow
          w-500
          s-14
        "
        on:click={() => remove_picture()}>
        {!profile_picture_exists ? 'Upload' : 'Remove'}
      </div>
    </label>
    {#if !profile_picture_exists}
      <input
        accept="image/png, image/jpeg"
        id="avatar"
        class="custom-file-input"
        name="avatar"
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
    />
  </div>
  <!-- 
  [ℹ] third row
  <-contents->
  [ℹ] cryptocurrency wallet text
  [ℹ] cryptocurrency wallet update
  -->
  <div
    class="
      row-space-out
      m-b-24  
    ">
    <!-- 
    [ℹ] username text
    -->
    <div>
      <p
        class="
          s-16
          w-500
        ">
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
    class="btn-primary-v2">
    {RESPONSE_PROFILE_DATA?.save}
  </button>
  <!-- 
  [ℹ] divider
  -->
  <div 
    id="settings-hr-divider" 
    class="
      m-t-20 
      m-b-20
    "
  />
  <!-- 
  [ℹ] fourth row
  <-contents->
  [ℹ] delete account (action)
  -->
  <div
    class="
      row-space-out
    ">
    <div>
      <p
        class="
          s-16
          w-500
        ">
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
    <button
      class="
        btn-hollow
        w-500
        s-14
      ">
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
    /* white theme/white */
    background: #FFFFFF;
    /* white theme/gray */
    border: 1px solid #CCCCCC;;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 20px 12px;
    width: -webkit-fill-available;
    height: 44px;
    outline: none;
    font-size: 14px;
  } input[type='text']:hover {
    border: 1px solid #8C8C8C;
  } input[type='text']:focus {
    border: 1px solid #4B4B4B;
  } input[type='text'][placeholder] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
</style>