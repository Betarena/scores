<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { dev } from '$app/env'
	// ... typescript-types;
	import type { Footer_Data } from '$lib/model/footer'
	// ... image-assets;
	import logo_full from './assets/betarena-logo-full.svg'
	import linkedin from './assets/icon/linkedin.svg'
	import discord from './assets/icon/discord.svg'
	import facebook from './assets/icon/facebook.svg'
	import instagram from './assets/icon/instagram.svg'
	import medium from './assets/icon/medium.svg'
	import telegram from './assets/icon/telegram.svg'
	import twitter from './assets/icon/twitter.svg'
	import begambleawareorg from './assets/begambleawareorg_black.svg'
	import legal18icon from './assets/legal-18-action-bet.svg'
 
	// ... END OF required IMPORTS;

	export let FOOTER_TRANSLATION_DATA: Footer_Data

	// ... immediately update the data with the lang;
	let server_side_language: string = 'en';
	$: if ($page.params.lang === undefined) {
		server_side_language = 'en';
	} else {
		server_side_language = $page.params.lang;
	}

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~
	 * ... this function loads when all of the
	 * ... rest of the components have loaded
	 * ... and rendered, checking via JS the viewport
	 * ... of the client device and changing between
	 * ... appropiate components to display the correct
	 * ... component, tailored to a specifc device.
	*/
	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// ... debugging;
		// if (dev) console.debug('resizing', wInit)
		// TABLET - VIEW
		if (wInit >= 1440) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// ... debugging;
			// if (dev) console.debug('resizing', w)
			// TABLET - VIEW
			if (w >= 1440) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// MOBILE - VIEW
			if (w < 475) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
	});

	/**
	 * Description: 
	 * ~~~~~~~~~~~~~~~~~
	 * ... form SUBMIT method to 
	 * ... register user on the BETARENA EMAIL LIST
	*/
	async function submitEmail() {
		if (dev) console.debug('subscribing to email newsletter!')
	}
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<footer>
	<!-- ... wait until THIS component recives the required DATA ... -->
	{#if FOOTER_TRANSLATION_DATA != undefined}
		<!-- ... identify the correct translation via IF validation -->
		{#each FOOTER_TRANSLATION_DATA.scores_footer_translations_dev as footer_traslation_obj}
			{#if footer_traslation_obj.lang == server_side_language}
				<!-- ... populate data accordingly ... -->

				<!-- ... mobile - version only ... -->
				{#if mobileExclusive && tabletExclusive}
					<div
						id="inner-footer">
						
						<!-- ... brand-logo-betarena ... -->
						<div 
							id='brand'
							class='m-b-16'>
							<a sveltekit:prefetch href="/">
								<img src={logo_full} alt="betarena-logo" />
							</a>
						</div>

						<!-- ... follow-us-and-social-media ... -->
						<div 
							class='m-b-40'>
							<p class='color-white s-14 w-normal m-b-20'>
								{footer_traslation_obj.follow}
							</p>
							<!-- ... social media follows ... -->
							<div 
								id='social-media-box'
								class='column-start-grid'>
								<!-- ... identify the list of social media icons ... -->
								{#each FOOTER_TRANSLATION_DATA.scores_footer_links_dev as social_network_obj}
									{#if social_network_obj.lang == server_side_language}
										<!-- ... render the correct items ... -->
										{#each social_network_obj.social_networks as social_network}
											<!-- ... social-network-component ... -->
											<a 
												rel='external'
												href={social_network[1].toString().toLocaleLowerCase()}>
												<img 
													src='./assets/svg/footer/icon/{social_network[0].toString().toLocaleLowerCase()}.svg'
													alt='{social_network[0].toString().toLocaleLowerCase()}-icon'
													title='{social_network[0].toString().toLocaleLowerCase()}-icon'
													width="32px" height="32px" />
											</a>
										{/each}
									{/if}
								{/each}
							</div>
						</div>

						<!-- ... subscribe-to-newletter ... -->
						<div 
							id='newsletter-container' 
							class='m-b-30'>
							<!-- ... title-section ... -->
							<p 
								class='color-white s-14 w-normal m-b-8 text-left'>
								{footer_traslation_obj.subscribe_newsletter}
							</p>
							<!-- ... form-start ... -->
							<form on:submit|preventDefault={() => submitEmail()}>
								<!-- ... input-email-field ... -->
								<input 
									type='email' 
									name='type_email' 
									id=''
									placeholder={footer_traslation_obj.type_email}
									class='m-b-12 s-14 w-400 color-grey'>
								<!-- ... button-subscribe-action ... -->
								<button 
									type='submit'
									id='newsletter-subscribe-btn'
									class='btn-primary'>
									<p class='color-white s-14 w-500'>
										{footer_traslation_obj.subscribe_cta}
									</p>
								</button>
							</form>
						</div>

						<!-- ... menu-list num.1 ... -->
						<!-- ... generate-translations-for-footer ... -->
						{#each FOOTER_TRANSLATION_DATA.scores_footer_links_dev as footer_nav_links_translations}
							{#if footer_nav_links_translations.lang == server_side_language}
								<div 
									id='menu-list'
									class='m-b-40'>
									<ul>
										<!-- ... latest-news ... -->
										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.latest_news}
												class='m-b-16'>
												<p class='color-white s-14 w-normal'>
													{footer_traslation_obj.latest_news}
												</p>
											</a>
										</li>
										<!-- ... sep .. -->
										<li class='place-center m-r-10 m-b-16'>
											<div class='menu-separator' />
										</li>
										<!-- ... betting-tips ... -->
										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.betting_tips}
												class='m-b-16'>
												<p class='color-white s-14 w-normal'>
													{footer_traslation_obj.betting_tips}
												</p>
											</a>
										</li>
										<!-- ... sep .. -->
										<li class='place-center m-r-10 m-b-16'>
											<div class='menu-separator' />
										</li>
										<!-- ... about us link ... -->
										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.about_us}
												class='m-b-16'>
												<!-- ... about us ... -->
												<p class='color-white s-14 w-normal'>
													{footer_traslation_obj.about_us}
												</p>
											</a>
										</li>
									</ul>
									<ul>
										<!-- ... terms and conditions ... -->
										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.terms}>
												<p class='color-white s-14 w-normal'>
													{footer_traslation_obj.terms}
												</p>
											</a>
										</li>
										<!-- ... sep .. -->
										<li class='place-center m-r-10'>
											<div class='menu-separator' />
										</li>
										<!-- ... privacy and conditions ... -->
										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.privacy}>
													<p class='color-white s-14 w-normal'>
														{footer_traslation_obj.privacy}
													</p>
											</a>
										</li>
									</ul>
								</div>
							{/if}
						{/each}

						<!-- ... legal-begambleawareorg ... -->
						<div 
							class='row-space-start m-b-30 place-center'
							style='width: auto;'>
							<img src={legal18icon} 
								alt='legal18icon' 
								title='legal18icon'
								width="48px" height="24px"
								class='m-r-24'
								/>
							<img src={begambleawareorg} 
								alt='begambleawareorg' 
								title='begambleawareorg'
								width="130px" height="16px"
								/>
						</div>

						<!-- ... company-details ... -->
						<div 
							class='m-b-16'>
							<p class='s-14 w-500 color-grey'>
								Second Act
							</p>
							<p class='s-14 w-400 color-grey'>
								18 Boulevard Montmartre Paris 75009
							</p>
						</div>

						<p 
							class='s-14 w-400 color-grey'>
							© 2021 Betarena All rights reserved 
						</p>
					</div>
				{/if}

				<!-- ... tablet version only ... -->
				{#if !mobileExclusive && tabletExclusive}
					<div
						id="inner-footer"
						class='column-start-grid'>

						<!-- ... top-row-footer-data ... -->
						<div
							class='row-space-out m-b-50'>

							<!-- ... brand-logo-betarena ... -->
							<div
								class='column-space-start'
								style='width: auto;'>
								<div 
									id='brand'
									class='m-b-25'>
									<a sveltekit:prefetch href="/">
										<img src={logo_full} alt="betarena-logo" />
									</a>
								</div>

								<!-- ... follow-us-and-social-media ... -->
								<div>
									<p class='color-white s-14 w-normal m-b-12'>
										{footer_traslation_obj.follow}
									</p>
									<!-- ... social media follows ... -->
									<div id='social-media-box'
										class='column-start-grid'>
										<!-- ... identify the list of social media icons ... -->
										{#each FOOTER_TRANSLATION_DATA.scores_footer_links_dev as social_network_obj}
											{#if social_network_obj.lang == server_side_language}
												<!-- ... render the correct items ... -->
												{#each social_network_obj.social_networks as social_network}
													<!-- ... social-network-component ... -->
													<a 
														rel='external'
														href={social_network[1].toString().toLocaleLowerCase()}>
														<img 
															src='./assets/svg/footer/icon/{social_network[0].toString().toLocaleLowerCase()}.svg'
															alt='{social_network[0].toString().toLocaleLowerCase()}-icon'
															title='{social_network[0].toString().toLocaleLowerCase()}-icon'
															width="32px" height="32px" />
													</a>
												{/each}
											{/if}
										{/each}
									</div>
								</div>
							</div>

							<!-- ... subscribe-to-newletter ... -->
							<div 
								id='newsletter-container'>
								<!-- ... title-section ... -->
								<p class='color-white s-14 w-normal m-b-8 text-left'>
									{footer_traslation_obj.subscribe_newsletter}
								</p>
								<!-- ... form-start ... -->
								<form on:submit|preventDefault={() => submitEmail()}>
									<!-- ... input-email-field ... -->
									<input 
										type='email' 
										name='type_email' 
										id=''
										placeholder={footer_traslation_obj.type_email}
										class='m-b-12 s-14 w-400 color-grey'>
									<!-- ... button-subscribe-action ... -->
									<button 
										type='submit'
										id='newsletter-subscribe-btn'
										class='btn-primary'>
										<p class='color-white s-14 w-500'>
											{footer_traslation_obj.subscribe_cta}
										</p>
									</button>
								</form>
							</div>
						</div>

						<!-- ... menu-list num.1 ... -->
						<!-- ... generate-translations-for-footer ... -->
						{#each FOOTER_TRANSLATION_DATA.scores_footer_links_dev as footer_nav_links_translations}
							{#if footer_nav_links_translations.lang == server_side_language}
								<div 
									id='menu-list'
									class='m-b-40'>
									<ul class='m-b-16'>
										<!-- ... latest-news ... -->
										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.latest_news}>
												<p class='color-white s-14 w-normal'>
													{footer_traslation_obj.latest_news}
												</p>
											</a>
										</li>
										<!-- ... sep .. -->
										<li class='place-center m-r-10'>
											<div class='menu-separator' />
										</li>
										<!-- ... betting-tips ... -->
										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.betting_tips}>
												<p class='color-white s-14 w-normal'>
													{footer_traslation_obj.betting_tips}
												</p>
											</a>
										</li>
										<!-- ... sep .. -->
										<li class='place-center m-r-10'>
											<div class='menu-separator' />
										</li>

										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.about_us}>
												<!-- ... about us ... -->
												<p class='color-white s-14 w-normal'>
													{footer_traslation_obj.about_us}
												</p>
											</a>
										</li>
										<!-- ... sep .. -->
										<li class='place-center m-r-10'>
											<div class='menu-separator' />
										</li>
										<!-- ... terms and conditions ... -->
										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.terms}>
												<p class='color-white s-14 w-normal'>
													{footer_traslation_obj.terms}
												</p>
											</a>
										</li>
										<!-- ... sep .. -->
										<li class='place-center m-r-10'>
											<div class='menu-separator' />
										</li>
										<!-- ... privacy and conditions ... -->
										<li class='m-r-10'>
											<a 
												rel='external'
												href={footer_nav_links_translations.privacy}>
												<p class='color-white s-14 w-normal'>
													{footer_traslation_obj.privacy}
												</p>
											</a>
										</li>
									</ul>
								</div>
							{/if}
						{/each}

						<div
							class='row-space-out'>

							<!-- ... company-details ... -->
							<div 
								class='m-b-8'>
								<!-- ... company name and details ... -->
								<p 
									class='s-14 w-500 color-grey m-b-8'>
									Second Act
									<span class='w-400'>
										18 Boulevard Montmartre Paris 75009
									</span>
								</p>
								<!-- ... copytright data ... -->
								<p 
									class='s-14 w-400 color-grey'>
									© 2021 Betarena All rights reserved 
								</p>
							</div>

							<!-- ... legal-begambleawareorg ... -->
							<div 
								class='row-space-start m-b-30 place-center'
								style='width: auto;'>
								<img src={legal18icon} 
									alt='legal18icon' 
									title='legal18icon'
									width="48px" height="24px"
									class='m-r-24'
									/>
								<img src={begambleawareorg} 
									alt='begambleawareorg' 
									title='begambleawareorg'
									width="130px" height="16px"
									/>
							</div>
						</div>
					</div>
				{/if}

				<!-- ... desktop version only ... -->
				{#if !mobileExclusive && !tabletExclusive}
					<div
						id="inner-footer">

						<!-- ... 1st-column-footer-data ... -->
						<div
							class='column-start-grid'>

							<!-- ... brand-logo-betarena ... -->
							<div 
								id='brand'
								class='m-b-12'>
								<a sveltekit:prefetch href="/">
									<img src={logo_full} alt="betarena-logo" />
								</a>
							</div>

							<!-- ... copytright data ... -->
							<p 
								class='s-14 m-b-16 w-400 color-grey'>
								© 2021 Betarena All rights reserved 
							</p>

							<!-- ... company-details ... -->
							<p 
								class='s-14 w-500 color-grey'>
								Second Act
								<br>
								<span class='w-400'>
									18 Boulevard Montmartre Paris 75009
								</span>
							</p>
						</div>

						<!-- ... 2nd-column-footer-data ... -->
						<div
							class='column-start-grid'>

							<!-- ... subscribe-to-newletter ... -->
							<div 
								id='newsletter-container'
								class='m-b-40'>
								<!-- ... title-section ... -->
								<p class='color-white s-14 w-normal m-b-8 text-left'>
									{footer_traslation_obj.subscribe_newsletter}
								</p>
								<!-- ... form-start ... -->
								<form 
									on:submit|preventDefault={() => submitEmail()} 
									class='row-space-out'>
									<!-- ... input-email-field ... -->
									<input 
										type='email' 
										name='type_email' 
										id=''
										placeholder={footer_traslation_obj.type_email}
										class='m-r-20 s-14 w-400 color-grey'>
									<!-- ... button-subscribe-action ... -->
									<button 
										type='submit'
										id='newsletter-subscribe-btn'
										class='btn-primary'>
										<p class='color-white s-14 w-500'>
											{footer_traslation_obj.subscribe_cta}
										</p>
									</button>
								</form>
							</div>

							<!-- ... menu-list num.1 ... -->
							<!-- ... generate-translations-for-footer ... -->
							{#each FOOTER_TRANSLATION_DATA.scores_footer_links_dev as footer_nav_links_translations}
								{#if footer_nav_links_translations.lang == server_side_language}
									<div 
										id='menu-list'>
										<ul>
											<!-- ... latest-news ... -->
											<li class='m-r-10'>
												<a 
													rel='external'
													href={footer_nav_links_translations.latest_news}>
													<p class='color-white s-14 w-normal'>
														{footer_traslation_obj.latest_news}
													</p>
												</a>
											</li>
											<!-- ... sep .. -->
											<li class='place-center m-r-10'>
												<div class='menu-separator' />
											</li>
											<!-- ... betting-tips ... -->
											<li class='m-r-10'>
												<a 
													rel='external'
													href={footer_nav_links_translations.betting_tips}>
													<p class='color-white s-14 w-normal'>
														{footer_traslation_obj.betting_tips}
													</p>
												</a>
											</li>
											<!-- ... sep .. -->
											<li class='place-center m-r-10'>
												<div class='menu-separator' />
											</li>
											<!-- ... about_us ... -->
											<li class='m-r-10'>
												<a 
													rel='external'
													href={footer_nav_links_translations.about_us}>
													<!-- ... about us ... -->
													<p class='color-white s-14 w-normal'>
														{footer_traslation_obj.about_us}
													</p>
												</a>
											</li>
											<!-- ... sep .. -->
											<li class='place-center m-r-10'>
												<div class='menu-separator' />
											</li>
											<!-- ... terms and conditions ... -->
											<li class='m-r-10'>
												<a 
													rel='external'
													href={footer_nav_links_translations.terms}>
													<p class='color-white s-14 w-normal'>
														{footer_traslation_obj.terms}
													</p>
												</a>
											</li>
											<!-- ... sep .. -->
											<li class='place-center m-r-10'>
												<div class='menu-separator' />
											</li>
											<!-- ... privacy and conditions ... -->
											<li class='m-r-10'>
												<a 
													rel='external'
													href={footer_nav_links_translations.privacy}>
													<p class='color-white s-14 w-normal'>
														{footer_traslation_obj.privacy}
													</p>
												</a>
											</li>
										</ul>
									</div>
								{/if}
							{/each}
							
						</div>

						<!-- ... 3rd-column-footer-data ... -->
						<div
							class='column-start-grid'>

							<!-- ... follow-us-and-social-media ... -->
							<div 
								class='m-b-40'>
								<p 
									class='color-white s-14 w-normal m-b-20'>
									{footer_traslation_obj.follow}
								</p>
								<!-- ... social media follows ... -->
								<div 
									id='social-media-box'
									class='column-start-grid'>
									<!-- ... identify the list of social media icons ... -->
									{#each FOOTER_TRANSLATION_DATA.scores_footer_links_dev as social_network_obj}
										{#if social_network_obj.lang == server_side_language}
											<!-- ... render the correct items ... -->
											{#each social_network_obj.social_networks as social_network}
												<!-- ... social-network-component ... -->
												<a 
													rel='external'
													href={social_network[1].toString().toLocaleLowerCase()}>
													<img 
														src='./assets/svg/footer/icon/{social_network[0].toString().toLocaleLowerCase()}.svg'
														alt='{social_network[0].toString().toLocaleLowerCase()}-icon'
														title='{social_network[0].toString().toLocaleLowerCase()}-icon'
														width="32px" height="32px" />
												</a>
											{/each}
										{/if}
									{/each}
								</div>
							</div>

							<!-- ... legal-begambleawareorg ... -->
							<div 
								class='row-space-start'
								style='width: auto;'>
								<img src={legal18icon} 
									alt='legal18icon' 
									title='legal18icon'
									width="48px" height="24px"
									class='m-r-24'
									/>
								<img src={begambleawareorg} 
									alt='begambleawareorg' 
									title='begambleawareorg'
									width="130px" height="16px"
									/>
							</div>
						</div>
						
					</div>
				{/if}

			{/if}
		{/each}
	{/if}
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
	}
	footer #inner-footer {
		max-width: 1378px;
		/* ... */
		display: grid;
		justify-items: stretch;
		align-items: center;
		text-align: center;
	}
	#brand {
		place-self: center;
	}
	#brand img {
		height: 32px;
		width: 151px;
	}
	footer #social-media-box {
		gap: 16px;
		grid-auto-flow: column;
		/* max-width: 322px; */
		width: 100%;
	}

	footer div#menu-list ul {
		list-style-type: none;
		display: flex;
		flex-wrap: wrap;
		padding: 0;
		margin: 0;
		place-content: center;
	} footer div#menu-list div.menu-separator {
		width: 1px;
		background-color: #4B4B4B;
	}

	div#newsletter-container input {
		background: #4B4B4B;
		border-radius: 8px;
		padding: 12px 20px;
		width: 100%;
	}
	div#newsletter-container button#newsletter-subscribe-btn {
		height: 44px;
		width: 100%;
		background: #F5620F;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
	}

	/* 
    RESPONSIVE FOR TABLET (&+) [768px] */
	@media screen and (min-width: 768px) {
		footer {
			height: 416px;
			padding: 68px 34px;
		}

		#brand {
			place-self: normal;
		}

		div#newsletter-container {
			width: 340px;
		}

		footer div#menu-list ul {
			place-content: unset;
		}

		footer #inner-footer {
			justify-items: initial;
			align-items: initial;
			text-align: initial;
			justify-content: initial;
		}
	}

	/* 
    RESPONSIVE FOR TABLET (&+) [1440px] */
	@media screen and (min-width: 1440px) {
		footer {
			height: 246px;
			padding: 56px 34px;
			text-align: center;
			text-align: -webkit-center;
		}

		footer #inner-footer {
			display: flex;
			justify-content: space-between;
			justify-items: stretch;
			align-items: center;
		}

		div#newsletter-container {
			width: 100%;
		}
		div#newsletter-container input {
			width: 100%;
			min-width: 430px;
		}

		div#newsletter-container button#newsletter-subscribe-btn {
			padding: 11.5px 23.5px;
			width: fit-content;
		}

		footer #social-media-box {
			justify-content: left;
		}
	}
</style>