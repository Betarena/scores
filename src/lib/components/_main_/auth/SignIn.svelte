<script lang="ts">
  import { page } from "$app/stores";
  import { translationObject } from "$lib/utils/translation.js";
  import ButtonHollow from "$lib/components/shared/buttons/ButtonHollow.svelte";
  import AuthWidget from "$lib/components/_main_/auth/Auth_Widget.svelte";
	import sessionStore from '$lib/store/session.js';

  $: signInButtonLabel = $page.data.B_NAV_T?.scores_header_translations?.sign_in || translationObject?.sign_in;

  const handleButtonClick = sessionStore.toggleAuthShow;
</script>

<ButtonHollow label={signInButtonLabel} on:click={handleButtonClick} dark/>
<AuthWidget />