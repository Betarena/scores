import { get } from "$lib/api/utils.js";
import session from "$lib/store/session.js";

let timer: NodeJS.Timeout;

export async function getRates(store: typeof session)
{
    const res = await get("/api/data/bta-rates") as {
      data?:      { [key: string]: any };
      symbol?:    string;
      timestamp?: string;
      [property: string]: any;
    }
    if(res) {
      store.update(s => ({ ...s, btaUsdRate: res.bta_rates?.data.price_in.usd || 0 }));
      return
    }
    timer = setTimeout(() => {
      getRates(store);
    }, 60000);
  }