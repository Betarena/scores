<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { onMount } from "svelte"
	import { page } from '$app/stores';
    
	import logo_full from './assets/betarena-logo-full.svg';

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

    onMount(async() => {
        var wInit = document.documentElement.clientWidth
		// MOBILE - VIEW
		if (wInit < 768) {
			mobileExclusive = true
		} else {
			mobileExclusive = false
		}
        window.addEventListener("resize", function() {
            var w = document.documentElement.clientWidth
			// MOBILE - VIEW
			if (w < 768) {
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

<footer class:column-space-center={mobileExclusive == false}>
    <div id='inner-footer' 
        class:column-start-grid={mobileExclusive == true}
        class:row-space-start={mobileExclusive == false}
        >
        <!-- ... brand-logo-betarena ... -->
        <div id='brand'>
            <a sveltekit:prefetch href='/'>
                <img 
                    src={logo_full} 
                    alt='betarena-logo'
                />
            </a>
        </div>
    </div>
</footer>

<!-- ===================
	COMPONENT HTML
=================== -->

<style>
    /* 
    RESPONSIVE FOR MOBILE-FIRST (&+) [375px] */
    footer {
        background: #292929;
        height: 645px;
        width: -webkit-fill-available;
        padding: 48px 18px;
    } footer #inner-footer {
        max-width: 1378px;
    }
    #brand img {
        height: 32px;
        width: 151px;
    }

    /* 
    RESPONSIVE FOR TABLET (&+) [768px] */
    @media screen and (min-width: 768px) {
        footer {
            height: 416px;
        }
    }

    /* 
    RESPONSIVE FOR TABLET (&+) [1440px] */
    @media screen and (min-width: 1440px) {
        footer {
            height: 246px;
            padding: 56px 34px;
        }
    }
</style>