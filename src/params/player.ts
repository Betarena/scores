/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  // NOTE: similar to the fixture's route,
  // NOTE: thus using hard-coded values,
  // NOTE: to clearly identify the player's route
  // DOC: https://discord.com/channels/457912077277855764/1023340103071965194/threads/1086245553203068998
  const regexList = [
    // EN
    /player/,
    // ??
    /giocatore/,
    // ES
    /jugador/,
    // FR
    /joueur/,
    // PT/BR
    /jogador/,
    // ??
    /jucator/,
    // ??
    /spelare/
  ];
  const isMatch = regexList.some(rx => rx.test(param));
	return isMatch;
}