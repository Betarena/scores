<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { browser, dev } from '$app/env';

	// ... external modules imports;
	import ColorThief from 'colorthief/dist/color-thief.mjs';

	// ... external components import;
	import FeaturedMatchContentLoading from './_FeaturedMatch_ContentLoading.svelte';

	// ... external `exports` imports;
	import { db_real } from '$lib/firebase/init';
	import { UPDATE_MATCH_FIXTURE_VOTES } from '$lib/graphql/mutation';
	import { fixtureVote } from '$lib/store/vote_fixture';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { getTargetFixtureOdds } from '$lib/firebase/index';
	import { initGrapQLClient } from '$lib/graphql/init_graphQL';
	import { ref, onValue } from 'firebase/database';

	// ... DECLARING TYPESCRIPT-TYPES imports;
	import type { fixture } from '$lib/store/vote_fixture';
	import type { FixtureResponse } from '$lib/model/interface-fixture';
	import type { SelectedFixutre, SelectedFixture_VoteUpdate_Response, TranslationsResponse } from '$lib/model/response_models';
	import { page } from '$app/stores'
	import { post } from '$lib/api/utils'

	// ... key component assets;
	import no_featured_match_visual from './assets/no_featured_match_visual.svg'

	// ... main component variables;
	export let FEATURED_MATCH_WIDGET_DATA_SEO: TranslationsResponse;
	let FEATURED_MATCH_WIDGET_DATA: FixtureResponse;

	// ... intercept-key data;
	let totalVotes: number = undefined;
	let imageURL: string = undefined;
	let selected_fixture_data: SelectedFixutre = undefined;
	let loaded: boolean = false;
	let nomatches: boolean = false;
	let refresh: boolean = false;
	let refresh_data: any = undefined;

	// ... widget-language-declaration;
	let server_side_language: string = 'en';
	// ... language-translation-declaration;
	$: if ($page.params.lang === undefined) {
		server_side_language = 'en';
	} else {
		server_side_language = $page.params.lang;
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// COMPONENT METHODS DATA LOADING
	// ~~~~~~~~~~~~~~~~~~~~~
	// - get_TargetFixtureOddsAndInfo()
	// - listenRealTimeOddsChange()
	// - get_FeaturedMatchData()
	// ~~~~~~~~~~~~~~~~~~~~~

	async function get_TargetFixtureOddsAndInfo(selectedFixutreData: SelectedFixutre): Promise < void > {
		// ... get the list of the odds for the;
		const response = await getTargetFixtureOdds(selectedFixutreData);
		// ... assign real-time-odds,
		FEATURED_MATCH_WIDGET_DATA.live_odds = response;
	}

	// ... Listen To Real-Time Firebase ODDS Updates [WORKING]
	async function listenRealTimeOddsChange(fixture_data: SelectedFixutre): Promise < void > {
		// ... DEBUGGING;
		// if (dev) console.info('-- fixture_data --', fixture_data)
		// ... convert the datetime to the correct variables to search for the fixture;
		const year_: string = new Date(fixture_data.date).getFullYear().toString();
		const month_: number = new Date(fixture_data.date).getMonth();
		// ... apply-correct-month-structure;
		let new_month_ = (month_ + 1).toString();
		new_month_ = ('0' + new_month_).slice(-2);
		// ... apply-correct-day-structure;
		let day_ = new Date(fixture_data.date).getDate().toString();
		day_ = ('0' + day_).slice(-2);
		// ... obtain FIXTURE-ID;
		const fixtureId = fixture_data.fixture_id;
		// ... listen to real-time fixture event changes;
		const fixtureRef = ref(
			db_real,
			'odds/' + year_ + '/' + new_month_ + '/' + day_ + '/' + fixtureId
		);
		// ... setup-database event listener for the odds fixture changes;
		let data;
		onValue(fixtureRef, (snapshot) => {
			// ... DEBUGGING;
			if (dev) console.info('-- fixture changed! --');
			// if (dev) console.info('fixture cahnged data', snapshot.val())
			// ...
			get_TargetFixtureOddsAndInfo(fixture_data);
		});
		// ...
		return data;
	}

	// ... main-component-promise; [WORKING]
	async function get_FeaturedMatchData(): Promise < FixtureResponse > {
		// ... get the USER-GEO-LOCATION
		let userGeo = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()
		// ... DEBUGGING;
		if (dev) console.info('-- user target location --', userGeo)
		// ... GET RESPONSE;
		const response: FixtureResponse  = await post(`api/featured_match/cache-data.json`, userGeo)
		// ... DEBUGGING;
		if (dev) console.debug('-- get_FeaturedMatchData() response --', response)
		// ... if response is null;
		if (response == null || response == undefined) {
			// ... decalre state;
			nomatches = true;
			// ...
			if (dev) console.debug('NO FEATURED MATCHES AVAILABLE!')
			// ... return null;
			return;
		}
		// ... intercept data, and decalre further;
		// ...
		FEATURED_MATCH_WIDGET_DATA = response;
		// ...
		totalVotes =
		FEATURED_MATCH_WIDGET_DATA.match_votes.vote_draw_x +
		FEATURED_MATCH_WIDGET_DATA.match_votes.vote_win_local +
		FEATURED_MATCH_WIDGET_DATA.match_votes.vote_win_visitor;
		// ...
		imageURL = FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds_info.image;
		// ...
		FEATURED_MATCH_WIDGET_DATA.time = new Date(FEATURED_MATCH_WIDGET_DATA.time.toString());
		// ...
		selected_fixture_data = FEATURED_MATCH_WIDGET_DATA.selected_data;
		// ...
		listenRealTimeOddsChange(selected_fixture_data);
		// ...
		loaded = true;
		// ... return, DATA,
		return FEATURED_MATCH_WIDGET_DATA;
		
	}

	// ... change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
	$: refresh_data = $userBetarenaSettings.country_bookmaker;
	// ...
	$: if (refresh_data) {
		// ... reset necessary variables;
		refresh = true
		loaded = false
		showBettingSite = false
		voteCasted = false
		// ... give X seconds for re-render component;
		setTimeout(async() => {
			refresh = false
		}, 50)
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// USER COMPONENT ACTTIONS METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	// ... handles user voting submit [WORKING]
	async function handleSubmit(fixtureData: fixture): Promise < void > {
		// ... declare variables for GRAPH-QL-REQUEST;
		const variables = {
			match_id: fixtureData.fixture_id,
			_1_vote: fixtureData._1_vote,
			_2_vote: fixtureData._2_vote,
			_X_vote: fixtureData._X_vote
		};
		// ... DEBUGGING;
		if (dev) console.debug('-- handleSubmit() variables --', variables);
		// ... [TRY-CATCH]
		try {
			// ... push-GRAPH-QL-request;
			const update_fixture_data: SelectedFixture_VoteUpdate_Response =
				await initGrapQLClient().request(UPDATE_MATCH_FIXTURE_VOTES, variables);
			// ... DEBUGGING;
			if (dev) console.debug('update_fixture_data', update_fixture_data);
			// ... update the existing data on the CASTED-VOTES;
			FEATURED_MATCH_WIDGET_DATA.match_votes =
				update_fixture_data.update_widget_featured_match_votes_by_pk;
			totalVotes =
				FEATURED_MATCH_WIDGET_DATA.match_votes.vote_draw_x +
				FEATURED_MATCH_WIDGET_DATA.match_votes.vote_win_local +
				FEATURED_MATCH_WIDGET_DATA.match_votes.vote_win_visitor;
		} catch (error) {
			console.error('error', error);
		}
	}

	let user_Stake_amount: number = 50.0; // ... user stake amount (input)

	/**
	 * Description: & [REACTIVITY]
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... assigning the default values for
	 * the target fixture info;
	 */
	let fixtureDataVote: fixture = {
		fixture_id: undefined,
		fixture_vote: undefined,
		fixture_vote_val: undefined,
		_X_vote: undefined,
		_1_vote: undefined,
		_2_vote: undefined
	};
	$: if ($fixtureVote.fixtureVotes_Array != undefined && loaded) {
		initVote()
	}

	function initVote() {
		// ... returns the fixture obj. matching the fixture data;
		const result = $fixtureVote.fixtureVotes_Array.find((fixture) => {
			return fixture.fixture_id === FEATURED_MATCH_WIDGET_DATA.id;
		});
		// ... if localStorage(); exists, then assign it to the `fixtureDataVote`,
		// ... and show the match-betting site information;
		if (result != undefined) {
			fixtureDataVote = result;
			showBettingSite = true;
			voteCasted = true;
			return;
		}
		// ... else;
		else {
			fixtureDataVote = {
				fixture_id: undefined,
				fixture_vote: undefined,
				fixture_vote_val: undefined,
				_X_vote: undefined,
				_1_vote: undefined,
				_2_vote: undefined
			};
			showBettingSite = false;
			voteCasted = false;
		}
	}

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... handling the user-voting on a THIS fixture
	 * ... & storing the votes on the DB (PostgresDB)
	 * ... for keeping a record of the votes;
	 */
	let showBettingSite: boolean = false;
	let voteCasted: boolean = false;
	// ... function-to-cast-vote,
	function castVote(voteType: string, voteVal: string): void {
		// ... DEBUGGING;
		if (dev) console.log('-- voteVal --', voteVal);
		// ... check if a vote has already been casted ?;
		if (!voteCasted) {
			// ... update the showBettingSite Frame;
			showBettingSite = true;
			// ... update the VoteMatch on DB;
			fixtureDataVote = {
				fixture_id: FEATURED_MATCH_WIDGET_DATA.id,
				fixture_vote: voteType,
				fixture_vote_val: voteVal,
				_X_vote: 0,
				_1_vote: 0,
				_2_vote: 0
			};
			fixtureDataVote['_' + fixtureDataVote.fixture_vote + '_vote'] = 1;
			handleSubmit(fixtureDataVote);
			// ... and .localStorage();
			fixtureVote.addToVotes(fixtureDataVote);
			// ... set the BOOLEAN to voteCasted to TRUE;
			voteCasted = true;
		}
		// ... else, do nothing;
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES LISTENERS
	// ~~~~~~~~~~~~~~~~~~~~~

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... onMount() function that verifies that
	 * the `viewport` width is of tablet size
	 * or greater;
	 */
	let viewportDesktop: boolean;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		if (wInit > 700) {
			viewportDesktop = true;
		} else {
			viewportDesktop = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			if (w > 700) {
				viewportDesktop = true;
			} else {
				viewportDesktop = false;
			}
		});
	});

	// ~~~~~~~~~~~~~~~~~~~~~
	// COMPONENT TIMER CLOCK
	// ~~~~~~~~~~~~~~~~~~~~~

	/**
	 * Description
	 * ~~~~~~~~~~~~~~~~~~~~
	 * ... `countdown-clock` for the fixture;
	 * local clock-time & other countdowns / timers,
	 * set the timer of the selected card,
	 */
	let currentDate: Date = new Date();
	let dateObjDif: number = Date.parse(currentDate.toString()) - Date.parse(new Date().toString());

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~~~~
	 * ... set the Timer in Motion;
	 * and Calcualte the difference between target
	 * time and the current time, once the fixture time
	 * has been loaded in,
	 */
	$: if (loaded) {
		dateObjDif =
			Date.parse(FEATURED_MATCH_WIDGET_DATA.time.toString()) - Date.parse(new Date().toString());
		// ... calculate the difference in the time;
		setInterval(() => {
			dateObjDif =
				Date.parse(FEATURED_MATCH_WIDGET_DATA.time.toString()) - Date.parse(new Date().toString());
		}, 1000);
	}

	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	const getOrdinalNum = (number) => {
		let selector;

		if (number <= 0) {
			selector = 4;
		} else if ((number > 3 && number < 21) || number % 10 > 3) {
			selector = 0;
		} else {
			selector = number % 10;
		}

		return number + ['th', 'st', 'nd', 'rd', ''][selector];
	};

	/**
	 * Description: & [REACTIVITY]
	 * ~~~~~~~~~~~~~~~~~~~~
	 * -> Seconds Counter;
	 * -> Minutes Counter;
	 * -> Hours Counter;
	 */
	$: countD_sec = Math.floor((dateObjDif / 1000) % 60).toString();
	$: if (parseInt(countD_sec) < 10) {
		countD_sec = '0' + countD_sec;
	}
	$: countD_min = Math.floor((dateObjDif / 1000 / 60) % 60).toString();
	$: if (parseInt(countD_min) < 10) {
		countD_min = '0' + countD_min;
	}
	$: countD_h = Math.floor((dateObjDif / (1000 * 60 * 60)) % 24).toString();
	$: if (parseInt(countD_h) < 10) {
		countD_h = '0' + countD_h;
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// COLOR-THIEF INSTANCE
	// ~~~~~~~~~~~~~~~~~~~~~

	$: if (browser && imageURL) {
		// ... apply the correct background-color to the image;
		getImageBgColor(imageURL);
	}

	// ... declaring a new instance of `ColorThief`;
	const colorThief = new ColorThief();

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~~~~
	 * ... a function-method to obtain the main
	 * `primary` color of the image
	 * and place it on the background
	 * container to keep the image the same size
	 * @param imgURL
	 */
	let imageVar: string = '--featured-match-bookmaker-bg-';
	let hexColor: string;
	// ...
	function getImageBgColor(imgURL: string) {
		try {
			// instantiate the image Type;
			const img = new Image();
			// listen, event to wait for the image to load
			img.addEventListener('load', function () {
				// get the array of RGB values,
				let colorValues = colorThief.getColor(img);
				// convert the RGB values to HEX value,
				hexColor = rgbToHex(colorValues[0], colorValues[1], colorValues[2]);
				// pass this values as a `CSS :root` variable, accessible to all the website,
				const doc = document.documentElement;
				doc.style.setProperty(imageVar, `${hexColor}`);
			});
			// ... declaring the image paramaters & CORS by-pass
			let imageURL = imgURL;
			let googleProxyURL =
				'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
			img.crossOrigin = 'Anonymous';
			img.src = googleProxyURL + encodeURIComponent(imageURL);
		} catch (e) {
			// ... CATCH;
			if (dev) console.error('-- getImageBgColor() ERR --', e);
		}
	}

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~~~~
	 * A function-method to convert the
	 * [x,a,c] of RBG values to `#HEX` values
	 * @param r
	 * @param g
	 * @param b
	 * @returns (# a singel #HEX-Color Value)
	 */
	const rgbToHex = (r, g, b) =>
		'#' + [r, g, b]
		.map((x) => {
			const hex = x.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		})
		.join('');
</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

<div>
	<!-- ... SEO-DATA-LOADED ... -->
	{#if !loaded && !nomatches}
		<!-- ... iterate over the data to find the correc language ... -->
		{#each FEATURED_MATCH_WIDGET_DATA_SEO.widget_featured_match_translations as WIDGET_SEO_TRANSLATION}
			<!-- ... obtain the correct widget translation ... -->
			{#if WIDGET_SEO_TRANSLATION.lang == server_side_language}
				<div id="seo-featured-match-box">
					<p>{WIDGET_SEO_TRANSLATION.widget_title}</p>
					<p>{WIDGET_SEO_TRANSLATION.vote}</p>
					<p>{WIDGET_SEO_TRANSLATION.assists}</p>
					<p>{WIDGET_SEO_TRANSLATION.rating}</p>
					<p>{WIDGET_SEO_TRANSLATION.player}</p>
					<p>{WIDGET_SEO_TRANSLATION.matches}</p>
					<p>{WIDGET_SEO_TRANSLATION.goals}</p>
				</div>
			{/if}
		{/each}
	{/if}

	<!-- ... NO FEATURED MATCHES AVAILABLE PLACEHOLDER ...-->
	{#if nomatches && !loaded}
		<!-- ... title of the widget ... -->
		<!-- ... iterate over the data to find the correct language ... -->
		{#each FEATURED_MATCH_WIDGET_DATA_SEO.widget_featured_match_translations as WIDGET_SEO_TRANSLATION}
			<!-- ... obtain the correct widget translation ... -->
			{#if WIDGET_SEO_TRANSLATION.lang == server_side_language}
				<!-- ... wiget-title ... -->
				<p class="s-20 m-b-10 color-white">
					{WIDGET_SEO_TRANSLATION.widget_title}
				</p>
			{/if}
		{/each}

		<!-- ... no-matches-avaiable-placeholder container ...  -->
		<div id='featured-no-match-box'
			class='row-space-start'>
			<img src={no_featured_match_visual} 
				alt="no-featured-match-visual"
				width="80px" height="80px"
				class='m-r-20'
			/>
			<!-- ... container w/ text ... -->
			<div>
				<p class='s-16 m-b-8 w-500'> No Matches Available </p>
				<p class='s-16 color-grey w-400'> Sorry, at this time there is no featured match available! </p>
			</div>
		</div>
	{/if}

	{#if !nomatches && !refresh}
		<!-- ... widget loading ... -->
		{#await get_FeaturedMatchData()}
			<!-- promise is pending -->
			<FeaturedMatchContentLoading />
		{:then data}
			<!-- ... promise was fulfilled ... -->

			<!-- ... identify the correct translation via IF -->
			{#each FEATURED_MATCH_WIDGET_DATA.translation as WIDGET_TRANSLATION}
				{#if WIDGET_TRANSLATION.lang == server_side_language}
					<!-- ... wiget-title ... -->
					<p class="s-20 m-b-10 color-white">
						{WIDGET_TRANSLATION.widget_title}
					</p>

					<div
						id="live-score-container"
						class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
					>
						<!-- ... league-game-title ... -->
						<div id="fixture-league-title" class="row-space-start">
							<!-- ... league-icon ... -->
							<img class="img-flag" src={FEATURED_MATCH_WIDGET_DATA.country_flag} alt="" />
							<!-- ... league-name-title ... -->
							<p class="w-500 large color-dark m-r-8">
								{data.league_name}
								<span class="w-400 color-grey">
									(Round {FEATURED_MATCH_WIDGET_DATA.round_name})
								</span>
							</p>
						</div>

						<!-- ... fixture-visual-voting ... -->
						{#if FEATURED_MATCH_WIDGET_DATA.live_odds != undefined}
							<div id="fixture-visual-box">
								<!-- ... fixture-visual-info ... -->
								<div id="fixture-data" class="row-space-out m-b-20">
									<!-- ... first-team ... -->
									<div class="fixture-team">
										<img
											class="m-b-12"
											src={FEATURED_MATCH_WIDGET_DATA.home_team_logo}
											alt=""
											width="72px"
											height="72px"
										/>
										<p class="w-500 medium desktop-medium">
											{FEATURED_MATCH_WIDGET_DATA.home_team_name}
										</p>
									</div>
									<!-- 
					fixture-timer-clock -->
									<div style="align-self: center;">
										<p class="w-500 x-large desktop-x-large">
											{countD_h}:{countD_min}:{countD_sec}
										</p>
										<p class="w-400 small color-grey desktop-medium" style="white-space: nowrap;">
											{getOrdinalNum(FEATURED_MATCH_WIDGET_DATA.time.getDate())}
											{monthNames[FEATURED_MATCH_WIDGET_DATA.time.getMonth().toString()]}
											{FEATURED_MATCH_WIDGET_DATA.time.getFullYear().toString().substr(-2)},
											{FEATURED_MATCH_WIDGET_DATA.time.getHours().toString()}:{(
												'0' + FEATURED_MATCH_WIDGET_DATA.time.getMinutes().toString()
											).slice(-2)}h
										</p>
									</div>
									<!-- 
					second-team -->
									<div class="fixture-team">
										<img
											class="m-b-12"
											src={FEATURED_MATCH_WIDGET_DATA.away_team_logo}
											alt=""
											width="72px"
											height="72px"
										/>
										<p class="w-500 medium desktop-medium">
											{FEATURED_MATCH_WIDGET_DATA.away_team_name}
										</p>
									</div>
								</div>
								{#if !voteCasted}
									<p class="w-500 large color-primary m-b-12 text-center">
										{WIDGET_TRANSLATION.vote}
									</p>
								{/if}

								<!-- ... voting-results-btn ... -->
								<div id="btn-vote-container" class="row-space-out">
									<!-- 
					ODDS #1 
					-->
									<div class="odds-vote-box text-center column">
										<button
											class="row-space-out cast-vote-btn m-b-12"
											class:active={fixtureDataVote.fixture_vote == '1'}
											disabled={voteCasted}
											on:click={() =>
												castVote(
													'1',
													parseFloat(
														FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds.markets[
															'1X2FT'
														].data[0].value.toString()
													).toFixed(2)
												)}
										>
											<p class="w-500 medium row-space-out">
												{#if !viewportDesktop}
													<span class="color-grey"> 1 </span>
												{:else}
													<img
														src={FEATURED_MATCH_WIDGET_DATA.home_team_logo}
														alt=""
														width="28px"
														height="28px"
													/>
												{/if}
												<span class:active_p={fixtureDataVote.fixture_vote == '1'}>
													{parseFloat(
														FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds.markets[
															'1X2FT'
														].data[0].value.toString()
													).toFixed(2)}
												</span>
											</p>
										</button>
										<!-- fixture-probability -->
										{#if !showBettingSite}
											<p class="w-400 probablitiy-text medium">
												{WIDGET_TRANSLATION.probability}
												{#if !viewportDesktop}
													<br />
												{/if}
												{Math.round(parseInt(FEATURED_MATCH_WIDGET_DATA.probabilities.home)).toFixed(
													2
												)}%
											</p>
										{:else if FEATURED_MATCH_WIDGET_DATA.match_votes != undefined}
											<p class="w-500 large">
												<span class="color-dark">
													{(
														(FEATURED_MATCH_WIDGET_DATA.match_votes.vote_win_local / totalVotes) *
														100
													).toFixed(0)}%
												</span>
												<span class="color-grey">
													({FEATURED_MATCH_WIDGET_DATA.match_votes.vote_win_local})
												</span>
											</p>
										{/if}
									</div>

									<!-- 
					ODDS #X 
					-->
									<div class="odds-vote-box text-center column">
										<button
											class="row-space-out cast-vote-btn m-b-12"
											class:active={fixtureDataVote.fixture_vote == 'X'}
											disabled={voteCasted}
											on:click={() =>
												castVote(
													'X',
													parseFloat(
														FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds.markets[
															'1X2FT'
														].data[1].value.toString()
													).toFixed(2)
												)}
										>
											<p class="w-500 medium row-space-out">
												{#if !viewportDesktop}
													<span class="color-grey"> X </span>
												{:else}
													<!-- 
							src="./static/icon/icon-close.svg"
							-->
													<img
														src="https://www.betarena.com/widgets/featured_match/static/icon/icon-close.svg"
														alt=""
														width="28px"
														height="28px"
													/>
												{/if}
												<span class:active_p={fixtureDataVote.fixture_vote == 'X'}>
													{parseFloat(
														FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds.markets[
															'1X2FT'
														].data[1].value.toString()
													).toFixed(2)}
												</span>
											</p>
										</button>
										<!-- fixture-probability -->
										{#if !showBettingSite}
											<p class="w-400 probablitiy-text medium">
												{WIDGET_TRANSLATION.probability}
												{#if !viewportDesktop}
													<br />
												{/if}
												{Math.round(parseInt(FEATURED_MATCH_WIDGET_DATA.probabilities.draw)).toFixed(
													2
												)}%
											</p>
										{:else if FEATURED_MATCH_WIDGET_DATA.match_votes != undefined}
											<p class="w-500 large">
												<span class="color-dark">
													{(
														(FEATURED_MATCH_WIDGET_DATA.match_votes.vote_draw_x / totalVotes) *
														100
													).toFixed(0)}%
												</span>
												<span class="color-grey">
													({FEATURED_MATCH_WIDGET_DATA.match_votes.vote_draw_x})
												</span>
											</p>
										{/if}
									</div>

									<!-- 
					ODDS #2 
					-->
									<div class="odds-vote-box column text-center">
										<button
											class="row-space-out cast-vote-btn m-b-12"
											class:active={fixtureDataVote.fixture_vote == '2'}
											disabled={voteCasted}
											on:click={() =>
												castVote(
													'2',
													parseFloat(
														FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds.markets[
															'1X2FT'
														].data[2].value.toString()
													).toFixed(2)
												)}
										>
											<p class="w-500 medium row-space-out">
												{#if !viewportDesktop}
													<span class="color-grey"> 2 </span>
												{:else}
													<img
														src={FEATURED_MATCH_WIDGET_DATA.away_team_logo}
														alt=""
														width="28px"
														height="28px"
													/>
												{/if}
												<span class:active_p={fixtureDataVote.fixture_vote == '2'}>
													{parseFloat(
														FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds.markets[
															'1X2FT'
														].data[2].value.toString()
													).toFixed(2)}
												</span>
											</p>
										</button>
										<!-- fixture-probability -->
										{#if !showBettingSite}
											<p class="w-400 probablitiy-text medium">
												{WIDGET_TRANSLATION.probability}
												{#if !viewportDesktop}
													<br />
												{/if}
												{Math.round(parseInt(data.probabilities.away)).toFixed(2)}%
											</p>
										{:else if FEATURED_MATCH_WIDGET_DATA.match_votes != undefined}
											<p class="w-500 large">
												<span class="color-dark">
													{(
														(FEATURED_MATCH_WIDGET_DATA.match_votes.vote_win_visitor / totalVotes) *
														100
													).toFixed(0)}%
												</span>
												<span class="color-grey">
													({FEATURED_MATCH_WIDGET_DATA.match_votes.vote_win_visitor})
												</span>
											</p>
										{/if}
									</div>
								</div>

								<!-- 
				~~~~~~~~~~~~~~
				stakes-site-info-pop-up
				-->
								{#if showBettingSite}
									<div id="site-bet-box" in:fade>
										<!-- 
					close-btn 
					src="./static/icon/white-close.svg"
					-->
										<img
											src="https://www.betarena.com/widgets/featured_match/static/icon/white-close.svg"
											alt=""
											width="16px"
											height="16px"
											style="position: absolute; top: 12px; right: 20px;"
											on:click={() => (showBettingSite = false)}
										/>
										<a href={FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds_info.register_link}>
											<img
												id="stakesSiteImg"
												src={FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds_info.image}
												alt=""
												width="100%"
												height="40px"
											/>
										</a>
										<div id="inner-site-container">
											<!-- 
						STAKES DATA -->
											<div class="m-b-20 row-space-out">
												<!-- 
						Win Type
						-->
												<div class="text-center">
													{#if fixtureDataVote.fixture_vote == '1'}
														<p class="w-400 medium m-b-8 color-grey">Home win</p>
													{:else if fixtureDataVote.fixture_vote == 'X'}
														<p class="w-400 medium m-b-8 color-grey">Draw</p>
													{:else}
														<p class="w-400 medium m-b-8 color-grey">Away win</p>
													{/if}
													<div class="input-value row-space-out medium text-center">
														{#if viewportDesktop}
															{#if fixtureDataVote.fixture_vote == '1'}
																<img
																	src={FEATURED_MATCH_WIDGET_DATA.home_team_logo}
																	alt=""
																	width="28px"
																	height="28px"
																/>
															{:else if fixtureDataVote.fixture_vote == 'X'}
																<p class="w-500 medium row-space-out">
																	<span class="color-grey"> X </span>
																</p>
															{:else}
																<img
																	src={FEATURED_MATCH_WIDGET_DATA.away_team_logo}
																	alt=""
																	width="28px"
																	height="28px"
																/>
															{/if}
														{/if}
														<input
															id="win-type"
															class="w-500 medium text-center desktop-view-winnings"
															type="number"
															bind:value={fixtureDataVote.fixture_vote_val}
															disabled
														/>
													</div>
												</div>

												<!-- MULTIPLY SIGN -->
												<img
													src="/assets/svg/icon/icon-close.svg"
													alt="multiply-icon"
													width="16px"
													height="16px"
													style="margin-top: 25px;"
												/>

												<!-- 
						Stake 
						-->
												<div class="text-center">
													<p class="w-400 medium m-b-8 color-grey">{WIDGET_TRANSLATION.stake}</p>
													<input
														class="w-500 input-value medium text-center"
														type="text"
														bind:value={user_Stake_amount}
													/>
												</div>

												<!-- EQUALS SIGN -->
												<img
													src="/assets/svg/icon/icon-equally.svg"
													alt="icon-equlaity"
													width="16px"
													height="16px"
													style="margin-top: 25px;"
												/>

												<!-- 
						Winnings 
						-->
												<div class="text-center">
													<p class="w-400 medium m-b-8 color-grey">
														{WIDGET_TRANSLATION.winnings}
													</p>
													<input
														class="w-500 input-value medium text-center"
														type="number"
														value={(
															parseFloat(fixtureDataVote.fixture_vote_val) * user_Stake_amount
														).toFixed(2)}
														disabled
													/>
												</div>
											</div>

											<!-- 
						PLACE BET BUTTON -->
											<a href={FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds_info.register_link}>
												<button class="place-bet-btn btn-primary m-b-12">
													<p class="small">
														{WIDGET_TRANSLATION.place_bet}
													</p>
												</button>
											</a>

											<!-- 
						BETTING SITE INFO -->
											<p class="small text-center color-grey">
												{FEATURED_MATCH_WIDGET_DATA.live_odds.fixture_odds_info.information}
											</p>
										</div>
									</div>
								{/if}
							</div>
						{/if}

						<!-- ... live-streams-frame-box ... -->
						{#if FEATURED_MATCH_WIDGET_DATA.tvstations.length != 0}
							<div id="live-stream-box">
								<!-- 
				live-streams-title-section -->
								<p class="w-500 large m-b-8" style="padding-left: 20px;">
									{WIDGET_TRANSLATION.streams}
								</p>
								<!-- 
				live-streams-grid -->
								<div id="livestream-grid">
									{#each FEATURED_MATCH_WIDGET_DATA.tvstations as tv_item}
										<a rel="external" href={tv_item.link}>
											<div class="tooltip">
												<button class="live-stream-btn">
													<img
														src={tv_item.img}
														alt={tv_item.alt}
														title={tv_item.Name}
														width="45px"
														height="26px"
													/>
												</button>
												<p class="s_small tooltiptext">{tv_item.Name}</p>
											</div>
										</a>
									{/each}
								</div>
							</div>
						{/if}

						<!-- ... best-players (Both-Teams) -->
						<div id="best-players-box-out">
							<!--
				~~~~~~~~~~~~~
				TEAM - HOME 
				-->
							<div class="best-players-box">
								<div class="row-space-start m-b-16">
									<img
										class="m-r-16"
										src={FEATURED_MATCH_WIDGET_DATA.home_team_logo}
										alt=""
										width="32px"
										height="32px"
									/>
									<p class="w-500 large">
										{FEATURED_MATCH_WIDGET_DATA.home_team_name}
										{WIDGET_TRANSLATION.players}
									</p>
								</div>
								<table class="table-best-player">
									<tr class="row-head m-b-16">
										<th class="rating-head">
											<p class="w-400 small color-grey">
												{WIDGET_TRANSLATION.rating}
											</p>
										</th>
										<th class="player-col">
											<p class="w-400 small color-grey">
												{WIDGET_TRANSLATION.player}
											</p>
										</th>
										{#if viewportDesktop}
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.matches}
												</p>
											</th>
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.assists}
												</p>
											</th>
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.goals}
												</p>
											</th>
										{/if}
									</tr>
									<!-- PLAYER 1 -->
									<tr>
										<td>
											<div
												class="rating-box"
												class:bronze={FEATURED_MATCH_WIDGET_DATA.best_players
													.local_team_rating_player_1 >= 0 &&
													FEATURED_MATCH_WIDGET_DATA.best_players.local_team_rating_player_1 < 7}
												class:silver={FEATURED_MATCH_WIDGET_DATA.best_players
													.local_team_rating_player_1 >= 7 &&
													FEATURED_MATCH_WIDGET_DATA.best_players.local_team_rating_player_1 < 9}
												class:golden={FEATURED_MATCH_WIDGET_DATA.best_players
													.local_team_rating_player_1 >= 9}
											>
												<p class="w-500 medium">
													{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_rating_player_1}
												</p>
											</div>
										</td>
										<td class="row-space-start">
											<img
												src={FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_1_image_path}
												alt=""
												width="32px"
												height="32px"
												class="player-img"
											/>
											<p class="w-500 small desktop-small">
												{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_1}
											</p>
										</td>
										{#if viewportDesktop}
											<td>
												<p class="w-500 medium boxed-rating-matches">
													{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_1_appearances}
												</p>
											</td>
											<td>
												<p class="w-500 medium boxed-rating-assits">
													{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_1_assists}
												</p>
											</td>
											<td>
												<p class="w-500 medium boxed-rating-goals">
													{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_1_goals}
												</p>
											</td>
										{/if}
									</tr>
									<!-- PLAYER 2 -->
									<tr>
										<td>
											<div
												class="rating-box"
												class:bronze={FEATURED_MATCH_WIDGET_DATA.best_players
													.local_team_rating_player_2 >= 0 &&
													FEATURED_MATCH_WIDGET_DATA.best_players.local_team_rating_player_2 < 7}
												class:silver={FEATURED_MATCH_WIDGET_DATA.best_players
													.local_team_rating_player_2 >= 7 &&
													FEATURED_MATCH_WIDGET_DATA.best_players.local_team_rating_player_2 < 9}
												class:golden={FEATURED_MATCH_WIDGET_DATA.best_players
													.local_team_rating_player_2 >= 9}
											>
												<p class="w-500 medium">
													{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_rating_player_2}
												</p>
											</div>
										</td>
										<td class="row-space-start">
											<img
												src={FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_2_image_path}
												alt=""
												width="32px"
												height="32px"
												class="player-img"
											/>
											<p class="w-500 small desktop-small">
												{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_2}
											</p>
										</td>
										{#if viewportDesktop}
											<td>
												<p class="w-500 medium boxed-rating-matches">
													{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_2_appearances}
												</p>
											</td>
											<td>
												<p class="w-500 medium boxed-rating-assits">
													{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_2_assists}
												</p>
											</td>
											<td>
												<p class="w-500 medium boxed-rating-goals">
													{FEATURED_MATCH_WIDGET_DATA.best_players.local_team_player_2_goals}
												</p>
											</td>
										{/if}
									</tr>
								</table>
							</div>

							<!--
				~~~~~~~~~~~~~
				TEAM - AWAY 
				-->
							<div class="best-players-box">
								<div class="row-space-start m-b-16">
									<img
										class="m-r-16"
										src={FEATURED_MATCH_WIDGET_DATA.away_team_logo}
										alt=""
										width="32px"
										height="32px"
									/>
									<p class="w-500 large">
										{FEATURED_MATCH_WIDGET_DATA.away_team_name}
										{WIDGET_TRANSLATION.players}
									</p>
								</div>
								<!--  -->
								<table class="table-best-player">
									<tr class="row-head m-b-16">
										<th class="rating-head">
											<p class="w-400 small color-grey">
												{WIDGET_TRANSLATION.rating}
											</p>
										</th>
										<th class="player-col">
											<p class="w-400 small color-grey">
												{WIDGET_TRANSLATION.player}
											</p>
										</th>
										{#if viewportDesktop}
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.matches}
												</p>
											</th>
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.assists}
												</p>
											</th>
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.goals}
												</p>
											</th>
										{/if}
									</tr>
									<!-- PLAYER 1 -->
									<tr>
										<td>
											<div
												class="rating-box"
												class:bronze={FEATURED_MATCH_WIDGET_DATA.best_players
													.visitor_team_rating_player_1 >= 0 &&
													FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_rating_player_1 < 7}
												class:silver={FEATURED_MATCH_WIDGET_DATA.best_players
													.visitor_team_rating_player_1 >= 7 &&
													FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_rating_player_1 < 9}
												class:golden={FEATURED_MATCH_WIDGET_DATA.best_players
													.visitor_team_rating_player_1 >= 9}
											>
												<p class="w-500 medium">
													{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_rating_player_1}
												</p>
											</div>
										</td>
										<td class="row-space-start">
											<img
												src={FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_1_image_path}
												alt=""
												width="32px"
												height="32px"
												class="player-img"
											/>
											<p class="w-500 small desktop-small">
												{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_1}
											</p>
										</td>
										{#if viewportDesktop}
											<td>
												<p class="w-500 medium boxed-rating-matches">
													{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_1_appearances}
												</p>
											</td>
											<td>
												<p class="w-500 medium boxed-rating-assits">
													{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_1_assists}
												</p>
											</td>
											<td>
												<p class="w-500 medium boxed-rating-goals">
													{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_1_goals}
												</p>
											</td>
										{/if}
									</tr>
									<!-- PLAYER 2 -->
									<tr>
										<td>
											<div
												class="rating-box"
												class:bronze={FEATURED_MATCH_WIDGET_DATA.best_players
													.visitor_team_rating_player_2 >= 0 &&
													FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_rating_player_2 < 7}
												class:silver={FEATURED_MATCH_WIDGET_DATA.best_players
													.visitor_team_rating_player_2 >= 7 &&
													FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_rating_player_2 < 9}
												class:golden={FEATURED_MATCH_WIDGET_DATA.best_players
													.visitor_team_rating_player_2 >= 9}
											>
												<p class="w-500 medium">
													{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_rating_player_2}
												</p>
											</div>
										</td>
										<td class="row-space-start">
											<img
												src={FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_2_image_path}
												alt=""
												width="32px"
												height="32px"
												class="player-img"
											/>
											<p class="w-500 small desktop-small">
												{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_2}
											</p>
										</td>
										{#if viewportDesktop}
											<td>
												<p class="w-500 medium boxed-rating-matches">
													{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_2_appearances}
												</p>
											</td>
											<td>
												<p class="w-500 medium boxed-rating-assits">
													{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_2_assists}
												</p>
											</td>
											<td>
												<p class="w-500 medium boxed-rating-goals">
													{FEATURED_MATCH_WIDGET_DATA.best_players.visitor_team_player_2_goals}
												</p>
											</td>
										{/if}
									</tr>
								</table>
							</div>
						</div>

						<!-- ... value-bets section ... -->
						{#if FEATURED_MATCH_WIDGET_DATA.valuebets != null}
							<div id="value-bets">
								<p class="w-500 large m-b-16">
									{WIDGET_TRANSLATION.value_bet}
								</p>
								{#if !viewportDesktop}
									<div id="value-bets-container">
										<div id="value-bets-inner-info">
											<!-- 
						VALUE-BET INFO -->
											<div class="row-space-out">
												<p class="w-400 medium color-grey">
													{WIDGET_TRANSLATION.bookmaker}
												</p>
												<a rel="external" href={FEATURED_MATCH_WIDGET_DATA.valuebets.link}>
													<img
														src={FEATURED_MATCH_WIDGET_DATA.valuebets.image}
														alt={FEATURED_MATCH_WIDGET_DATA.valuebets.bookmaker}
														height="30px"
														width="56px"
														style="height: 30px !important;"
													/>
												</a>
											</div>

											<div class="row-space-out">
												<p class="w-400 medium color-grey">
													{WIDGET_TRANSLATION.type}
												</p>
												<p class="w-500 medium color-dark">
													{WIDGET_TRANSLATION.market_name}
												</p>
											</div>

											<div class="row-space-out">
												<p class="w-400 medium color-grey">
													{WIDGET_TRANSLATION.market}
												</p>
												<p class="w-500 medium color-dark">
													{FEATURED_MATCH_WIDGET_DATA.valuebets.bet.toString()}
												</p>
											</div>

											<div class="row-space-out">
												<p class="w-400 medium color-grey">
													{WIDGET_TRANSLATION.odds}
												</p>
												<a rel="external" href={FEATURED_MATCH_WIDGET_DATA.valuebets.link}>
													<p
														class="w-500 medium color-dark"
														style="background: #FFFFFF;
							border-radius: 4px;
							padding: 4px 6px;"
													>
														{parseFloat(FEATURED_MATCH_WIDGET_DATA.valuebets.odd.toString()).toFixed(
															2
														)}
													</p>
												</a>
											</div>

											<div class="row-space-out">
												<p class="w-400 medium color-grey">
													{WIDGET_TRANSLATION.fair_odds}
												</p>
												<a rel="external" href={FEATURED_MATCH_WIDGET_DATA.valuebets.link}>
													<p
														class="w-500 medium color-dark"
														style="background: #FFFFFF;
							border-radius: 4px;
							padding: 4px 6px;"
													>
														{parseFloat(
															FEATURED_MATCH_WIDGET_DATA.valuebets.fair_odd.toString()
														).toFixed(2)}
													</p>
												</a>
											</div>
										</div>
										<!-- 
					VALUE-BET BUTTON -->
										<a rel="external" href={FEATURED_MATCH_WIDGET_DATA.valuebets.link}>
											<button
												style="width: 100%; padding: 6px 0; border-radius: 4px;"
												class="btn-primary"
											>
												<p class="w-500 medium">
													{WIDGET_TRANSLATION.bet}
												</p>
											</button>
										</a>
									</div>
								{:else}
									<table class="value_bets">
										<tr class="row-head m-b-16">
											<th class="text-center" style="text-align: start;">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.bookmaker}
												</p>
											</th>
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.type}
												</p>
											</th>
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.market}
												</p>
											</th>
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.odds}
												</p>
											</th>
											<th class="text-center">
												<p class="w-400 small color-grey">
													{WIDGET_TRANSLATION.fair_odds}
												</p>
											</th>
											<th class="text-center" />
										</tr>
										<!-- 
					VALUE-BET - ROW SINGLE -->
										<tr>
											<td class="text-center" style="text-align: start;">
												<a
													rel="external"
													href={FEATURED_MATCH_WIDGET_DATA.valuebets.link}
													style="height: 30px;"
												>
													<img
														src={FEATURED_MATCH_WIDGET_DATA.valuebets.image}
														alt={FEATURED_MATCH_WIDGET_DATA.valuebets.bookmaker}
														height="30px"
														width="56px"
														style="object-fit: cover; border-radius: 4px; height: 30px !important;"
													/>
												</a>
											</td>
											<td>
												<p class="w-500 medium text-center">
													{WIDGET_TRANSLATION.market_name}
												</p>
											</td>
											<td>
												<p class="w-500 medium text-center">
													{FEATURED_MATCH_WIDGET_DATA.valuebets.bet.toString()}
												</p>
											</td>
											<td>
												<a rel="external" href={FEATURED_MATCH_WIDGET_DATA.valuebets.link}>
													<p
														class="w-500 medium max-height: 30px; boxed-rating-value-bets active_p_btn"
													>
														{parseFloat(FEATURED_MATCH_WIDGET_DATA.valuebets.odd.toString()).toFixed(
															2
														)}
													</p>
												</a>
											</td>
											<td>
												<a rel="external" href={FEATURED_MATCH_WIDGET_DATA.valuebets.link}>
													<p
														class="w-500 medium max-height: 30px; boxed-rating-value-bets active_p_btn"
													>
														{parseFloat(
															FEATURED_MATCH_WIDGET_DATA.valuebets.fair_odd.toString()
														).toFixed(2)}
													</p>
												</a>
											</td>
											<td>
												<a rel="external" href={FEATURED_MATCH_WIDGET_DATA.valuebets.link}>
													<button
														style="width: 100%; padding: 6px 0; max-height: 30px; border-radius: 4px;"
														class="btn-primary"
													>
														<p class="w-500 medium">
															{WIDGET_TRANSLATION.bet}
														</p>
													</button>
												</a>
											</td>
										</tr>
									</table>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			{/each}

		{:catch error}
			<!-- promise was rejected -->
			<p>Uh-oh! There has been an error! {error}</p>
		{/await}
	{/if}

</div>

<!-- ===============
  COMPONENT STYLE
==================== -->
<style>

	#featured-no-match-box {
		padding: 20px;
		background: #FFFFFF;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
	}
	
	#seo-featured-match-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

	#live-score-container {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		min-width: 100%;
		width: 100%;
		max-width: 343px;
		padding-bottom: 4px;
		overflow: hidden;
	}

	#fixture-league-title {
		padding: 10px 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
	}

	#fixture-visual-box {
		padding: 25px 20px 20px 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
	}

	#fixture-data {
		display: grid;
		grid-auto-flow: column;
		justify-items: center;
		align-items: start;
		justify-content: center;
		grid-template-columns: 1fr 1fr 1fr;
		text-align: center;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		border: none;
	}

	/* ====================
    vote-button-container 
  ==================== */

	#btn-vote-container {
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		justify-items: center;
		justify-content: space-between;
		width: -webkit-fill-available;
	}
	.odds-vote-box {
	}
	.cast-vote-btn {
		background: #f2f2f2;
		border: 1px solid #cccccc !important;
		box-sizing: border-box;
		border-radius: 8px;
		padding: 14px 16px;
		transition: all ease 0.15s;
		box-shadow: none !important;
		width: 96px;
		height: 48px;
	}
	.cast-vote-btn.active {
		background: #ffffff !important;
		border: 1px solid #f5620f !important;
		box-sizing: border-box;
		border-radius: 8px;
		opacity: 1 !important;
	}
	.cast-vote-btn:disabled {
		opacity: 0.5;
	}
	.probablitiy-text {
		text-align: center;
		color: #8c8c8c;
		width: min-content;
	}

	.active_p {
		color: #f5620f !important;
	}

	.active_p_btn:hover {
		color: #f5620f !important;
	}

	#site-bet-box {
		margin-top: 35px;
		background: #f2f2f2;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	}
	#inner-site-container {
		padding: 20px 12px;
		background: #f2f2f2;
		border-radius: 8px;
	}
	#inner-site-container button.place-bet-btn {
		height: 46px;
		width: 100%;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
	}
	.input-value {
		-moz-appearance: textfield;
		background: #ffffff;
		border-radius: 8px;
		height: 48px;
		width: 76px;
		border: none;
	}
	#inner-site-container input {
		background: rgb(255, 255, 255);
		color: black !important;
		opacity: 1 !important;
	}
	input#win-type {
		width: 100%;
		border-radius: 5px;
		border: 0;
		outline: none;
	}

	.img-flag {
		width: 24px;
		height: 18px;
		margin-right: 16px;
		filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1));
		border-radius: 2px !important;
		vertical-align: middle !important;
	}

	#stakesSiteImg {
		background-color: var(--featured-match-bookmaker-bg-);
		object-fit: none;
		height: 40px;
	}

	#live-stream-box {
		padding: 20px 0;
		box-shadow: inset 0px -1px 0px #ebebeb;
		overflow: hidden;
		width: inherit;
	}
	#livestream-grid {
		display: grid;
		grid-auto-flow: column;
		gap: 8px 13px;
		overflow-y: scroll;
		padding: 0 20px;
		grid-template-columns: repeat(auto-fill, 71px);
	}
	/* Hide scrollbar for Chrome, Safari and Opera */
	#livestream-grid::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	#livestream-grid {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.live-stream-btn {
		border: 1px solid #cccccc !important;
		box-sizing: border-box;
		border-radius: 4px;
		padding: 7px 12px;
		/* padding: 0 !important; */
		background-color: transparent;
		box-shadow: none !important;
		width: 68px;
		height: 40px;
	}
	.live-stream-btn img {
		object-fit: contain;
		width: 100%;
	}

	/* ====================
    best-players-container 
  ==================== */

	#best-players-box-out {
	}
	.best-players-box {
		padding: 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
	}

	table.table-best-player,
	table.value_bets {
		text-align: left;
		border-collapse: collapse;
		width: 100%;
	}
	table.table-best-player .row-head,
	table.value_bets .row-head {
		background: #f2f2f2;
		border-radius: 2px;
	}
	table td,
	table th {
		padding: 7px 12px;
		/* padding: 7px 0; */
		vertical-align: middle;
		border: none !important;
	}
	table.table-best-player tr td:first-child {
		padding-left: 0;
	}

	table tr td:last-child {
		padding-right: 0;
	}

	table tr td {
		padding-top: 16px !important;
		padding-bottom: 0px;
	}

	.rating-head {
		width: 59px;
	}
	.rating-box {
		width: fit-content;
		border-radius: 30px;
		padding: 1.5px 8px;
		color: white;
	}
	.rating-box p {
		color: white;
	}
	.golden {
		background: #ffb904;
	}
	.silver {
		background: #a1a1a1;
	}
	.bronze {
		background: #dbb884;
	}

	.tooltip {
		border-bottom: none !important;
	}
	.tooltip .tooltiptext {
		display: none;
	}

	.player-img {
		border: 1px solid #cccccc;
		border-radius: 50%;
		margin-right: 8px;
	}

	/* ====================
    value-bets-container 
  ==================== */

	#value-bets {
		padding: 20px;
	}
	#value-bets-container {
		background: #f2f2f2;
		border-radius: 2px;
		width: 100%;
	}
	#value-bets-inner-info {
		padding: 12px;
		display: grid;
		grid-auto-rows: 1fr;
		justify-items: center;
		align-items: center;
		gap: 4px;
	}
	#value-bets-inner-info img {
		border-radius: 4px;
		width: 56px;
		object-fit: cover;
	}

	/* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
	@media only screen and (min-width: 700px) {
		#inner-site-container button {
			height: 44px;
		}

		.boxed-rating-matches {
			background: #ffffff;
			border: 1px solid #e6e6e6;
			box-sizing: border-box;
			border-radius: 4px;
			text-align: center;
			padding: 5px 0;
			max-height: 30px;
			width: 64px;
		}
		.boxed-rating-assits,
		.boxed-rating-value-bets {
			background: #f2f2f2;
			border-radius: 4px;
			text-align: center;
			padding: 5px 0;
			max-height: 30px;
			width: 64px;
		}
		.boxed-rating-goals {
			background: #e6e6e6;
			border-radius: 4px;
			text-align: center;
			padding: 5px 0;
			max-height: 30px;
			width: 64px;
		}

		table.table-best-player tr th:first-child p {
			left: 10%;
			position: relative;
		}
		table.table-best-player tr th:last-child p {
			left: 10%;
			position: relative;
		}

		table tr td:first-child {
			padding-left: 10px;
		}
		table td,
		table th {
			padding: 7px 10px;
		}

		#live-score-container {
			width: 100%;
			max-width: 700px;
		}
		#livestream-grid {
			grid-auto-flow: unset;
			overflow-y: visible;
			grid-template-columns: repeat(auto-fill, 65px);
		}
		.input-value {
			width: 100%;
			max-width: 164px;
			padding: 14px;
		}
		.cast-vote-btn {
			min-width: 206px;
			width: 100%;
			height: 48px;
		}
		.desktop-view-winnings {
			padding: 0;
			text-align: end;
		}
		.desktop-small {
			font-size: 14px !important;
		}
		.desktop-medium {
			font-size: 16px !important;
		}
		.desktop-x-large {
			font-size: 20px !important;
		}
		.live-stream-btn {
			padding: 0 5px;
		}
		.player-col {
			width: 357px;
		}
		.rating-head {
			width: 44px;
		}
		table.value_bets tr th:nth-child(-n + 3),
		table.value_bets tr td:nth-child(-n + 3) {
			max-width: 72px !important;
			padding-right: 24px;
		}
		table.value_bets tr th:nth-child(3),
		table.value_bets tr td:nth-child(3) {
			padding-right: 190px !important;
		}
		table.value_bets tr th:nth-last-child(-n + 3),
		table.value_bets tr td:nth-last-child(-n + 3),
		table.value_bets tr td button {
			width: 64px !important;
		}
		.player-img {
			margin-right: 16px;
		}
		table tr:nth-child(2) td {
			padding-top: 20px !important;
		}
	}

	/* 
  DESKTOP RESPONSIVNESS */
	@media only screen and (min-width: 1024px) {
		#live-score-container {
			width: 100%;
			max-width: 560px;
		}
		.input-value {
			width: 100%;
			max-width: 110px;
		}

		.tooltip .tooltiptext {
			display: unset !important;
		}

		.tooltip {
			position: relative;
			display: inline-block;
			border-bottom: none !important;
		}
		.tooltip .tooltiptext {
			visibility: hidden;
			width: 120px;
			color: #fff;
			text-align: center;
			padding: 10px;
			position: absolute;
			z-index: 1;
			top: -100%;
			left: 50%;
			margin-left: -60px;
			background: #4b4b4b;
			box-shadow: inset 0px -1px 0px #3c3c3c;
			border-radius: 4px;
			transition: all 0.15s ease-in;
		}
		.tooltip:hover .tooltiptext {
			visibility: visible !important;
		}
		.cast-vote-btn {
			min-width: 140px;
			width: 100%;
			height: 48px;
		}

		table.value_bets tr th:nth-child(-n + 3),
		table.value_bets tr td:nth-child(-n + 3) {
			max-width: 72px !important;
			padding-right: 24px;
		}
		table.value_bets tr th:nth-last-child(-n + 3),
		table.value_bets tr td:nth-last-child(-n + 3),
		table.value_bets tr td button {
			width: 64px !important;
		}

		table.value_bets tr th:nth-child(3),
		table.value_bets tr td:nth-child(3) {
			padding-right: 24px !important;
		}

		table.table-best-player th:first-child {
			width: 44px !important;
		}
		table.table-best-player tr th:first-child,
		table.table-best-player tr td:first-child {
			/* padding-right: 0px; */
		}
		table.table-best-player th.player-col {
			/* min-width: 226px !important;
      max-width: 226px !important; */
			width: 100%;
		}
		.player-img {
			margin-right: 16px;
		}
	}

	/* .............. 
  WIDGET DARK THEME 
  ................. */
	.dark-background-1 #fixture-league-title,
	.dark-background-1 #fixture-visual-box,
	.dark-background-1 .best-players-box,
	.dark-background-1 #live-stream-box {
		box-shadow: inset 0px -1px 0px #616161 !important;
	}

	.dark-background-1 .cast-vote-btn {
		background-color: #616161 !important;
		border: 1px solid #999999 !important;
	}
	.dark-background-1 .cast-vote-btn.active {
		border: 1px solid #f5620f !important;
	}

	.dark-background-1 table.table-best-player .row-head,
	.dark-background-1 table.value_bets .row-head {
		background-color: #616161 !important;
	}

	.dark-background-1 p {
		color: #ffffff;
	}

	.dark-background-1 .live-stream-btn {
		background-color: #ffffff !important;
		border: 1px solid #616161 !important;
	}

	.dark-background-1 table.table-best-player .row-head th p,
	.dark-background-1 table.value_bets .row-head th p,
	.dark-background-1 .probablitiy-text {
		color: #a8a8a8 !important;
	}

	.dark-background-1 #site-bet-box,
	.dark-background-1 #inner-site-container {
		background-color: #616161 !important;
	}
	.dark-background-1 #inner-site-container .input-value {
		background-color: #4b4b4b !important;
		color: #ffffff !important;
	}

	.dark-background-1 #inner-site-container input {
		color: #ffffff !important;
	}
	.dark-background-1 input#win-type {
		background-color: #4b4b4b !important;
	}

	@media only screen and (min-width: 700px) {
		.dark-background-1 .boxed-rating-matches {
			background-color: #4b4b4b !important;
			border: 1px solid #616161 !important;
		}
		.dark-background-1 .boxed-rating-assits,
		.dark-background-1 .boxed-rating-value-bets {
			background-color: #616161 !important;
		}
		.dark-background-1 .boxed-rating-goals {
			background-color: #737373 !important;
		}
	}

	@media only screen and (min-width: 1024px) {
		.dark-background-1 .tooltip .tooltiptext {
			background: #616161;
			box-shadow: inset 0px -1px 0px #3c3c3c;
		}
	}
</style>