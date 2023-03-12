<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	import { fade } from 'svelte/transition';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import type {
		Fixture_Player,
		REDIS_CACHE_SINGLE_lineups_translation
	} from '$lib/models/fixtures/lineups/types';

	import {
		FIXTURE_LIVE_TIME_OPT,
		type FIXTURE_STATUS_TYPES
	} from "@betarena/scores-lib/dist/api/sportmonks.js";
	import substitution from './assets/corner-up-right.svg';
	import football from './assets/football.svg';
	import injured from './assets/injured.svg';
	import red_card from './assets/red-card.svg';
	import yellow_card from './assets/yellow-card.svg';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	export let PLAYER_INFO: Fixture_Player;
	export let FIXTURE_LINEUPS_TRANSLATION: REDIS_CACHE_SINGLE_lineups_translation;
	export let STATUS: FIXTURE_STATUS_TYPES;
	export let TYPE: 'R' | 'L';

	let ratingColorCode: string;

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE OTHER
	// ~~~~~~~~~~~~~~~~~~~~~

	$: if (
		PLAYER_INFO != undefined &&
		PLAYER_INFO?.rating != undefined
	) {
		if (parseFloat(PLAYER_INFO.rating) >= 9) {
			ratingColorCode = 'G';
		} else if (
			parseFloat(PLAYER_INFO.rating) >= 7
		) {
			ratingColorCode = 'Y';
		} else {
			ratingColorCode = 'T';
		}
	} else {
		ratingColorCode = undefined;
	}
</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

{#if PLAYER_INFO != undefined && FIXTURE_LINEUPS_TRANSLATION != undefined}
	<div
		class="
      player-row
      row-space-out
    "
		class:type-L={TYPE == 'L'}
		class:dark-background-1={$userBetarenaSettings.theme ==
			'Dark'}
		in:fade
	>
		{#if TYPE == 'R'}
			<!-- 
        [ℹ] right-container
        [ℹ] player avatar
        [ℹ] player name
        [ℹ] player visual icons 
        -->
			<div
				class="
            row-space-start
          "
			>
				<!-- 
          [ℹ] player avatar 
          -->
				<img
					src={PLAYER_INFO?.player_avatar ||
						'https://cdn.sportmonks.com/images/soccer/placeholder.png'}
					alt=""
					width="40px"
					height="40px"
					class="lineup-img"
					on:error={(e) =>
						(e.target.src =
							'https://cdn.sportmonks.com/images/soccer/placeholder.png')}
				/>
				<!-- 
          [ℹ] player main box 
          -->
				<div>
					<div
						class="
                row-space-start
                player-info-row
              "
					>
						<p
							class="
                  w-500
                  color-black-2
                  lineup-player-name
                "
						>
							{PLAYER_INFO?.number}
							{PLAYER_INFO?.player_name}
						</p>
						<!--
              [ℹ] injured-player 
              -->
						{#if PLAYER_INFO?.events?.injured}
							<img src={injured} alt="" />
						{/if}
						<!--
              [ℹ] yellowcard-player 
              -->
						{#if PLAYER_INFO?.events?.yeallow_card}
							<img src={yellow_card} alt="" />
							{#if PLAYER_INFO?.events?.yeallow_card > 1}
								<p>2</p>
							{/if}
						{/if}
						<!--
              [ℹ] goals-player (inc. own-goals) 
              -->
						{#if PLAYER_INFO?.events?.goals}
							<img src={football} alt="" />
						{/if}
						<!--
              [ℹ] red-card-player 
              -->
						{#if PLAYER_INFO?.events?.red_card}
							<img src={red_card} alt="" />
							{#if PLAYER_INFO?.events?.red_card > 1}
								<p>2</p>
							{/if}
						{/if}
					</div>
					<!--
            [ℹ] substitution / position[T]
             -->
					{#if PLAYER_INFO?.events?.substitution}
						<div
							class="
                  row-space-start
                "
						>
							<img
								src={substitution}
								alt=""
								width="16px"
								height="16px"
								class="m-r-5"
							/>
							<p
								class="
                    w-400
                    color-grey
                    lineup-player-name
                  "
							>
								{PLAYER_INFO?.events?.substitution
									?.minute}' Out: {PLAYER_INFO
									?.events?.substitution
									?.related_player_name}
							</p>
						</div>
					{:else if PLAYER_INFO?.position}
						<p
							class="
                    w-400
                    color-grey
                    lineup-player-name
                  "
						>
							{FIXTURE_LINEUPS_TRANSLATION[
								PLAYER_INFO?.position.toLowerCase()
							]}
						</p>
					{/if}
				</div>
			</div>

			<!-- 
        [ℹ] left-container
        [ℹ] player rating
        -->
			<div
				class="row-space-end"
				style="width: auto;"
			>
				{#if FIXTURE_LIVE_TIME_OPT.includes(STATUS) && PLAYER_INFO?.rating != undefined && parseInt(PLAYER_INFO?.rating) != 0}
					<p
						id="box-goals"
						class="medium w-500"
						class:rating_golden={ratingColorCode ===
							'G'}
						class:rating_silver={ratingColorCode ===
							'Y'}
						class:rating_bronze={ratingColorCode ===
							'T'}
					>
						{PLAYER_INFO?.rating}
					</p>
				{/if}
			</div>
		{:else}
			<!-- 
        [ℹ] right-container
        [ℹ] player rating
        -->
			<div
				class="row-space-start"
				style="width: auto;"
			>
				{#if FIXTURE_LIVE_TIME_OPT.includes(STATUS) && PLAYER_INFO?.rating != undefined && parseInt(PLAYER_INFO?.rating) != 0}
					<p
						id="box-goals"
						class="medium w-500"
						class:rating_golden={ratingColorCode ===
							'G'}
						class:rating_silver={ratingColorCode ===
							'Y'}
						class:rating_bronze={ratingColorCode ===
							'T'}
					>
						{PLAYER_INFO?.rating}
					</p>
				{/if}
			</div>

			<!-- 
        [ℹ] left-container
        [ℹ] player avatar
        [ℹ] player name
        [ℹ] player visual icons 
        -->
			<div
				class="
            row-space-end
          "
			>
				<!-- 
          [ℹ] player main box 
          -->
				<div>
					<div
						class="
                row-space-end
                player-info-row
              "
					>
						<!--
              [ℹ] injured-player 
              -->
						{#if PLAYER_INFO?.events?.injured}
							<img src={injured} alt="" />
						{/if}
						<!--
              [ℹ] yellowcard-player 
              -->
						{#if PLAYER_INFO?.events?.yeallow_card}
							<img src={yellow_card} alt="" />
							{#if PLAYER_INFO?.events?.yeallow_card > 1}
								<p>2</p>
							{/if}
						{/if}
						<!--
              [ℹ] goals-player (inc. own-goals) 
              -->
						{#if PLAYER_INFO?.events?.goals}
							<img src={football} alt="" />
						{/if}
						<!--
              [ℹ] red-card-player 
              -->
						{#if PLAYER_INFO?.events?.red_card}
							<img src={red_card} alt="" />
							{#if PLAYER_INFO?.events?.red_card > 1}
								<p>2</p>
							{/if}
						{/if}
						<!-- 
              [ℹ] player name 
              -->
						<p
							class="
                  w-500
                  color-black-2
                  lineup-player-name
                "
						>
							{PLAYER_INFO?.number}
							{PLAYER_INFO?.player_name}
						</p>
					</div>
					<!--
            [ℹ] player positon 
            -->
					{#if PLAYER_INFO?.events?.substitution}
						<div
							class="
                  row-space-end
                "
						>
							<img
								src={substitution}
								alt=""
								width="16px"
								height="16px"
								class="m-r-5"
							/>
							<p
								class="
                    w-400
                    color-grey
                    lineup-player-name
                  "
							>
								{PLAYER_INFO?.events?.substitution
									?.minute}' Out: {PLAYER_INFO
									?.events?.substitution
									?.related_player_name}
							</p>
						</div>
					{:else if PLAYER_INFO?.position}
						<p
							class="
                    w-400
                    color-grey
                    lineup-player-name
                  "
						>
							{FIXTURE_LINEUPS_TRANSLATION[
								PLAYER_INFO?.position.toLowerCase()
							]}
						</p>
					{/if}
				</div>
				<!-- 
          [ℹ] player avatar 
          -->
				<img
					src={PLAYER_INFO?.player_avatar ||
						'https://cdn.sportmonks.com/images/soccer/placeholder.png'}
					alt=""
					width="40px"
					height="40px"
					class="lineup-img"
					on:error={(e) =>
						(e.target.src =
							'https://cdn.sportmonks.com/images/soccer/placeholder.png')}
				/>
			</div>
		{/if}
	</div>
{/if}

<!-- ===============
  COMPONENT STYLE
==================== -->
<style>
	div.player-row {
		padding: 8px 20px;
	}
	div.player-row img.lineup-img {
		object-fit: contain;
		border-radius: 50%;
		border: 1px solid #e6e6e6;
		background-color: #ffffff;
		/* dynamic */
		margin-right: 16px;
	}
	div.player-row
		div.player-info-row
		p.lineup-player-name {
		/* dynamic */
		font-size: 14px;
	}
	div.player-row div.player-info-row img {
		/* dynamic */
		margin-left: 8px;
	}
	div.player-row p#box-goals {
		box-sizing: border-box;
		text-align: center;
		border-radius: 30px;
		padding: 1.5px 8px;
		max-height: 24px;
		width: auto;
		color: white;
	}
	div.player-row p#box-goals.rating_golden {
		background-color: #ffb904 !important;
	}
	div.player-row p#box-goals.rating_silver {
		background-color: #8c8c8c !important;
	}
	div.player-row p#box-goals.rating_bronze {
		background-color: #dbb884 !important;
	}

	/* TYPE "L" */
	div.player-row.type-L img.lineup-img {
		margin-left: 16px;
	}
	div.player-row.type-L p.lineup-player-name {
		/* dynamic */
		text-align: end;
	}
	div.player-row div.player-info-row img {
		/* dynamic */
		margin-right: 8px;
	}

	/* 
  MOBILE RESPONSIVNESS (&+) */
	@media only screen and (max-width: 425px) {
		/* EMPTY */
	}

	@media only screen and (max-width: 475px) {
		/* EMPTY */
	}

	/* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1160px) and (max-width: 1240px) {
		/* EMPTY */
	}

	@media only screen and (min-width: 1240px) {
		/* EMPTY */
	}

	/* .............. 
	WIDGET DARK THEME 
	................. */
</style>
