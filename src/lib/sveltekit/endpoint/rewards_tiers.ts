import { _GraphQL } from "@betarena/scores-lib/dist/classes/_graphql.js";
import {
  TableBtaRewardsTiersQuery0,
  TableBtaRewardsTiersQuery1,
} from "@betarena/scores-lib/dist/graphql/v8/table.bta.rewards_tiers.js";
import type {
  ITableBtaRewardsTiersQuery1Var,
  ITableBtaRewardsTiersQuery1Out,
  ITableBtaRewardsTiersQuery0Var,
  ITableBtaRewardsTiersQuery0Out,
} from "@betarena/scores-lib/dist/graphql/v8/table.bta.rewards_tiers.js";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GetRewardsTiers: RequestHandler = async ({ request, url }) => {
  const id = url.searchParams.get("id");
  if (id) {
    const data = await new _GraphQL().wrapQuery<
      ITableBtaRewardsTiersQuery0Var,
      ITableBtaRewardsTiersQuery0Out
    >(TableBtaRewardsTiersQuery0, { listId: [Number(id)] });
    return json({ rewards_tiers: data[0].bta_reward_tiers });
  } else {
    const data = await new _GraphQL().wrapQuery<
      ITableBtaRewardsTiersQuery1Var,
      ITableBtaRewardsTiersQuery1Out
    >(TableBtaRewardsTiersQuery1, {});
    return json({ rewards_tiers: data[0].bta_reward_tiers });
  }
};
