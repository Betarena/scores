<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { onMount } from "svelte"
	import { page } from '$app/stores'

	import logo from './betarena-logo-x512.png'
	import menu_burger_bar from './menu-burger.svg'

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
	let mobileNavShow: boolean = true
    let mobileNavToggleMenu: boolean = false

    onMount(async() => {
        var wInit = document.documentElement.clientWidth
        if (wInit > 767) {
            mobileNavShow = false
        } else {
            mobileNavShow = true
        }
        window.addEventListener("resize", function() {
            var w = document.documentElement.clientWidth
            if (w > 767) {
                mobileNavShow = false
            } else {
                mobileNavShow = true
            }
        })
    })
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<header class='row-space-start'>
	<!-- ... menu-burger-bar ... [CONDITIONAL] -->
	{#if mobileNavShow}
		<img
			src={menu_burger_bar} 
			alt='betarena-logo'
			width="24px" height="24px"
			class='m-r-24'
		/>
	{/if}
	
	<!-- ... brand-logo-betarena ... -->
	<div id='brand'>
		<a href='https://kit.svelte.dev'>
			<img 
				src={logo} 
				alt='betarena-logo'
			/>
		</a>
	</div>
	<!-- <nav>
		<ul>
			<li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.path === '/about'}><a sveltekit:prefetch href="/about">About</a></li>
			<li class:active={$page.path === '/todos'}><a sveltekit:prefetch href="/todos">Todos</a></li>
		</ul>
	</nav> -->
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

	#brand {

	} #brand img {
		height: 30px;
	}

	/* nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	} */
</style>
