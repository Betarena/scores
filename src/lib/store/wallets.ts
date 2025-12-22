import { auth, db_firestore } from "$lib/firebase/init";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { type Writable, writable } from "svelte/store";

type Wallet = {
  available: number;
  growthPct?: number;
  trend?: "up" | "down" | "flat";
  updatedAt?: string;
};

const pct = (change = 0, past = 0) =>
  Number((past > 0 ? (change / past) * 100 : 0).toFixed(0));

interface WalletStoreData {
  primary: Wallet;
  spending: Wallet;
  rewards: Wallet;
  loaded: boolean;
  error?: string;
}

function logUser(uid) {
  console.log("STORE USER UID: ", uid);
  console.log("FIREBASE CurrentUser UID: ", auth.currentUser?.uid);
}

const walletStore: Writable<WalletStoreData> = writable({
  primary: { available: 0 },
  spending: { available: 0 },
  rewards: { available: 0 },
  loaded: false,
});
let unsub: () => void;
async function initWalletStore(uid: string) {
  if (unsub) unsub();
  (window as any).hiddenLog = () => logUser(uid);
  const ref = doc(db_firestore, "betarena_users", uid);
  const snap = await getDoc(ref);
  const user_data = snap.data() ?? {};
  const now = new Date().toISOString();
  walletStore.set({
    primary: {
      available: Number(user_data.main_balance ?? 0),
      updatedAt: user_data.main_balance?.updatedAt || now,
    },
    spending: {
      available: Number((user_data.spending_balance ?? {}).available ?? 0),
      updatedAt: user_data.spending_balance?.updatedAt || now,
    },
    rewards: {
      available: Number((user_data.rewards_balance ?? {}).available ?? 0),
      updatedAt: user_data.rewards_balance?.updatedAt || now,
    },
    loaded: true,
  });
  unsub = onSnapshot(
    ref,
    (snap) => {
      const user_data = snap.data() ?? {};

      // PRIMARY (Main balance is a raw number for now)
      const mainAvailable = Number(user_data.main_balance ?? 0);

      // REWARDS
      const rewardsAvailable = Number((user_data.rewards_balance ?? {}).available ?? 0)

      // SPENDING
      const spending = user_data.spending_balance ?? {};
      const spendingAvailable = Number(spending.available ?? 0);
      const spendingChange = Number(spending.change ?? 0);
      const spendingPast = Number(spending.past_balance ?? 0);
      const now = new Date().toISOString();
      walletStore.set({
        primary: {
          available: mainAvailable,
          updatedAt: now,
          growthPct: pct(
            mainAvailable - (user_data.main_balance ?? 0),
            user_data.main_balance ?? 0
          ),
        },
        spending: {
          available: spendingAvailable,
          growthPct: pct(spendingChange, spendingPast),
          updatedAt: spending?.updatedAt || now,
        },
        rewards: { available: rewardsAvailable, updatedAt: user_data.rewards_balance?.updatedAt || now }, // frozen for now
        loaded: true,
      });
    },
    (err) => {
      walletStore.set({
        primary: { available: 0, updatedAt: now },
        spending: { available: 0, updatedAt: now },
        rewards: { available: 0, updatedAt: now },
        error: err.message,
        loaded: true,
      });
    }
  );
}

export { initWalletStore, walletStore };

