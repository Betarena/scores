<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { amp, browser, dev, mode, prerendering } from '$app/env';

	import { onMount } from "svelte"
	import { page } from '$app/stores'

	import logo_full from './assets/betarena-logo-full.svg'
	import logo_mini from './assets/betarena-logo-mobile.svg'

	import menu_burger_bar from './assets/menu-burger.svg'

    /**
     * Description:
     * ~~~~~~~~~~~~~~~~~
     * This function loads when all of the
     * rest of the components have loaded
     * and rendered, checking via JS the viewport
     * of the client device and changing between
     * appropiate components to display the correct
     * component, tailored to a specifc device.
    */
	let mobileExclusive: boolean = true
	let tabletExclusive: boolean = true
    let mobileNavToggleMenu: boolean = false

    onMount(async() => {
        var wInit = document.documentElement.clientWidth
		// TABLET - VIEW
        if (wInit > 768) {
            tabletExclusive = false
        } else {
            tabletExclusive = true
        }
		// MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true
		} else {
			mobileExclusive = false
		}
        window.addEventListener("resize", function() {
            var w = document.documentElement.clientWidth
			// TABLET - VIEW
            if (w > 768) {
                tabletExclusive = false
            } else {
                tabletExclusive = true
            }
			// MOBILE - VIEW
			if (w < 475) {
				mobileExclusive = true
			} else {
				mobileExclusive = false
			}
        })
    })
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<header class='column-space-center'>
	<!-- ... menu-burger-bar ... [CONDITIONAL] -->
	<div id='header-inner'
		class='row-space-start'>
		{#if tabletExclusive}
			<img
				id='burger-menu'
				src={menu_burger_bar} 
				alt='betarena-logo'
				width="24px" height="24px"
			/>
		{/if}
		
		{#if mobileExclusive}
			<!-- ... brand-logo-betarena-for-mobile-ONLY ... -->
			<div id='brand'>
				<a sveltekit:prefetch href='/'>
					<img 
						src={logo_mini} 
						alt='betarena-logo'
						width="103px" height="30px"
					/>
				</a>
			</div>
		{:else}
			<!-- ... brand-logo-betarena-for-desktop-ONLY ... -->
			<div id='brand'>
				<a sveltekit:prefetch href='/'>
					<img 
						src={logo_full} 
						alt='betarena-logo'
					/>
				</a>
			</div>
		{/if}
	</div>
</header>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>
	header {
        background-color: #292929;
		height: 72px;
		padding: 21px 34px;
	} 
	
	/* ... critical + essential */
	header #header-inner {
		max-width: 1378px;
	}

	#burger-menu {
		margin-right: 16.15px;
	}

	#brand img {
		height: 30px;
		width: 142px;	
	}

	/* 
    RESPONSIVE FOR TABLET (&+) [768px] */
    @media screen and (min-width: 768px) {
        #burger-menu {
			margin-right: 24px;
		}
    }
</style>