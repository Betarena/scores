/// <reference types="vite/client" />

interface ImportMetaEnv
{
  /** @description Scores Logs Master / Admin override */
  VITE_PROD_LOGS?: string | undefined;

  /** @description Target `Hasura` GraphQL `url` */
  VITE_HASURA_DB_URL?: string | undefined;
  /** @description Target `Hasura` WebSocket `url` */
  VITE_HASURA_DB_WSS?: string | undefined;
  /** @description Target `Hasura` Database Access Token */
  VITE_HASURA_DB_TOKEN?: string | undefined;

  /** @description Target `Firebase` API Key for access to `Firebase Services` */
  readonly VITE_FIREBASE_DB_API_KEY?: string | undefined;
  /** @description Target `Firebase` Authentication Domain */
  readonly VITE_FIREBASE_DB_AUTH_DOMAIN?: string | undefined;
  /** @description Target `Firebase` Project Name */
  readonly VITE_FIREBASE_DB_PROJECT_ID?: string | undefined;
  /** @description Target `Firebase` Project `url` */
  readonly VITE_FIREBASE_DB_DATABASE_URL?: string | undefined;
  /** @description Target `Firebase` Storage Bucket */
  readonly VITE_FIREBASE_DB_STORAGE_BUCKET?: string | undefined;
  /** @description Target `Firebase` Functions Host / Origin */
  VITE_FIREBASE_FUNCTIONS_ORIGIN?: string | undefined;
  /** @description Target `Firebase` Functions URL [1] */
  readonly VITE_DISCORD_OAUTH_URL?: string | undefined;
  /** @description Target `Firebase` Functions URL [1] */
  readonly VITE_FIREBASE_FUNCTIONS_F_0?: string | undefined;
  /** @description Target `Firebase` Functions URL [2] */
  readonly VITE_FIREBASE_FUNCTIONS_F_1?: string | undefined;

  /** @description Target `Redis` Database Host */
  readonly VITE_REDIS_HOST?: string | undefined;
  /** @description Target `Redis` Database Port Access */
  readonly VITE_REDIS_PORT?: string | undefined;
  /** @description Target `Redis` Database Password */
  readonly VITE_REDIS_PASS?: string | undefined;
  /** @description Target `Redis` Database Number for Scores Data */
  readonly VITE_REDIS_CACHE_DB?: string | undefined;
  /** @description Target `Redis` Database Number for BullJs */
  readonly VITE_REDIS_BULL_DB?: string | undefined;

  /** @description Target Sentry `url`. */
  readonly VITE_SENTRY_URL?: string | undefined;
  /** @description Target `Environment` for Sentry (duplicate) */
  readonly VITE_SENTRY_ENVIRONMENT?: string | undefined;
  /** @description Target `Environment` for Sentry */
  readonly SENTRY_ENVIRONMENT?: string | undefined;
  /** @description Target `Authentication Token` for Sentry Actions */
  readonly SENTRY_AUTH_TOKEN?: string;
  /** @description Target action of `Sourcemap Upload` for Sentry */
  readonly SENTRY_UPLOAD_SOURCEMAPS?: string;
}

interface ImportMeta
{
  readonly env: ImportMetaEnv;
}