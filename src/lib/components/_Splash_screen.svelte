<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->
<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * Description:
	 * ~~~~~~~~~~~~
	 * Set a Timer To Show/Hide the
	 * Elements of the HTML Page
	 */
	let show: boolean = true;
	onMount(async () => {
		// ... itialiazing timer,
		// ... reset all of the values to its initial state;
		setTimeout(async () => {
			show = false;
			document.documentElement.classList.remove(
				'no-scrollbar'
			);
			document.body.classList.remove(
				'no-scrollbar'
			);
		}, 500);
	});
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

{#if show}
	<div>
    <!-- FIXME: need width & height -->
		<img
			id="brand-svg"
			src="/assets/svg/logo-main.svg"
			alt="betarena-logo"
			style="zoom: 0.5;"
		/>
	</div>
{/if}

<!-- ===================
	COMPONENT STYLE
=================== -->
<style>
	/* 
    Hide scrollbar for Chrome, Safari and Opera */
	:global(body.no-scrollbar::-webkit-scrollbar) {
		display: none !important;
	}
	/* 
    Hide scrollbar for IE, Edge and Firefox */
	:global(body.no-scrollbar) {
		-ms-overflow-style: none !important; /* IE and Edge */
		scrollbar-width: none !important; /* Firefox */
	}
	/* 
    Container for the Displaying of the Splash-Screen */
	div {
		position: fixed;
		background-color: #292929;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 50000;
		display: grid;
		align-content: center;
		align-items: center;
		justify-items: center;
		grid-gap: 30px;
	}
	/* 
    ===================
    RESPONSIVNESS - DESKTOP COMPATABILITY
    ===================
    */
	@media only screen and (min-width: 1024px) {
		/* empty */
	}
</style>
