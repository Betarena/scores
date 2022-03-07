<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { getStores, navigating, page, session, updated } from '$app/stores';
  import { fade } from 'svelte/transition';

  const { session } = getStores();

  // ... immediately update the data with the lang;
	let server_side_language: string = 'en';
	$: if ($page.params.lang === undefined) {
		server_side_language = 'en';
	} else {
		server_side_language = $page.params.lang;
	}

  // ...
  function toggleNewsletterPopUp() {
    // ...  
    // setTimeout(async () => {
    //   // ... IFRAME CSS STYLING;
    //   let iFrameEmailFormElement = document.getElementById('iframe-email-form');
    //   // let doc = iFrameEmailFormElement.ownerDocument;
    //   let doc = (iFrameEmailFormElement.contentWindow || iFrameEmailFormElement.contentDocument);
    //   // if (doc.document)doc = doc.document
    //   // ... DEBUGGING;
    //   if (dev) console.debug('iFrameEmailFormElement', iFrameEmailFormElement);
    //   if (dev) console.debug('doc', doc.document);
    //   // ...
    //   // doc.body.style.backgroundColor = "red";
    //   // ... 
    // }, 5000)
  }
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<!-- ... email-submission-send-grid-form ... -->
{#if $session.newsletterPopUpShow}
  <div 
    id='background-modal-blur'
    on:click={() => $session.newsletterPopUpShow = false}
    in:fade />

  <!-- ... IFRAME LANGUAGE CONDITION ... -->
  {#if server_side_language == 'en'}
    <!-- ... EN ... -->
    <iframe
      id='iframe-email-form'
      title='email-betarena-form'
      src="https://cdn.forms-content.sg-form.com/959f35f0-8a5e-11ec-ae12-6ab0b90e93b0" />
  {:else if server_side_language == 'es'}
    <!-- ... ES ... -->
    <iframe 
      title='email-betarena-form'
      src="https://cdn.forms-content.sg-form.com/e2e80a33-947e-11ec-9a6f-bab7bbd1e44a" />
  {:else if server_side_language == 'it'}
    <!-- ... IT ... -->
    <iframe 
      title='email-betarena-form'
      src="https://cdn.forms-content.sg-form.com/f6daf19c-947f-11ec-9a6f-bab7bbd1e44a" />
  {:else if server_side_language == 'br'}
    <!-- ... BR ... -->
    <iframe 
      title='email-betarena-form'
      src="https://cdn.forms-content.sg-form.com/6a180301-9480-11ec-9a6f-bab7bbd1e44a" />
  {:else if server_side_language == 'pt'}
    <!-- ... PT ... -->
    <iframe 
      title='email-betarena-form'
      src="https://cdn.forms-content.sg-form.com/ae8bbec3-9480-11ec-9a6f-bab7bbd1e44a" />
  {/if}

{/if}


<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
  
  div#background-modal-blur {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 400000000;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  /* import-form */
  iframe {
    position: fixed;
    right: 0;
    left: 0;
    margin: auto;
    top: 0;
    bottom: 0;
    z-index: 400000001;
    /*  */
    width: 469px;
    height: 597px;
    border: none;
  }
  /* iframe body {
    margin: 0 !important;
  }
  iframe form {
    width: auto !important;
    margin: 0 !important;
  } */

</style>