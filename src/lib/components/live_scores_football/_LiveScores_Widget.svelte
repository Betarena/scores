<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">

	// ... external components import;
	// ... external `exports` imports;
	import { db_real } from '$lib/firebase/init';
	import { ref, onValue } from 'firebase/database';

	// ... DECLARING TYPESCRIPT-TYPES imports;
	import type {   LiveScoreGame, LiveScoreLeagueGame, LiveScoreLeague, DayName, LiveScoreIcon, LiveScoreBookIcon } from '$lib/models/featured_match/response_models';
	import { page } from '$app/stores'


	// ... key component assets;
	import play from './assets/play.svg'
	import play_dark from './assets/play_dark.svg'
	import redcard from './assets/card.svg'
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import PlaceholderLivescores from './loaders/_Placeholder_Livescores.svelte';
	import type { LiveScore_SEO_Game_Scoped_Lang } from '$lib/models/featured_betting_sites/firebase-real-db-interface';
	import type { LiveScores_Football_Translation } from '$lib/models/live_scores_football/types';	

	export let LIVE_SCORES_DATA_DATA_SEO: LiveScore_SEO_Game_Scoped_Lang[];
	export let LIVE_SCORES_DATA_LEAGUES: any;
	export let LIVE_SCORES_FOOTBALL_TRANSLATIONS: LiveScores_Football_Translation[];

	var leagueSort = {};

	let TABLE_GAMES: { [key: string]: LiveScoreLeague[] } = {};
	let CURRENT_TABLE:  LiveScoreLeague[]  = [];
	let currentDay = 0;
	let currentSelection = 0;
	let currentTable = 'livescores_today';
	let lastTable = 'livescores_today';
	
	let isMoreGames: boolean = false;
	let refresh: boolean = false;
	let refresh_data: any = undefined;
	let LIVESCORES_TRANSLATIONS: any = {};
	let hasCachedGames: any ={};
	let bookIcons: { [key: string]: LiveScoreBookIcon }  = {};
	let requestedIcons:boolean = false;
	// ... widget-language-declaration;
	let server_side_language: string = 'en';
	// ... language-translation-declaration;
	$: if ($page.params.lang === undefined) {
		server_side_language = 'en';
		LIST_DAYS= LIST_DAYS;
	} else {
		server_side_language = $page.params.lang;
		LIST_DAYS= LIST_DAYS;
		renderDays();
	}
	let userBook = '';
	let userGeo = '';

	//Get Betting Icons from Firebase
	async function listenBettingIcon(): Promise<{ [key: string]: LiveScoreBookIcon }> {

		if(requestedIcons) {
			bookIcons = bookIcons;
		
			return;
		}
		requestedIcons = true;
		onValue(ref(db_real,"betting_site_icon_per_country"), (snapshot) => {
			let icons: LiveScoreIcon = snapshot.val();
			bookIcons = {};

			for(var i in icons.country){
				bookIcons[icons.country[i].iso] = icons.country[i];
			}
		
			bookIcons = bookIcons;
			userBook = userBook;

			if(!bookIcons[userBook])
				bookIcons[userBook] = bookIcons['default'];

		});

		return bookIcons;
	}

	// ... Listen To Real-Time Firebase Games Updates
	async function listenRealTimeGamesChange(table:string,all:boolean): Promise < LiveScoreLeague[] > {
		
		let data: LiveScoreLeague[] = [];
		let base = "livescores_table";
		if(all) base = base+"_all";
		
		var fullTable = base+"/"+table;
		isMoreGames = all;

		if(hasCachedGames[fullTable]) {				
			return;
		}

		hasCachedGames[table] = true;
		//Get Games from firebase in realtime and cache them in TABLE_GAMES
		onValue(ref(db_real,fullTable), (snapshot) => {
			
			data =[]; 
			
			let games: LiveScoreGame[] = snapshot.val();
	
			for(var g in games){  			
				
				const newGame:  LiveScoreLeagueGame={
					id : games[g].id,
					visitorteam: games[g].visitorteam,
					localteam : games[g].localteam,
					localScore : games[g].localteam_score,
					visitorScore : games[g].visitorteam_score,
					minute: games[g].minute,
					medias: games[g].medias,
					status: games[g].status,
					links: games[g].links,
					homeCards: games[g].cards ? games[g].cards.filter(x=>x.team_name ==  games[g].localteam).length:0,
					visitorCards:games[g].cards? games[g].cards.filter(x=>x.team_name ==  games[g].visitorteam).length:0,
					tips: games[g].tips,
					starting_at_ts: games[g].starting_at_ts,
					hour: games[g].starting_at.split(' ')[1].slice(0,-3)
				}; 

				var l = data.filter(x=>x.id === games[g].league_id)[0];
				if(l==null){
					const league : LiveScoreLeague={
						games: [],
						id : games[g].league_id,
						flag : games[g].flag.toUpperCase().replace("FLAGS","images/flags").replace(".SVG",".svg"),
						name:games[g].league,
						order: getLeagueOrders(games[g].league_id)
					};
					data.push(league);  
					l = league;
				} 

				l.games.push(newGame);
			}

			TABLE_GAMES[base+snapshot.ref.key] = data;
			if(currentTable == snapshot.ref.key && (!isMoreGames || isMoreGames&&base.includes("all"))){
				if(all) isMoreGames = true;
				CURRENT_TABLE = data;			
			}	
			
		});
		return data;
	}

	function getTerm(t:any,i:number){
		return LIVESCORES_TRANSLATIONS[server_side_language]
		? LIVESCORES_TRANSLATIONS[server_side_language].terms[t][i] : '';
	}
	let LIST_DAYS: DayName[] = [];

	//Create the Days in the Header
	function renderDays(){
		var dayNames = [];
		for(var d = 0; d < 7;d++){
			dayNames.push(getTerm('days',d));
		}
		LIST_DAYS = [];
		for(let i = -3;i < 4;i++){ 
		let day: Date = new Date();
        day.setDate(day.getDate() + i);
		LIST_DAYS.push({name:dayNames[day.getDay()],day:day.getDate(),sel:i,table:tableNames[i+3]});
    } 

	}

	var tableNames = ['livescores_3daysago','livescores_2daysago','livescores_yesterday','livescores_today','livescores_tomorrow','livescores_2days','livescores_3days'];


	$: refresh_data = $userBetarenaSettings.country_bookmaker;
	// ...
	$: if (refresh_data) {
		// ... reset necessary variables;
		refresh = true
		// ... give X seconds for re-render component;
		setTimeout(async() => {
			refresh = false
		}, 50)
	}
	
	leagueSort = LIVE_SCORES_DATA_LEAGUES;

	listenRealTimeGamesChange('livescores_now',false);

//Returns the order of all leagues
function getLeagueOrders(league_id: number): { [key: string]: number; } {
	let retVal: { [key: string]: number; } = {};
	for(var country in leagueSort){
		retVal[country] = getLeagueOrder(league_id,country);
	}
	
	return retVal;
}

//Returns the order of a league depending on the selected country
function getLeagueOrder(league_id: number,country:string):  number {
	for(var v in leagueSort[country]){
		if (leagueSort[country][v].league_id == league_id)
			return leagueSort[country][v].index;
	}

	return 999;
}


async function widgetInit(): Promise < void > {
	listenBettingIcon();

	//Aggregate translations by language
	let translations:LiveScores_Football_Translation[] = LIVE_SCORES_FOOTBALL_TRANSLATIONS;
	

		for(var k in translations){
			LIVESCORES_TRANSLATIONS[translations[k].lang] = {};
			LIVESCORES_TRANSLATIONS[translations[k].lang].status = {};
			LIVESCORES_TRANSLATIONS[translations[k].lang].status_abv = {};
			LIVESCORES_TRANSLATIONS[translations[k].lang].terms = {};

			for(var i in translations[k].terms){
				let a = translations[k].terms[i];
				LIVESCORES_TRANSLATIONS[translations[k].lang].terms[a[0]] = a.slice(1);
			}
		}

		LIVESCORES_TRANSLATIONS = LIVESCORES_TRANSLATIONS;
		LIST_DAYS= LIST_DAYS;
		renderDays();
	
	
	if($userBetarenaSettings.country_bookmaker)
		userBook = $userBetarenaSettings.country_bookmaker.toString().toLowerCase()
	if($userBetarenaSettings.geoJs)
		userGeo = $userBetarenaSettings.geoJs.country_code.toLowerCase()
		
	bookIcons = bookIcons;
	return null;
}


$: refresh_data = $userBetarenaSettings.country_bookmaker;
$: if (refresh_data) {
	bookIcons = bookIcons;
}


</script>
 

<!-- ===============
  COMPONENT HTML 
==================== -->

<!-- SEO DATA -->
<div id="seo-live-scores-box">
	{#if LIVE_SCORES_DATA_DATA_SEO}
		{#each LIVE_SCORES_DATA_DATA_SEO as d}
			<p>{d.visitorteam}</p>
			<p>{d.localteam}</p>
			<a href="{d.tip}">{d.tip}</a>
			<a href="{d.link}">{d.link}</a>
		{/each}
	{/if}
	{#if LIVESCORES_TRANSLATIONS[server_side_language] }
		<p>{LIVESCORES_TRANSLATIONS[server_side_language].terms['Game Table']}</p>
	{/if}
 </div>

 <!-- WIDGET -->
{#if !refresh}

{#await widgetInit()}
<!-- ... promise was fulfilled ... -->
{:then} 
{#if LIVESCORES_TRANSLATIONS[server_side_language]}
<p class="s-20 m-b-10 color-white">
	{LIVESCORES_TRANSLATIONS[server_side_language] ? LIVESCORES_TRANSLATIONS[server_side_language].terms['Game Table']:''}
</p>
<div class="game-table-container {$userBetarenaSettings.theme == 'Dark' ? 'theme-dark' : ''}">
	<div class="base">
		<div class="dayList">
				{#each LIST_DAYS as d}
					<div class="day {d.sel == currentDay ? 'sel':''} {d.sel == 0 ? 'current':''}" on:click="{()=>{currentDay = d.sel;
	if(!TABLE_GAMES[d.table])
			TABLE_GAMES[d.table] = [];
			CURRENT_TABLE = TABLE_GAMES[d.table];
						currentTable=d.table
						currentSelection =0;
						CURRENT_TABLE=	CURRENT_TABLE.sort((x,y)=>x.order[userGeo]-y.order[userGeo]);
						}}">
						<div>{d.name}</div>
						<div class="dayNumber">{d.day}</div>
					</div>
			 	{/each}
		</div>
		</div>
	<!-- svelte-ignore empty-block -->
	{#await listenRealTimeGamesChange(currentTable,false)}
	{:then data} 
	<div class="betarena-menu" style=""><span class="lnkAll {currentSelection == 0?'lnkSelected':''}" on:click="{
	()=>{
		currentSelection =0;
		currentTable = lastTable
		
		if(!TABLE_GAMES[lastTable])
			TABLE_GAMES[lastTable] = [];

		CURRENT_TABLE = TABLE_GAMES[lastTable];
	}
	}">{LIVESCORES_TRANSLATIONS[server_side_language] ? LIVESCORES_TRANSLATIONS[server_side_language].terms['all']:''} ({currentTable != "livescores_now" ? CURRENT_TABLE.reduce((a, b) => a + b.games.length, 0) : TABLE_GAMES['livescores_table'+lastTable].reduce((a, b) => a + b.games.length, 0) })</span>
		<span class="lnkLive {currentSelection == 1?'lnkSelected':''}" on:click="{()=>{
			currentSelection =1;
			lastTable=currentTable;
			currentTable='livescores_now'; 
			CURRENT_TABLE = TABLE_GAMES['livescores_tablelivescores_now'];
		}}">{LIVESCORES_TRANSLATIONS[server_side_language] ? LIVESCORES_TRANSLATIONS[server_side_language].terms['live']:''} (<span class="numLive">{TABLE_GAMES['livescores_tablelivescores_now'] ? TABLE_GAMES['livescores_tablelivescores_now'].reduce((a, b) => a + b.games.length, 0):0}</span>)</span></div>
		<div class="leaguesList">
			{#if CURRENT_TABLE.length > 0 || currentTable== 'livescores_now' }
		{#each CURRENT_TABLE.sort((x,y)=>x.order[userGeo]-y.order[userGeo]) as d}
		<div class="league"> 
			<div class="league-title">
			<div class="icon-league">
				<img class="img-flag" src="{d.flag}" width="19" height="12" alt="League Country Flag">
				<span class="league-name">{d.name}</span>
			</div>
		</div>
		<div class="game-list">

			{#each d.games.sort((x,y)=>x.starting_at_ts-y.starting_at_ts)  as g}
			<div class="league-body {g.status=='LIVE' ? 'in-progress':''} {(g.status == "NS"  || g.status == "POSTP" || g.status == "TBA" || g.status == "CANCL") ? 'not-started':''}">
				<div class="game-col-1" title="">
					{#if g.status != "LIVE" && g.status != "HT" }
						<div class="game-time {g.status == 'FT' ? 'finished':''}" >{g.hour}</div>
					{:else if g.status != "HT"}
						<div class="game-time">{g.minute} <span class="blinker blink">'</span></div>
					{/if}
					{#if g.status != "FT" && g.status != "NS"  && g.status != "LIVE" }
						<div class="game-status">{g.status.toLowerCase()}</div>
					{/if}
				</div>
				<a class="game-teams" href="{g.links ? g.links[server_side_language]:''}">
					<div class="team first {g.localScore < g.visitorScore ? 'loser':''} {g.localScore == g.visitorScore ? 'tie':''}"><span class="teamname">{g.localteam}</span>
						<span class="cards">
							{#if g.homeCards > 0}
								<img alt="red card" class="redcard" src="{redcard}"/>
							{/if}
						</span>
					</div>
					<div class="team second {g.localScore > g.visitorScore ? 'loser':''} {g.localScore == g.visitorScore ? 'tie':''}"><span class="teamname">{g.visitorteam}</span><span class="cards">	{#if g.visitorCards > 0}
						<img alt="red card" class="redcard" src="{redcard}"/>
					{/if}</span></div></a>
				{#if g.medias > 0}
				<a class="game-media" href="{g.links ? g.links[server_side_language]:''}" >
					{#if $userBetarenaSettings.theme == 'Dark'}
						<img alt="Game Media" style="border-color: #737373;" src="{play_dark}" width="28" height="28"> 
					{:else}
						<img alt="Game Media"  src="{play}" width="28" height="28"> 
					{/if}
				</a> 
				{:else}   
				<a class="game-media" href="{g.links ? g.links[server_side_language]:''}" >
						<img alt="Game Media" style="visibility:hidden" src="{play_dark}" width="28" height="28"> 
				</a> 
				{/if}  

				{#if g.tips != null && g.tips[server_side_language] != undefined}
					<a class="table-game-tip" style="" href="{g.tips[server_side_language].link}">{LIVESCORES_TRANSLATIONS[server_side_language] ? LIVESCORES_TRANSLATIONS[server_side_language].terms['tip']:''}</a>
				{/if}

						<div class="game-book"><a class="lnk-book" href='{bookIcons[userBook] ? bookIcons[userBook].link : bookIcons['default'].link}' target="_blank"><img class="img-book" width="24" height="22" src="{bookIcons[userBook] ? bookIcons[userBook].icon2 : bookIcons['default'].icon}" alt="{bookIcons[userBook] ? bookIcons[userBook].alt : bookIcons['default'].alt}"></a></div>
						<div class="game-result"><div class="result first {g.localScore < g.visitorScore ? 'loser':''} {g.localScore == g.visitorScore ? 'tie':''}">{g.localScore}</div><div class="result second {g.localScore > g.visitorScore ? 'loser':''} {g.localScore == g.visitorScore ? 'tie':''}">{g.visitorScore}</div></div>
					</div> 
				{/each}
		
		</div>  
		
		</div>
				
		
		{/each}
		{:else}

		<PlaceholderLivescores />
		<PlaceholderLivescores />
		<PlaceholderLivescores />
		<PlaceholderLivescores />
		<PlaceholderLivescores />
		<PlaceholderLivescores />
		<PlaceholderLivescores />
		
		{/if}
	</div>
	{#if currentTable!='livescores_now' && !isMoreGames}
	<div class="more-games" on:click={()=>{
		listenRealTimeGamesChange(currentTable,true);		
	}}>Check more games</div>
	{/if}
	{/await}

</div>

{/if}
{/await}
{/if}
<!-- ===============
  COMPONENT STYLE
==================== -->
<style>

.game-table-container {
	width: 100% !important;
	background: #FFFFFF;
	box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
	border-radius: 12px;
}

.game-table-container.theme-dark{
	background: var(--dark-theme-1);
}

	.game-table-container .base {
		background: transparent !important;
		width: 100% !important;
		height: auto !important;
	}

	.game-table-container .day {
		padding: 7px 0 !important;
		width: 55px !important;
	}

		.game-table-container .day div:nth-child(1) {
			font-size: 14px;
			color: #292929;
			text-align: center;
		}

		.game-table-container .day div:nth-child(2) {
			font-weight: 500 !important;
			font-size: 14px !important;
			color: #292929 !important;
			text-align: center;
		}


		.theme-dark.game-table-container .day div{
			color: white !important;
		}
		

		.game-table-container .day.current {
			background: transparent !important;
		}

	

		.game-table-container .day.current div:nth-child(1), .game-table-container .day.current div:nth-child(2) {
			color: #F5620F !important;
		}

		.game-table-container .day.selected div:nth-child(1), .game-table-container .day.selected div:nth-child(2) {
			color: #fff !important;
		}

	.game-table-container .dayList {
		display: flex !important;
		justify-content: space-evenly !important;
		padding: 20px;
	}

	.game-table-container .day:hover {
		background: #F2F2F2;
		border-radius: 6px !important;
	}



	.game-table-container .day:hover div:nth-child(1), .game-table-container .day:hover div:nth-child(2) {
		color: #292929 !important;
	}

	.theme-dark.game-table-container .day:hover:not(.selected) {
		background: #616161;
		color: white !important;
	}



	.theme-dark.game-table-container .day:hover div:nth-child(1), .theme-dark.game-table-container .day:hover div:nth-child(2) {
		color: white !important;
	}




	.game-table-container .day.selected:hover div:nth-child(1), .game-table-container .day.selected:hover div:nth-child(2) {
		color: #fff !important;
	}

	.game-table-container .betarena-menu {
		text-align: left !important;
		width: 100% !important;
		margin: 0 !important;
		border-bottom: 1px solid #E6E6E6 !important;
		display: flex;
		padding: 0 20px;
		margin-bottom: 30px !important;
	}

	.theme-dark.game-table-container .betarena-menu{
		border-bottom: 1px solid #616161!important;
	}

		.game-table-container .betarena-menu span, .game-table-container .betarena-menu span {
			width: 50%;
			font-weight: 500;
			font-size: 14px;
			color: #8C8C8C;
			font-family: "Roboto", Sans-serif !important;
			text-align: center;
			padding: 3px 0 !important;
			height: auto !important;
			position: relative;
		}

			.game-table-container .betarena-menu span.lnkSelected, .game-table-container .betarena-menu span.lnkSelected span {
				color: #F5620F !important;
			}

				.game-table-container .betarena-menu span.lnkSelected:after {
					content: '';
					position: absolute;
					display: block;
					width: 100%;
					height: 1px;
					background: #F5620F;
					bottom: -1px;
				}

		.game-table-container .betarena-menu .numLive:after {
			content: '';
			position: absolute;
			background-image: url("/src/lib/components/live_scores/assets/live.svg");
			width: 16px;
			height: 16px;
			right: -22px;
			top: -7px;
		}

.leaguesList {
	padding: 0 20px !important;
}

.league-name {
	color: #292929 !important;
	font-size: 16px !important;
	text-transform: capitalize !important;
	font-weight: 500 !important;
}


.theme-dark .league-name{
	color:#ffffff!important;
}


.icon-league {
	display: flex;
}




.league-body {
	display: flex;
	align-items: center;
}

	.league-body .game-teams {
		flex-grow: 1;
	}


	

	.league-body .lnk-book {
		display: flex;
	}

	.league-body .game-result {
		display: flex;
		flex-direction: column;
	}

.game-result .loser {
	font-weight: 500 !important;
	font-size: 14px !important;
	text-align: center !important;
	color: #8C8C8C !important;
	font-family: "Roboto", Sans-serif !important;
}

.game-result .result:not(.loser) {
	font-weight: 500 !important;
	font-size: 14px !important;
	text-align: center !important;
	color: #292929 !important;
	font-family: "Roboto", Sans-serif !important;
}

.theme-dark .league-body:not(.in-progress) .game-result .result:not(.loser){
	color: white !important;
}

.theme-dark .game-result .result .in-progress{
	color: #FF0A0A !important;
}

.in-progress .game-result .game-time, .in-progress .game-result .result {
	font-weight: 500 !important;
	font-size: 14px !important;
	text-align: center !important;
	color: #FF0A0A !important;
	font-family: "Roboto", Sans-serif !important;
}

.leaguesList {
	padding-bottom: 12px !important;
}

.more-games {
	border-top: 1px solid #EBEBEB !important;
	background: transparent !important;
	padding: 25px 0 !important;
	font-weight: 500 !important;
	font-size: 14px !important;
	color: #F5620F !important;
}

 .game-table-container {
	font-family: 'Roboto'
}

.teamname {
    vertical-align: middle;
}

.cards {
	vertical-align: middle;
}



/*
.tabela-de-jogos {	height: 19px;	width: 128px;	color: #434343;		font-size: 16px;	font-weight: bold;	letter-spacing: 0.25px;	line-height: 19px;}
*/
.base {    height: 48px;
	width: 357px;
	box-sizing: content-box;
	margin-top: 20px;
	margin:0 auto;
}

.league:not(:first-child){
	border-top: 1px solid #EFF0F1;
	margin-top: 5px;
}

.theme-dark .league:not(:first-child){
	border-top: 1px solid #616161;
	margin-top: 5px;
}


.league-title{
	margin-bottom: 10px;
	margin-top: 15px;
}

.league-title img{
	vertical-align: middle;
}

.league-body {
	margin-bottom: 1px;
	min-height: 45px;
	font-size: 0;
	padding-top: 3px;
	/*padding-bottom:7px;
		min-height: 45px;	*/
}
/*
.elementor-shortcode{
    padding-bottom: 25px;
	width:100%;
	height: auto;
	margin:0 auto;
}*/

.league-name {
	color: #292929;
	font-size: 16px;
	font-weight: 500;
	margin-left: 19px;
	line-height: 150%;
	font-style: normal;
    margin-top: 3px;
}

.result {
	height:15px;
	line-height: 17px;
	width: 100%;
	font-size: 12px;
	letter-spacing: -0.07px;
	text-align: right;
	display: inline-block;
	overflow: hidden;
	margin-top: 3px;
	margin-bottom: 4px;
}

.game-teams,.game-book,.game-result,.game-col-1,.table-game-tip,.game-media
{
	display:inline-block;
}

.game-col-1{
	vertical-align:middle;
	padding-right:11px;
}

a.table-game-tip {
	width: 43px;
	height: 30px;
	background: #FFFFFF;
	vertical-align: middle;
	text-align: center;
	font-weight: bold;
	margin-right: 15px;
	text-decoration: none;
	font-size: 12px;
	letter-spacing: -0.07px;
	line-height: 30px;
	border: 1px solid #CCCCCC;
	color: #292929;
	border-radius: 6px;
}

.theme-dark a.table-game-tip{
	background: #4B4B4B;
	color:white;
	border-color: #737373;
}

	a.table-game-tip:hover {
		border: 1px solid #F5620F;
		color: #F5620F;
		font-size: 12px !important;
        line-height: 30px;
        font-weight: bold !important;
	}

.game-time, .game-status {
	width: 37px;
	text-align: center;
	vertical-align: middle;
	/*font-family: "Rubik Regular";*/
	height: 21px;
	color: #292929;
	font-size: 14px;
	letter-spacing: -0.07px;
	line-height: 21px;
	text-transform: capitalize;
}

.theme-dark .game-status , .theme-dark .game-time{
	color:white;
}
.theme-dark .game-time{
	color:#FFFFFF;
}
.game-table-container .game-media {
	width: 30px;
	height: 30px;
	text-align: left;
	vertical-align: middle;
	color: #FF9D09;
	font-size: 15px;
	letter-spacing: -0.07px;
	line-height: 30px;
	text-transform: capitalize;
	vertical-align: middle;
	margin-right: 10px;
}

.game-media{
	height:30px;
	width:30px;
}

	.game-media img {
        border: 2px solid #CCCCCC;
        border-radius: 16px;
        padding: 5px;
	}



.game-status {
	color: #DB0000;
	text-transform: capitalize;
	text-align:center!important;
}

.game-teams
{
	width: 70%;
	border-left:1px solid #eee;
	vertical-align: middle;
	padding-left: 9px;
} 

.theme-dark .game-teams{
	border-left:1px solid #616161;

}

	.game-teams .team {
		height: 20px;
		width: 100%;
		color: #292929;
		font-size: 14px;
		font-weight: 500;
		line-height: 17px;
		margin-top: 2px;
		margin-left: 7px !important;
        font-family: "Roboto", Sans-serif !important;
	}

	.theme-dark .team{
		color:#ffffff!important;
	}

		.game-teams .team.second{
			position:relative;
		}

		.game-book {
			vertical-align: middle;
			width: 30px;
		}

.game-result
{
	width: 20px;
	margin-left:13px;
	text-align: right;
	vertical-align: middle;
}

.img-flag {
	width: 24px;
    height: 18px;
	margin-left: 7px;
	filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1));
	border-radius: 2px !important;
    vertical-align: middle!important;
	margin-top:5px;
}

.redcard{
	margin-left: 11px;
	display: inline-block;
	vertical-align:-3px!important;
}


.lnkAll {
	height: 35px;
	width: 50%;
	color: #8C8C8C;
	font-family: "Roboto";
	font-size: 14px;
	font-weight: 500;
	line-height: 35px;
	cursor: pointer;
	display: inline-block;
	text-align: center;
}

.lnkLive {
	cursor: pointer;
	line-height:35px;
}

.lnkSelected {
	color: #F5620F;
	border-bottom: 1px solid #F5620F;
}

.team.loser {
	color: #8C8C8C!important;
}


.in-progress .game-time,.in-progress .result{
	color:red!important;
}

.theme-dark .in-progress .game-time, .theme-dark  .in-progress .result{
	color: #ff5959 !important;
}


.in-progress .game-time {
	padding-left: 4px;
}


.base {
	color: #292929;
}

.theme-dark .base{
	color:#ffffff;
}

.dayList .day {
	width: 42px !important;
	height: 56px !important;
	display: inline-block;
	font-size: 14px;
	cursor: pointer;
	height: 100%;
	padding:7px 0 !important;
	font-weight: normal;
}

	.dayList .day:hover {
		background:#F2F2F2;
		border-radius: 6px;
	}
	.dayList .day.current {
		color: #F5620F !important;
	}

	.dayList .day.sel {
		background: #F5620F !important;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 6px;
		color: white !important;
	}

    .game-table-container .day.sel div:nth-child(1) {
	    color: white !important;
    }

.day div {
    height: 21px!important;
}

.dayList {
	text-align: center;
	width: 100%;
	display: inline-block;
}

.not-started .game-result{
	display:none!important;
}

.dayNumber{
	font-weight: normal;
	padding-top:3px;
}

.lnk-book img.img-book {
	width: 30px;
	height: 30px;
    border-radius: 4px;
}

.more-games {
	width: 100%;
	background: white;
	padding: 5px;
	text-align: center;
	cursor: pointer;
	color: #F5620F;
	font-size: 14px;
	border-top: 1px solid #EBEBEB;
}


.theme-dark .more-games{
	border-color:#616161!important;

}

.lnk-book{
	vertical-align: 	middle;	
}

.league:first-child .league-title{
	margin-top: 0px!important;
}


@keyframes clockwise {
	to {transform: rotate(360deg) translatez(0);}
}

@keyframes counter-clockwise {
	to {transform: rotate(-360deg) translatez(0);}
}

@keyframes bounce {
	50% {transform: translatey(-20px);}
	100% {transform: translatey( 20px);}
}

@keyframes zoom {
	to {
		width: calc(250px + 20px);
		margin-left: calc(-125px - 10px);
		margin-top: calc(-125px - 10px);
		border-width: 10px;
		border-color: hsla(0, 0%, 78%, 1);
	}
}

@keyframes follow {
	0% { transform: translatex(-45px); }
	100% { transform: translatex( 60px); }
}

.game-teams{
	text-decoration: none;
}

.leaguesList{
	width:100%;
	margin:0 auto;
}


.betarena-menu{
	width: 99%;
	margin: 0 auto;
	margin-top: 10px;
	margin-bottom: 10px;
}

.game-table-container{
	width: 357px;
	margin: 0 auto;
}

.game-table-container .betarena-menu {
    margin-bottom: 15px !important;
}

.game-table-container .dayList {
    padding-bottom: 5px;
}

@media only screen and (max-device-width: 780px) {

	.game-table-container .game-media {
			height: 27px!important;

	}
    .leaguesList {
        width: 100%;
        margin: 0 auto;
        padding: 0px 12px!important;
    }

    .league-name {
		margin-left: 13px

    }

	.game-teams {
		width: 150px;
	}
	.dayList .day {
		width: 43px !important;
		height: 56px !important;
	}

		.game-teams .team {
            position: relative;
            text-overflow: ellipsis;
            max-width: 140px;
            overflow: hidden;
            white-space: nowrap;
		}

	a.table-game-tip {
		width: 32px;
		height: 20px;
		font-weight: normal;
		line-height: 20px!important;
        margin-right: 5px;
        font-size: 10px !important;
        color: #292929;
    }

    .game-teams {
        padding-left: 5px;
    }


	.game-table-container .dayList {
		padding: 10px;
	}

    .game-teams .team {
        margin-top: 2px;
        margin-bottom: 2px;
    }

	.game-col-1 {
        padding-right: 6px!important;
    }

    .game-result {
        margin-left: 0px!important;
        width: 26px !important;
    }

 

    .league-body {
        margin-bottom: 0px;
        padding-bottom: 0px;
        padding-top: 0px;
    }

    .league:not(:first-child) {
        margin-top: 0px;
    }

    .lnk-book img.img-book {
        height: 20px;
        width: 20px;
    }

	.game-media img {
		max-width: 14px;
		max-height: 14px;
		border: 1px solid #CCCCCC;
        border-radius: 16px;
        padding: 3px;
    }

    .game-table-container .game-media {
        margin-right: 0px!important;
    }

    .game-book {
        width: 25px;
    }

    .result {
        height: 17px;
    }

	.league {
        padding-bottom: 7px;
    }

    .game-table-container .game-media {
        width: 21px !important;
    }

    .result {
        margin-bottom: 2px!important;
        margin-top: 1px!important;
    }
}

.game-table-container .day.sel div:nth-child(2) {
    color: white !important;
}



.game-time.finished{
	color: #8C8C8C !important;
}


.theme-dark .game-time.finished{
	color: #999999 !important;
}



.blink {
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}


.blinker{
color:red;	
}

.theme-dark .blinker{
color:#ff5959;	
}


#seo-live-scores-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

</style>


	