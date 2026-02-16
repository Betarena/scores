/// <reference types="vite/client" />

interface ImportMetaEnv
{
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 💠 │ MISCELLENOUS                                                                │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯
  /**
   * @description
   * 📝 CONFIGURATION
   *    Console Logs Toggle
   */
  readonly VITE_PROD_LOGS?: 'false' | 'true' | undefined;
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🔳 │ HASURA                                                                      │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯
  /**
   * @description
   * 📝 SECRET
   *    Hasura GraphQL `url`
   */
  readonly VITE_HASURA_DB_URL?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Hasura WebSocket `url`
   */
  readonly VITE_HASURA_DB_WSS?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Hasura Database Access Token
   */
  readonly VITE_HASURA_DB_TOKEN?: string | undefined;
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🟨 │ FIREBASE                                                                    │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯
  /**
   * @description
   * 📝 SECRET
   *    Firebase API Key for access to `Firebase Services`
   */
  readonly VITE_FIREBASE_DB_API_KEY?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Firebase Authentication Domain
   */
  readonly VITE_FIREBASE_DB_AUTH_DOMAIN?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Firebase Project Name
   */
  readonly VITE_FIREBASE_DB_PROJECT_ID?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Firebase Project `url`
   */
  readonly VITE_FIREBASE_DB_DATABASE_URL?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Firebase Storage Bucket
   */
  readonly VITE_FIREBASE_DB_STORAGE_BUCKET?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Firebase Functions Host / Origin
   */
  readonly VITE_FIREBASE_FUNCTIONS_ORIGIN?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Firebase Functions URL [1]
   */
  readonly VITE_DISCORD_OAUTH_URL?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Firebase Functions URL [1]
   */
  readonly VITE_FIREBASE_FUNCTIONS_F_0?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Firebase Functions URL [2]
   */
  readonly VITE_FIREBASE_FUNCTIONS_F_1?: string | undefined;
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🟥 │ REDIS                                                                       │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯
  /**
   * @description
   * 📝 SECRET
   *    Redis Database Host
   */
  readonly VITE_REDIS_HOST?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Redis Database Port Access
   */
  readonly VITE_REDIS_PORT?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Redis Database Password
   */
  readonly VITE_REDIS_PASS?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Redis Database Number for Scores Data
   */
  readonly VITE_REDIS_CACHE_DB?: string | undefined;
  /**
   * @description
   * 📝 SECRET
   *    Redis Database Number for BullJs
   */
  readonly VITE_REDIS_BULL_DB?: string | undefined;
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🟪 │ SENTRY                                                                      │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯
  /**
   * @description
   * 📝 CONFIGURATION
   *    Sentry `url`.
   */
  readonly VITE_SENTRY_URL?: string | undefined;
  /**
   * @description
   * 📝 CONFIGURATION
   *    Environment for Sentry (duplicate)
   */
  readonly VITE_SENTRY_ENVIRONMENT?: 'production' | 'development' | 'local';
  /**
   * @description
   * 📝 CONFIGURATION
   *    Environment for Sentry
   */
  readonly SENTRY_ENVIRONMENT?: 'production' | 'development' | 'local';
  /**
   * @description
   * 📝 CONFIGURATION
   *    Authentication Token for Sentry Actions
   */
  readonly SENTRY_AUTH_TOKEN?: string;
  /**
   * @description
   * 📝 CONFIGURATION
   *    action of `Sourcemap Upload` for Sentry
   */
  readonly VITE_SENTRY_UPLOAD_SOURCEMAPS?: string;
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🔳 │ WALLETCONNECT                                                               │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯
  /**
   * @description
   * 📝 SECRET
   *    WalletConnect project env
   */
  readonly VITE_WALLETCONNECT_ID?: string
  // ╭──────────────────────────────────────────────────────────────────────────────────╮
  // │ 🔳 │ CLOUDFLARE                                                                  │
  // ╰──────────────────────────────────────────────────────────────────────────────────╯
  /**
   * @description
   * 📝 SECRET
   *    Shared secret for Worker /__purge endpoint
   */
  readonly VITE_CF_PURGE_SECRET?: string | undefined;

}

interface ImportMeta
{
  readonly env: ImportMetaEnv;
}