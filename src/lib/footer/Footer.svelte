<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	import { page } from '$app/stores';
	import logo from './betarena-logo-x512.png';
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<footer>
    <!-- ... brand-logo-betarena ... -->
    <div id='brand'>
        <a href='https://kit.svelte.dev'>
            <img 
                src={logo} 
                alt='betarena-logo'
            />
        </a>
    </div>
</footer>

<!-- ===================
	COMPONENT HTML
=================== -->

<style>
    footer {
        background: #292929;
        height: 246px;
        width: -webkit-fill-available;
        padding: 56px 34px;
    }

    #brand {
        padding-top: 8px;
    } #brand img {
        height: 32px;
        width: 151px;
    }
</style>