<!--===============
COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import {
		auth,
		db_firestore,
		storage
	} from '$lib/firebase/init';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import {
		deleteObject,
		getDownloadURL,
		ref,
		uploadString
	} from 'firebase/storage';

	import ModalConnectWallet from './Modal-ConnectWallet.svelte';
	import ModalDeleteAccount from './Modal-DeleteAccount.svelte';
	import ModalProfilePictureCrop from './Modal-ProfilePictureCrop.svelte';

	import type { REDIS_CACHE_SINGLE_profile_translation } from '$lib/models/profile/account-setting/types';

	import { goto } from '$app/navigation';
	import { dlog, errlog } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions';
	import { deleteUser } from 'firebase/auth';
	import {
		collection,
		deleteDoc,
		doc,
		getDocs,
		query,
		updateDoc,
		where
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	export let RESPONSE_PROFILE_DATA: REDIS_CACHE_SINGLE_profile_translation;
	// FIXME: missing Upload / Remove - Profile Picture Translation

  // let RESPONSE_PROFILE_DATA: REDIS_CACHE_SINGLE_profile_translation
  $: RESPONSE_PROFILE_DATA = $page.data.RESPONSE_PROFILE_DATA;

	dlog(RESPONSE_PROFILE_DATA, true);

  let no_widget_data: boolean = true;
	let files: HTMLInputElement['files'];
	let fileInputElem: HTMLInputElement;
	let usernameInput: string;
  let usernameErrorExist: boolean;
  let usernameErrorMsg: string;
	let profile_picture_exists: boolean = false;
	let profile_wallet_connected: boolean = false;
	let processing: boolean = false;
	let modal_delete_show: boolean = false;
	let modal_wallet_show: boolean = false;
	let modal_pic_crop_show: boolean = false;
	let profile_crop_widget: ModalProfilePictureCrop;

  $: if (RESPONSE_PROFILE_DATA != undefined) no_widget_data = false;

	$: if (files != undefined) {
		profile_picture_select();
	}

	$: profile_picture_exists =
		$userBetarenaSettings?.user?.scores_user_data
			?.profile_photo == undefined
			? false
			: true;
	$: profile_wallet_connected =
		$userBetarenaSettings?.user?.scores_user_data
			?.web3_wallet_addr == undefined
			? false
			: true;
  usernameInput = $userBetarenaSettings?.user?.scores_user_data?.username;

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	/**
	 * @description kickstarts the picture crop step;
   * @returns {Promise<void>}
	 */
	async function profile_picture_select(): Promise<void> {
		// NOTE: `file` is of type `FileList`, not an Array:
		// DOC: https://developer.mozilla.org/en-US/docs/Web/API/FileList
		for (const file_ of files) {
			dlog(
				`${file_.name}: ${
					file_.size
				} ${typeof file_} type`,
				true
			);
		}
    // [ℹ] validation [1]
    if (files[0].size >= 1000000) {
      alert("🔴 Uploaded picture is too large. Limit is 1MB.");
      files = undefined;
      return;
    }
		profile_crop_widget.load_picture(files[0]);
		modal_pic_crop_show = true;
    files = undefined;
		return;
	}

	/**
	 * @description cropped picture upload;
	 * DOC: https://firebase.google.com/docs/storage/web/upload-files#upload_from_a_string
	 * @param event
   * @returns Promise<void>
	 */
	async function upload_profile_picture(
		event
	): Promise<void> {
		modal_pic_crop_show = false;
		const profile_pic = event?.detail?.img;
		const storageRef = ref(
			storage,
			`Users_data/${$userBetarenaSettings?.user?.firebase_user_data?.uid}/profile-pic.png`
		);
		// [ℹ] 'files' comes from the Blob or File API
		uploadString(
			storageRef,
			profile_pic,
			'data_url'
		).then(async (snapshot) => {
			dlog('🟢 Uploaded file!');
			const url = await snapshot.ref.fullPath;
			dlog(url, true);
			console.log(url);
			getDownloadURL(storageRef).then(
				async (url_) => {
					dlog(url_, true);
					userBetarenaSettings.updateProfilePicture(
						url_
					);
					// [ℹ] (update) from Firebase - Firestore
					const userRef = doc(
						db_firestore,
						'betarena_users',
						$userBetarenaSettings?.user
							?.firebase_user_data?.uid
					);
					await updateDoc(userRef, {
						profile_photo: url_
					});
				}
			);
		});
	}

	/**
	 * @description removes the user's profile picture
	 * from the loaclstorage, firestore, firebase-storage;
   * @returns Promise<void>
	 */
	async function remove_picture(): Promise<void> {
		if (!profile_picture_exists) {
			fileInputElem.click();
			return;
		}
		dlog('🔵 Removing user profile picture...');
		// [ℹ] remove from localStorage()
		userBetarenaSettings.updateProfilePicture(
			undefined
		);
		// [ℹ] remove (update) from Firebase - Firestore
		const userRef = doc(
			db_firestore,
			'betarena_users',
			$userBetarenaSettings?.user
				?.firebase_user_data?.uid
		);
		await updateDoc(userRef, {
			profile_photo: null
		});
		// [ℹ] remove from Firebase - Storage
		const desertRef = ref(
			storage,
			`Users_data/${$userBetarenaSettings?.user?.firebase_user_data?.uid}/profile-pic.png`
		);
		deleteObject(desertRef)
			.then(() => {
				dlog(
					'ℹ️ removed from firebase - storage'
				);
			})
			.catch((error) => {
				errlog(error);
			});
		dlog('🟢 User picture removed', true);
	}

	/**
	 * @description updates user's username on
	 * firebase services; and localStorage
   * @returns {Promise<void>}
	 */
	async function update_username(): Promise<void> {
		dlog('🔵 Updating username...');
    // [ℹ] validation [1]
    const valid = await username_update_validation()
    if (!valid) { 
		  dlog('🔴 Username is invalid...', true);
      return;
    }
    usernameErrorMsg = undefined;
		// [ℹ] (update)from localStorage()
		userBetarenaSettings.updateUsername(
			usernameInput
		);
		// [ℹ] (update)from Firebase - Firestore
		const userRef = doc(
			db_firestore,
			'betarena_users',
			$userBetarenaSettings?.user
				?.firebase_user_data?.uid
		);
		await updateDoc(userRef, {
			username: usernameInput
		});
		dlog('🟢 Username updated', true);
	}

  /**
   * @description a function to validate the user
   * input; returns boolean true/false; assigns
   * appropiate error message;
   * @returns {Promise<boolean>} boolean
   */
  async function username_update_validation(): Promise<boolean> {
		dlog('🔵 Validating username...', true);
    let valid = true;
    // [ℹ] validation [1] - uniqueness
    const usersDb = collection(db_firestore, "betarena_users");
    const queryUsername = query(usersDb, where("username", "==", usernameInput));
    const querySnapshot = await getDocs(queryUsername); // can be access individually;
    // DOC: https://firebase.google.com/docs/firestore/query-data/queries
		dlog(querySnapshot, false);
    if (querySnapshot.docs.length > 0) {
      valid = false
      usernameErrorMsg = 'Username is already in use';
    }
    // [ℹ] validation [2] - length (min)
    if (usernameInput.length < 3) {
      valid = false;
      usernameErrorMsg = 'Username must be greater than 3 characters';
    }
    // [ℹ] validation [3] - length (min)
    if (usernameInput.length > 15) {
      valid = false;
      usernameErrorMsg = 'Username must be less than 15 characters';
    }
    // [ℹ] validation [4] - only-numbers
    if (/^\d+$/.test(usernameInput)) {
      valid = false;
      usernameErrorMsg = 'Username must not contain only numbers';
    };
    // [ℹ] validation [5] - has a space
    if (/\s/g.test(usernameInput)) {
      valid = false;
      usernameErrorMsg = 'Username must not contain spaces'
    }
    // [ℹ] validation [6] - has special char
    let format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(usernameInput)) { 
      valid = false;
      usernameErrorMsg = 'Username cant have spaces or special characters'
    }
    // [ℹ] return;
    return valid;
  }

	/**
	 * @description updates user's wallet-web3 address on
	 * firebase services; and localStorage
   * @returns {Promise<void>}
	 */
  async function update_wallet(
    event
  ): Promise<void> {
		dlog('🔵 Updating wallet Web3...');
    modal_wallet_show = false;
		const wallet = 
      event == null
        ? null
        : event?.detail?.wallet_id;
    // [ℹ] (update)from localStorage()
		userBetarenaSettings.updateWalletAddr(
			wallet
		);
		// [ℹ] (update)from Firebase - Firestore
		const userRef = doc(
			db_firestore,
			'betarena_users',
			$userBetarenaSettings?.user
				?.firebase_user_data?.uid
		);
		await updateDoc(userRef, {
			wallet_id: wallet
		});
		dlog('🟢 Wallet address updated', true);
  }

	// TODO:IMPORTANT update wallet address (+connect/disconnect)
	// -> [🟢] connect to MetaMask and retrieve data
	// -> [🔵] update Firestore: wallet-id + providers for the target user
	// -> [❗️] display on Moralis/Users of request made 
	async function connect_wallet(): Promise<void> {
		// DOC: REF -> [1]
		try {
      // [ℹ] validation [1]
      if (profile_wallet_connected) {
        dlog('Removing user wallet web3 connection...')
        update_wallet(null)
        return
      }
			processing = true;
			modal_wallet_show = true;
		} catch (error) {
			errlog(`connect_wallet() error: ${error}`);
			processing = false;
		}
	}

  // -> updates USERNAME
  // TODO: only save image on CLICK-OF-THIS-BUTTON [?]
	async function save_settings(): Promise<void> {
    update_username()
	}

	/**
	 * @description removes user's data from all sources:
	 * firebase services; and clears up localstorage; redirects
	 * to main page
   * @returns Promise<void>
	 */
	async function delete_user(): Promise<void> {
		dlog('🔵 Deleting user...', true);
		modal_delete_show = false;
		// [ℹ] remove from Firebase - Storage
		const desertRef = ref(
			storage,
			`Users_data/${$userBetarenaSettings?.user?.firebase_user_data?.uid}/profile-pic.png`
		);
		deleteObject(desertRef)
			.then(() => {
				dlog(
					'ℹ️ Success - Profile picture removed'
				);
			})
			.catch((error) => {
				errlog(error);
			});
		// [ℹ] remove from Firebase - Firestore
		// DOC: https://firebase.google.com/docs/firestore/manage-data/delete-data
		await deleteDoc(
			doc(
				db_firestore,
				'betarena_users',
				$userBetarenaSettings?.user
					?.firebase_user_data?.uid
			)
		);
		// [ℹ] remove from Firebase - Auth
		// DOC: https://firebase.google.com/docs/auth/web/manage-users#delete_a_user
		const user = auth.currentUser;
		deleteUser(user)
			.then(() => {
				dlog('ℹ User deleted from Auth');
			})
			.catch((error) => {
				errlog(error);
			});
		// [ℹ] from localStorage()
		userBetarenaSettings.signOutUser();
		dlog('🟢 User deleted', true);
		goto('/', { replaceState: true });
	}

  /**
   * @description closing off picture-crop;
   * and reset files data;
   */
  function close_crop_pic(): void {
    modal_pic_crop_show = false
    fileInputElem.value = ""
  }

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 768;
	const MOBILE_VIEW = 767; // 768 - Tablet (start)
	let mobileExclusive,
		tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});
</script>

<!--===============
COMPONENT HTML 
=================-->

<!-- 
[ℹ] delete action modal confirm
<-conditional-> 
-->
{#if modal_delete_show}
	<ModalDeleteAccount
		on:toggle_delete_modal={() =>
			(modal_delete_show = false)}
		on:delete_account={() => delete_user()}
	/>
{/if}

<!-- 
[ℹ] connect with wallet action modal confirm
<-conditional-> 
-->
{#if modal_wallet_show}
	<ModalConnectWallet
		on:toggle_delete_modal={() =>
			(modal_wallet_show = false)}
		on:connect_wallet_action={(event) =>
			update_wallet(event)}
	/>
{/if}

<!-- 
[ℹ] crop picture modal
<-conditional-> 
-->
<ModalProfilePictureCrop
	bind:this={profile_crop_widget}
	{modal_pic_crop_show}
	on:toggle_delete_modal={() =>
		close_crop_pic()}
	on:upload_selected_img={(event) =>
		upload_profile_picture(event)}
/>

<!--
[ℹ] main (settings) widget component
-->
{#if !no_widget_data}
  <div 
    id="account-settings-widget-box"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >
    <!-- 
    [ℹ] widget title
    -->
    <h2
      class="
        w-500
        s-20
        m-b-24
        color-black-2
      "
      style="margin-top: 0px;"
    >
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
      class={!tabletExclusive
        ? 'row-space-out m-b-24'
        : 'm-b-24'}
    >
      <!-- 
      [ℹ] profile photo section row
      -->
      <div class:m-b-16={mobileExclusive}>
        <p
          class="
            s-16
            w-500
            color-black-2
          "
          class:m-b-6={mobileExclusive}
        >
          {RESPONSE_PROFILE_DATA?.profile_photo}
        </p>
        <span
          class="
            m-t-5
            s-14
            color-grey
          "
        >
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
          color-black-2
        "
        on:click={() => remove_picture()}
      >
        {!profile_picture_exists
          ? 'Upload'
          : 'Remove'}
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
          bind:files
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
      "
    >
      <!-- 
      <-contents->
      [ℹ] username text
      [ℹ] username "required"
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
        [ℹ] name "required" text
        [ℹ] (user) text description
        -->
        <div>
          <!--
          <-contents->
          [ℹ] name "head" text
          [ℹ] name "required" text
          -->
          <div class="row-space-start">
            <!-- 
            [ℹ] name "head" text
            -->
            <p
              class="
              s-16
              w-500
              m-r-6
              color-black-2
            "
            >
              {RESPONSE_PROFILE_DATA?.username}
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
            "
          >
            {RESPONSE_PROFILE_DATA?.name_desc}
          </span>
        </div>
      </div>
      <!-- 
      [ℹ] name input
      -->
      <input
        type="text"
        placeholder={RESPONSE_PROFILE_DATA?.username}
        aria-placeholder="Username input here"
        aria-label="Username input"
        bind:value={usernameInput}
        class:input-error={usernameErrorMsg != undefined}
      />
      <!-- 
      <-conditional->
      [ℹ] error message input
      -->
      {#if usernameErrorMsg}
        <p
          class="
            s-14
            color-error
          ">
          {usernameErrorMsg}
        </p>
      {/if}
    </div>
    <!-- 
    [ℹ] third row
    <-contents->
    [ℹ] cryptocurrency wallet text
    [ℹ] cryptocurrency wallet update
    -->
    <div
      class={!tabletExclusive
        ? 'row-space-out m-b-24'
        : 'm-b-24'}
    >
      <!-- 
      [ℹ] username text (box)
      -->
      <div class:m-b-16={mobileExclusive}>
        <p
          class="
            s-16
            w-500
            color-black-2
          "
          class:m-b-6={mobileExclusive}
        >
          {RESPONSE_PROFILE_DATA?.crypto_title}
        </p>
        <span
          class="
            s-14
            color-grey
          "
        >
          {RESPONSE_PROFILE_DATA?.crypto_desc}
        </span>
      </div>
      <!-- 
      [ℹ] button action
      -->
      <button
        class="
          btn-hollow
          w-500
          s-14
          color-black-2
        "
        on:click={() => connect_wallet()}
      >
        {!profile_wallet_connected
          ? RESPONSE_PROFILE_DATA?.connect_wallet_title
          : RESPONSE_PROFILE_DATA?.disconnect_wallet_title}
      </button>
    </div>
    <!-- 
    [ℹ] save settings (button)
    -->
    <button
      class="btn-primary-v2"
      on:click={() => save_settings()}
    >
      {RESPONSE_PROFILE_DATA?.save}
    </button>
    <!-- 
    [ℹ] divider
    -->
    <div
      id="settings-hr-divider"
      class={!mobileExclusive
        ? 'm-t-20  m-b-20'
        : 'm-t-30 m-b-30'}
    />
    <!-- 
    [ℹ] fourth row
    <-contents->
    [ℹ] delete text / desc
    [ℹ] delete account (action)
    -->
    <div
      class={!tabletExclusive
        ? 'row-space-out m-b-24'
        : ''}
    >
      <!-- 
      [ℹ] delete text / desc
      -->
      <div class:m-b-16={mobileExclusive}>
        <p
          class="
            s-16
            w-500
            color-red-bright
          "
          class:m-b-6={mobileExclusive}
        >
          {RESPONSE_PROFILE_DATA?.delete_account_title}
        </p>
        <span
          class="
            s-14
            color-grey
          "
        >
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
          danger
        "
        on:click={() => (modal_delete_show = true)}
      >
        {RESPONSE_PROFILE_DATA?.delete_account_title}
      </button>
    </div>
  </div>
{/if}

<!--===============
COMPONENT STYLE
=================-->
<style>
	/* profile [settings] widget */
	div#account-settings-widget-box {
		background: #ffffff;
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
	}
	input[type='text']:hover {
		border: 1px solid var(--grey);
	}
	input[type='text']:focus {
		border: 1px solid var(--dark-theme-1);
	}
	input[type='text'][placeholder] {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
  input[type='text'].input-error {
    border: 1px solid var(--red-bright) !important;
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

	/* -----------------
    RESPONSIVNESS
  ----------------- */

	@media only screen and (min-width: 575px) {
		button {
			width: auto;
		}
	}

  /* -----------------
    WIDGET DARK THEME 
  ----------------- */

  div#account-settings-widget-box.dark-background-1 {
		box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
		background-color: var(--dark-theme-1) !important;
	}

  div#account-settings-widget-box.dark-background-1 input[type='text'] {
    background: var(--dark-theme-1);
    border: 1px solid var(--dark-theme-1-2-shade);
    color: var(--white)
  }

  div#account-settings-widget-box.dark-background-1 div#settings-hr-divider {
    background-color: var(--dark-theme-1-2-shade);
  }

  div#account-settings-widget-box.dark-background-1 p.required-pill-tag {
    color: var(--primary-fade)
  }
  
</style>
