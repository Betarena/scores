<script lang="ts">
  import betarenaLogoFull from '$lib/components/_main_/header/assets/betarena-logo-full.svg';
  import betarenaLogoFullContrast from '$lib/components/_main_/header/assets/betarena-logo-full-contrast.svg';

  import sessionStore from '$lib/store/session.js';
	import { page } from '$app/stores';

  export let dark: boolean = false;

  $: title = $sessionStore?.serverLang != 'en'
      ? `${$page.url.origin}/${$sessionStore?.serverLang}`
      : $page.url.origin;

  $: href = $sessionStore?.serverLang != 'en'
      ? `/${$page.params.lang}`
      : `/`;
  
  $: logoFull = dark ? betarenaLogoFull : betarenaLogoFullContrast;
</script>

<a data-sveltekit-reload {href} {title}>
  <img
    loading="lazy"
    src={logoFull}
    alt="betarena_logo"
    height="30px"
  />
</a>
