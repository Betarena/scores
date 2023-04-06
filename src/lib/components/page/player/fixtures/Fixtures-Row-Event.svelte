<script lang="ts">

	import { userBetarenaSettings } from '$lib/store/user-settings';
	
  import one_red_card from './assets/1_red_card.svg';
  import one_red_card_dark from './assets/1_red_card_dark.svg';
  import captain from './assets/captain.svg';
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
    if (event == 'captain') {
			icon = captain;
		}
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
    m-r-12
    event-box
  ">
  <img
    class="event-icon"
    src={icon}
    alt="default alt text"
    width="16"
    height="16"
  />
  {#if eventNum > 1}
    <p
      class="
        m-l-5
        color-success
        s-12
      ">
      {eventNum}
    </p>
  {/if}
</div>

<style>

  .event-box {
    direction: ltr;
  }
  
  @media only screen
    and (min-width: 475px) {

    .event-box {
      margin-right: 16px;
    } .event-box img.event-icon {
      width: 20px;
      height: 20px;
    } .event-box p {
      margin-left: 8px;
      font-size: 14px;
    }

  }

</style>