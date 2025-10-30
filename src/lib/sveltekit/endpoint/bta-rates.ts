import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import { TableBtaTokenQuoteLatestQuery0 } from '@betarena/scores-lib/dist/graphql/v8/table.bta.token_quote_latest.js';
import type { ITableBtaTokenQuoteLatestQuery0Var, ITableBtaTokenQuoteLatestQuery0Out } from '@betarena/scores-lib/dist/graphql/v8/table.bta.token_quote_latest.js';
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GetBtaRates: RequestHandler = async () => {

     const data = await new _GraphQL().wrapQuery
      <
        ITableBtaTokenQuoteLatestQuery0Var
        , ITableBtaTokenQuoteLatestQuery0Out
      >
      (
        TableBtaTokenQuoteLatestQuery0
        , {
        }
  );
    return json({ bta_rates: data[0].bta_token_quote_latest?.[0] });
  }