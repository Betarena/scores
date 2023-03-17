/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  // NOTE: similar to the fixture's route,
  // NOTE: thus using hard-coded values,
  // NOTE: to clearly identify the player's route
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