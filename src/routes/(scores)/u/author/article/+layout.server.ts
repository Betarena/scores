import type { AuthorsAuthorsMain } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import type { BtaRewardTiersMain } from '@betarena/scores-lib/types/v8/_HASURA-1_';

export const load = (({ locals, fetch }) =>
{
  const
    {
      uid
    } = locals
  ;

  async function getSportsTacks(uid?: string)
  {
    if (!uid) return [];
    const response = await fetch(`/api/data/author/sportstack?user=${uid}`);
    const data = await response.json() as { sportstacks: AuthorsAuthorsMain[]; };
    return data.sportstacks;
  }
  async function getTiers()
  {
    try {

      const response = await fetch('/api/data/rewards_tiers');
      const data = await response.json() as { rewards_tiers:BtaRewardTiersMain[] };
      return data.rewards_tiers;
    } catch (error) {
      console.error('Error fetching reward tiers:', error);
      return { error: error.message}
    }
  }

  return {
    sportstacks: getSportsTacks(uid),
    rewards_tiers: getTiers()
  };
})
