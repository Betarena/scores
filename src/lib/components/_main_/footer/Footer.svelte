<!-- ===================
	COMPONENT JS - BASIC
    [TypeScript Written]
=================== -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import SeoBox from '$lib/components/SEO-Box.svelte';
	import type { Cache_Single_Lang_Footer_Translation_Response } from '$lib/models/_main_/footer/types';
	import sessionStore from '$lib/store/session.js';
	import { dlog, FT_W_STY, FT_W_TAG, FT_W_TOG } from '$lib/utils/debug';
	import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
	import { onMount } from 'svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~
	export let FOOTER_TRANSLATION_DATA: Cache_Single_Lang_Footer_Translation_Response;

	let hideSEO: boolean = false;
	let showEmailForm: boolean = false;

	let server_side_language: string = 'en';
	let homepageURL: string;
	let logoLink: string;

  let
    begambleawareorg: string,
    logo_full: string,
    legal18icon: string
  ;

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 560;
	let mobileExclusive, tabletExclusive: boolean = false;

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

  // ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr(
    $page.route.id,
    $page.error,
    $page.params.lang
  )
  $: homepageURL =
    server_side_language != 'en'
      ? `/${$page.params.lang}`
      : `/`
  ;
  $: logoLink =
    server_side_language != 'en'
      ? `${$page.url.origin}/${server_side_language}`
      : $page.url.origin
  ;
  $: dlog(`${FT_W_TAG} server_side_language: ${server_side_language}`, FT_W_TOG, FT_W_STY);
  $: dlog(`${FT_W_TAG} homepageURL: ${homepageURL}`, FT_W_TOG, FT_W_STY);
  $: dlog(`${FT_W_TAG} logoLink: ${logoLink}`, FT_W_TOG, FT_W_STY);

	$: if (browser) {
		hideSEO = true;
	}

  /**
   * @description form SUBMIT method to
   * register user on the BETARENA EMAIL LIST
  */
	async function submitEmail() {
    dlog(`${FT_W_TAG} subscribing to email newsletter!`, FT_W_TOG, FT_W_STY);
		// [ℹ] showEmailForm = true; // FIXME: ?
		$sessionStore.newsletterPopUpShow = true;
	}

	/**
	 * @description reload current page;
	 */
	function reloadPage() {
		if ($page.url.pathname.split('/').length - 1 ==	1) {
			window.location.reload();
		}
	}

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  onMount
  (
    async () =>
    {
      begambleawareorg = (await import('./assets/begambleawareorg_black.png')).default;
      logo_full = (await import('./assets/betarena-logo-full.svg')).default;
      legal18icon = (await import('./assets/legal-18-action-bet.png')).default;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<!--
[ℹ] FOOTER SEO
-->
{#if FOOTER_TRANSLATION_DATA != undefined && !hideSEO}
  <SeoBox>
    <!-- [ℹ] betarena-logo-homepage-correct-url
    -->
    <p>{logoLink}</p>
    <!-- [ℹ] nav-links-SEO
    -->
    <p>
      {FOOTER_TRANSLATION_DATA.scores_footer_links
        .latest_news}
    </p>
    <p>
      {FOOTER_TRANSLATION_DATA.scores_footer_links
        .about_us}
    </p>
    <p>
      {FOOTER_TRANSLATION_DATA.scores_footer_links
        .betting_tips}
    </p>
    <p>
      {FOOTER_TRANSLATION_DATA.scores_footer_links
        .privacy}
    </p>
    <p>
      {FOOTER_TRANSLATION_DATA.scores_footer_links
        .social_networks}
    </p>
    <p>
      {FOOTER_TRANSLATION_DATA.scores_footer_links
        .terms}
    </p>
    <!-- [ℹ] nav-links-social-links
    -->
    {#each FOOTER_TRANSLATION_DATA.scores_footer_links.social_networks as social_network}
      <p>
        {social_network[1]}
      </p>
    {/each}
  </SeoBox>
{/if}

<!--
[ℹ] FOOTER CLIENT COMPONENT
-->
<footer>
	{#if FOOTER_TRANSLATION_DATA != undefined}
		<!--
    [ℹ] mobile - version only
    -->
		{#if mobileExclusive && tabletExclusive}
			<div id="inner-footer">
				<!--
        [ℹ] brand-logo-betarena
        -->
				<div
					id="brand"
					class="m-b-16"
					on:click={() => reloadPage()}
          on:keypress={(e) => { if (e.key === 'Enter') reloadPage() }}
				>
					<a

						href={homepageURL}
						title={logoLink}
					>
						<img
              loading="lazy"
							src={logo_full}
							alt="betarena-logo"
							title={logoLink}
						/>
					</a>
				</div>
				<!--
        [ℹ] follow-us-and-social-media
        -->
				<div class="m-b-40">
					<p
						class="color-white s-14 w-normal m-b-20"
					>
						{FOOTER_TRANSLATION_DATA
							.scores_footer_translations.follow}
					</p>
					<!--
          [ℹ] social media follows
          -->
					<div
						id="social-media-box"
						class="column-start-grid"
					>
						<!-- [ℹ] identify the list of social media icons
            -->
						{#each FOOTER_TRANSLATION_DATA.scores_footer_links.social_networks as social_network}
							<!-- [ℹ] social-network-component
              -->
							<a
								rel="external"
								href={social_network[1]}
							>
								<img
                  loading="lazy"
									src="/assets/svg/footer/icon/{social_network[0]
										.toString()
										.toLocaleLowerCase()}.svg"
									alt="{social_network[0]
										.toString()
										.toLocaleLowerCase()}-icon"
									title="{social_network[0]
										.toString()
										.toLocaleLowerCase()}-icon"
									width="32px"
									height="32px"
								/>
							</a>
						{/each}
					</div>
				</div>

				<!--
        [ℹ] subscribe-to-newletter
        -->
				<div
					id="newsletter-container"
					class="m-b-30"
				>
					<!--
          [ℹ] title-section
          -->
					<p
						class="color-white s-14 w-normal m-b-8 text-left"
					>
						{FOOTER_TRANSLATION_DATA
							.scores_footer_translations
							.subscribe_newsletter}
					</p>

					<!--
          [ℹ] form-start
          -->
					<form
						on:submit|preventDefault={() =>
							submitEmail()}
					>
						<!--
            [ℹ] input-email-field
            -->
						<input
							type="email"
							name="type_email"
							id=""
							placeholder={FOOTER_TRANSLATION_DATA
								.scores_footer_translations
								.type_email}
							class="m-b-12 s-14 w-400 color-grey"
						/>
						<!--
            [ℹ] button-subscribe-action
            -->
						<button
							type="submit"
							id="newsletter-subscribe-btn"
							class="btn-primary"
						>
							<p class="color-white s-14 w-500">
								{FOOTER_TRANSLATION_DATA
									.scores_footer_translations
									.subscribe_cta}
							</p>
						</button>
					</form>
				</div>

				<!--
        [ℹ] menu-list num.1
        -->

				<!--
        [ℹ] generate-translations-for-footer
        -->
				<div id="menu-list" class="m-b-40">
					<ul>
						<!--
            [ℹ] latest-news
            -->
						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links
									.latest_news}
								class="m-b-16"
							>
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.latest_news}
								</p>
							</a>
						</li>
						<!-- [ℹ] sep
            -->
						<li
							class="place-center m-r-10 m-b-16"
						>
							<div class="menu-separator" />
						</li>
						<!-- [ℹ] betting-tips
            -->
						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links
									.betting_tips}
								class="m-b-16"
							>
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.betting_tips}
								</p>
							</a>
						</li>
						<!-- [ℹ] sep
            -->
						<li
							class="place-center m-r-10 m-b-16"
						>
							<div class="menu-separator" />
						</li>
						<!-- [ℹ] about us link
            -->
						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links.about_us}
								class="m-b-16"
							>
								<!-- [ℹ] about us
                -->
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.about_us}
								</p>
							</a>
						</li>
					</ul>
					<ul>
						<!-- [ℹ] terms and conditions -->
						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links.terms}
							>
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.terms}
								</p>
							</a>
						</li>
						<!-- [ℹ] sep .. -->
						<li class="place-center m-r-10">
							<div class="menu-separator" />
						</li>
						<!-- [ℹ] privacy and conditions -->
						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links.privacy}
							>
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.privacy}
								</p>
							</a>
						</li>
					</ul>
				</div>

				<!--
        [ℹ] legal-begambleawareorg
        -->
				<div
					class="row-space-start m-b-30 place-center"
					style="width: auto;"
				>
					<img
            loading="lazy"
						src={legal18icon}
						alt="legal18icon"
						title="legal18icon"
						width="48px"
						height="24px"
						class="m-r-24"
					/>
					<img
            loading="lazy"
						src={begambleawareorg}
						alt="begambleawareorg"
						title="begambleawareorg"
						width="130px"
						height="16px"
					/>
				</div>

				<!-- [ℹ] company-details -->
				<div class="m-b-16">
					<p class="s-14 w-500 color-grey">
						Second Act
					</p>
					<p class="s-14 w-400 color-grey">
						18 Boulevard Montmartre Paris 75009
					</p>
				</div>

				<p class="s-14 w-400 color-grey">
					© 2021 Betarena All rights reserved
				</p>
			</div>
		{/if}

		<!--
    [ℹ] tablet - version only
    -->
		{#if !mobileExclusive && tabletExclusive}
			<div
				id="inner-footer"
				class="column-start-grid"
			>
				<!-- [ℹ] top-row-footer-data -->
				<div class="row-space-out m-b-50">
					<!-- [ℹ] brand-logo-betarena -->
					<div
						class="column-space-start"
						style="width: auto;"
					>
						<div
							id="brand"
							class="m-b-25"
							on:click={() => reloadPage()}
              on:keypress={(e) => { if (e.key === 'Enter') reloadPage() }}
						>
							<a

								href={homepageURL}
								title={logoLink}
							>
								<img
                  loading="lazy"
									src={logo_full}
									alt="betarena-logo"
									title={logoLink}
								/>
							</a>
						</div>

						<!-- [ℹ] follow-us-and-social-media -->
						<div>
							<p
								class="color-white s-14 w-normal m-b-12"
							>
								{FOOTER_TRANSLATION_DATA
									.scores_footer_translations
									.follow}
							</p>
							<!-- [ℹ] social media follows -->
							<div
								id="social-media-box"
								class="column-start-grid"
							>
								<!-- [ℹ] identify the list of social media icons -->
								<!-- [ℹ] render the correct items -->
								{#each FOOTER_TRANSLATION_DATA.scores_footer_links.social_networks as social_network}
									<!-- [ℹ] social-network-component -->
									<a
										rel="external"
										href={social_network[1]}
									>
										<img
                      loading="lazy"
											src="/assets/svg/footer/icon/{social_network[0]
												.toString()
												.toLocaleLowerCase()}.svg"
											alt="{social_network[0]
												.toString()
												.toLocaleLowerCase()}-icon"
											title="{social_network[0]
												.toString()
												.toLocaleLowerCase()}-icon"
											width="32px"
											height="32px"
										/>
									</a>
								{/each}
							</div>
						</div>
					</div>

					<!-- [ℹ] subscribe-to-newletter -->
					<div id="newsletter-container">
						<!-- [ℹ] title-section -->
						<p
							class="color-white s-14 w-normal m-b-8 text-left"
						>
							{FOOTER_TRANSLATION_DATA
								.scores_footer_translations
								.subscribe_newsletter}
						</p>
						<!-- [ℹ] form-start -->
						<form
							on:submit|preventDefault={() =>
								submitEmail()}
						>
							<!-- [ℹ] input-email-field -->
							<input
								type="email"
								name="type_email"
								id=""
								placeholder={FOOTER_TRANSLATION_DATA
									.scores_footer_translations
									.type_email}
								class="m-b-12 s-14 w-400 color-grey"
							/>
							<!-- [ℹ] button-subscribe-action -->
							<button
								type="submit"
								id="newsletter-subscribe-btn"
								class="btn-primary"
							>
								<p class="color-white s-14 w-500">
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.subscribe_cta}
								</p>
							</button>
						</form>
					</div>
				</div>

				<!-- [ℹ] menu-list num.1 -->

				<!-- [ℹ] generate-translations-for-footer -->

				<div id="menu-list" class="m-b-40">
					<ul class="m-b-16">
						<!-- [ℹ] latest-news -->
						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links
									.latest_news}
							>
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.latest_news}
								</p>
							</a>
						</li>
						<!-- [ℹ] sep .. -->
						<li class="place-center m-r-10">
							<div class="menu-separator" />
						</li>
						<!-- [ℹ] betting-tips -->
						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links
									.betting_tips}
							>
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.betting_tips}
								</p>
							</a>
						</li>
						<!-- [ℹ] sep .. -->
						<li class="place-center m-r-10">
							<div class="menu-separator" />
						</li>

						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links.about_us}
							>
								<!-- [ℹ] about us -->
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.about_us}
								</p>
							</a>
						</li>
						<!-- [ℹ] sep .. -->
						<li class="place-center m-r-10">
							<div class="menu-separator" />
						</li>
						<!-- [ℹ] terms and conditions -->
						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links.terms}
							>
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.terms}
								</p>
							</a>
						</li>
						<!-- [ℹ] sep .. -->
						<li class="place-center m-r-10">
							<div class="menu-separator" />
						</li>
						<!-- [ℹ] privacy and conditions -->
						<li class="m-r-10">
							<a
								rel="external"
								href={FOOTER_TRANSLATION_DATA
									.scores_footer_links.privacy}
							>
								<p
									class="color-white s-14 w-normal"
								>
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.privacy}
								</p>
							</a>
						</li>
					</ul>
				</div>

				<div class="row-space-out">
					<!-- [ℹ] company-details -->
					<div class="m-b-8">
						<!-- [ℹ] company name and details -->
						<p
							class="s-14 w-500 color-grey m-b-8"
						>
							Second Act
							<span class="w-400">
								18 Boulevard Montmartre Paris
								75009
							</span>
						</p>
						<!-- [ℹ] copytright data -->
						<p class="s-14 w-400 color-grey">
							© 2021 Betarena All rights reserved
						</p>
					</div>

					<!-- [ℹ] legal-begambleawareorg -->
					<div
						class="row-space-start m-b-30 place-center"
						style="width: auto;"
					>
						<img
              loading="lazy"
							src={legal18icon}
							alt="legal18icon"
							title="legal18icon"
							width="48px"
							height="24px"
							class="m-r-24"
						/>
						<img
              loading="lazy"
							src={begambleawareorg}
							alt="begambleawareorg"
							title="begambleawareorg"
							width="130px"
							height="16px"
						/>
					</div>
				</div>
			</div>
		{/if}

		<!--
    [ℹ] desktop - version only
    -->
		{#if !mobileExclusive && !tabletExclusive}
			<div id="inner-footer">
				<!-- [ℹ] 1st-column-footer-data -->
				<div class="column-start-grid">
					<!-- [ℹ] brand-logo-betarena -->
					<div
						id="brand"
						class="m-b-12"
						on:click={() => reloadPage()}
					>
						<a

							href={homepageURL}
							title={logoLink}
						>
							<img
                loading="lazy"
								src={logo_full}
								alt="betarena-logo"
								title={logoLink}
							/>
						</a>
					</div>

					<!-- [ℹ] copytright data -->
					<p class="s-14 m-b-16 w-400 color-grey">
						© 2021 Betarena All rights reserved
					</p>

					<!-- [ℹ] company-details -->
					<p class="s-14 w-500 color-grey">
						Second Act
						<br />
						<span class="w-400">
							18 Boulevard Montmartre Paris 75009
						</span>
					</p>
				</div>

				<!-- [ℹ] 2nd-column-footer-data -->
				<div class="column-start-grid">
					<!-- [ℹ] subscribe-to-newletter -->
					<div
						id="newsletter-container"
						class="m-b-40"
					>
						<!-- [ℹ] title-section -->
						<p
							class="color-white s-14 w-normal m-b-8 text-left"
						>
							{FOOTER_TRANSLATION_DATA
								.scores_footer_translations
								.subscribe_newsletter}
						</p>
						<!-- [ℹ] form-start -->
						<form
							on:submit|preventDefault={() =>
								submitEmail()}
							class="row-space-out"
						>
							<!-- [ℹ] input-email-field -->
							<input
								type="email"
								name="type_email"
								id=""
								placeholder={FOOTER_TRANSLATION_DATA
									.scores_footer_translations
									.type_email}
								class="m-r-20 s-14 w-400 color-grey"
							/>
							<!-- [ℹ] button-subscribe-action -->
							<button
								type="submit"
								id="newsletter-subscribe-btn"
								class="btn-primary"
							>
								<p class="color-white s-14 w-500">
									{FOOTER_TRANSLATION_DATA
										.scores_footer_translations
										.subscribe_cta}
								</p>
							</button>
						</form>
					</div>

					<!-- [ℹ] menu-list num.1 -->
					<!-- [ℹ] generate-translations-for-footer -->

					<div id="menu-list">
						<ul>
							<!-- [ℹ] latest-news -->
							<li class="m-r-10">
								<a
									rel="external"
									href={FOOTER_TRANSLATION_DATA
										.scores_footer_links
										.latest_news}
								>
									<p
										class="color-white s-14 w-normal"
									>
										{FOOTER_TRANSLATION_DATA
											.scores_footer_translations
											.latest_news}
									</p>
								</a>
							</li>
							<!-- [ℹ] sep .. -->
							<li class="place-center m-r-10">
								<div class="menu-separator" />
							</li>
							<!-- [ℹ] betting-tips -->
							<li class="m-r-10">
								<a
									rel="external"
									href={FOOTER_TRANSLATION_DATA
										.scores_footer_links
										.betting_tips}
								>
									<p
										class="color-white s-14 w-normal"
									>
										{FOOTER_TRANSLATION_DATA
											.scores_footer_translations
											.betting_tips}
									</p>
								</a>
							</li>
							<!-- [ℹ] sep .. -->
							<li class="place-center m-r-10">
								<div class="menu-separator" />
							</li>
							<!-- [ℹ] about_us -->
							<li class="m-r-10">
								<a
									rel="external"
									href={FOOTER_TRANSLATION_DATA
										.scores_footer_links.about_us}
								>
									<!-- [ℹ] about us -->
									<p
										class="color-white s-14 w-normal"
									>
										{FOOTER_TRANSLATION_DATA
											.scores_footer_translations
											.about_us}
									</p>
								</a>
							</li>
							<!-- [ℹ] sep .. -->
							<li class="place-center m-r-10">
								<div class="menu-separator" />
							</li>
							<!-- [ℹ] terms and conditions -->
							<li class="m-r-10">
								<a
									rel="external"
									href={FOOTER_TRANSLATION_DATA
										.scores_footer_links.terms}
								>
									<p
										class="color-white s-14 w-normal"
									>
										{FOOTER_TRANSLATION_DATA
											.scores_footer_translations
											.terms}
									</p>
								</a>
							</li>
							<!-- [ℹ] sep .. -->
							<li class="place-center m-r-10">
								<div class="menu-separator" />
							</li>
							<!-- [ℹ] privacy and conditions -->
							<li class="m-r-10">
								<a
									rel="external"
									href={FOOTER_TRANSLATION_DATA
										.scores_footer_links.privacy}
								>
									<p
										class="color-white s-14 w-normal"
									>
										{FOOTER_TRANSLATION_DATA
											.scores_footer_translations
											.privacy}
									</p>
								</a>
							</li>
						</ul>
					</div>
				</div>

				<!-- [ℹ] 3rd-column-footer-data -->
				<div class="column-start-grid">
					<!-- [ℹ] follow-us-and-social-media -->
					<div class="m-b-40">
						<p
							class="color-white s-14 w-normal m-b-20"
						>
							{FOOTER_TRANSLATION_DATA
								.scores_footer_translations
								.follow}
						</p>
						<!-- [ℹ] social media follows -->
						<div
							id="social-media-box"
							class="column-start-grid"
						>
							<!-- [ℹ] identify the list of social media icons -->
							{#each FOOTER_TRANSLATION_DATA.scores_footer_links.social_networks as social_network}
								<!-- [ℹ] social-network-component -->
								<a
									rel="external"
									href={social_network[1]}
								>
									<img
                    loading='lazy'
										src="/assets/svg/footer/icon/{social_network[0]
											.toString()
											.toLocaleLowerCase()}.svg"
										alt="{social_network[0]
											.toString()
											.toLocaleLowerCase()}-icon"
										title="{social_network[0]
											.toString()
											.toLocaleLowerCase()}-icon"
										width="32px"
										height="32px"
									/>
								</a>
							{/each}
						</div>
					</div>

					<!-- [ℹ] legal-begambleawareorg -->
					<div
						class="row-space-start"
						style="width: auto;"
					>
						<img
              loading="lazy"
							src={legal18icon}
							alt="legal18icon"
							title="legal18icon"
							width="48px"
							height="24px"
							class="m-r-24"
						/>
						<img
              loading="lazy"
							src={begambleawareorg}
							alt="begambleawareorg"
							title="begambleawareorg"
							width="130px"
							height="16px"
						/>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</footer>

<!-- ===================
	COMPONENT STYLE
=================== -->
<style>
	/*
    RESPONSIVE FOR MOBILE-FIRST (&+) [375px] */
	footer {
		background: #292929;
		height: 645px;
		width: -webkit-fill-available;
		padding: 48px 18px;
		box-shadow: inset 0px 1px 0px #616161;
	}
	footer #inner-footer {
		max-width: 1378px;
		/* [ℹ] */
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
	}
	footer div#menu-list div.menu-separator {
		width: 1px;
		background-color: #4b4b4b;
		height: 16px;
	}

	div#newsletter-container input {
		background: #4b4b4b;
		border-radius: 8px;
		padding: 12px 20px;
		width: 100%;
	}
	div#newsletter-container
		button#newsletter-subscribe-btn {
		height: 44px;
		width: 100%;
		background: #f5620f;
		box-shadow: 0px 3px 8px
			rgba(212, 84, 12, 0.32);
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
			text-align: -moz-center;
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

		div#newsletter-container
			button#newsletter-subscribe-btn {
			padding: 11.5px 23.5px;
			width: fit-content;
		}

		footer #social-media-box {
			justify-content: left;
		}
	}
</style>
