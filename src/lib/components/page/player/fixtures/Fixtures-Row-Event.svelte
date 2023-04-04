<script lang="ts">

	import { userBetarenaSettings } from '$lib/store/user-settings';
	
  import one_red_card from './assets/1_red_card.svg';
  import one_red_card_dark from './assets/1_red_card_dark.svg';
  import football_red from './assets/football-red.svg';
  import football from './assets/football.svg';
  import penalty_miss from './assets/miss-penalty.svg';
  import penalty from './assets/penalty.svg';
  import yellow_card from './assets/yellow-card.svg';
  import yellowred_card from './assets/yellowred.svg';
  
  export let event: string;
  export let eventNum: number;

  let icon;

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE OTHER
	// ~~~~~~~~~~~~~~~~~~~~~

	$: if (event != undefined) {
		if (event == 'goal') {
			icon = football;
		}
		if (event == 'own-goal') {
			icon = football_red;
		}
		if (event == 'substitution') {
			icon = football_red;
		}
		if (event == 'yellowcard') {
			icon = yellow_card;
		}
		if (event == 'redcard') {
			if (
        $userBetarenaSettings.theme == 'Dark'
      ) {
        icon = one_red_card;
      } else {
        icon = one_red_card_dark;
      }
		}
		if (event == 'yellowred') {
			icon = yellowred_card;
		}
		if (
			['penalty', 'pen_shootout_goal'].includes(
				event
			)
		) {
			icon = penalty;
		}
		if (
			[
				'missed_penalty',
				'pen_shootout_miss'
			].includes(event)
		) {
			icon = penalty_miss;
		}
	}
  
</script>

<div
  class="
    row-space-start
    width-auto
    m-r-16
  ">
  <img
    src={icon}
    alt="default alt text"
    width="20"
    height="20"
  />
  {#if eventNum > 1}
    <p
      class="
        m-l-8
        color-success
      ">
      {eventNum}
    </p>
  {/if}
</div>