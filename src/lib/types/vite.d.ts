/// <reference types="vite/client" />

interface ImportMetaEnv
{
  /**
   * @description
   * 📝 Logs Master / Admin override
   */
  readonly VITE_PROD_LOGS?: string | undefined;

  /**
   * @description
   * 📝 Hasura GraphQL `url`
   */
  readonly VITE_HASURA_DB_URL?: string | undefined;
  /**
   * @description
   * 📝 Hasura WebSocket `url`
   */
  readonly VITE_HASURA_DB_WSS?: string | undefined;
  /**
   * @description
   * 📝 Hasura Database Access Token
   */
  readonly VITE_HASURA_DB_TOKEN?: string | undefined;

  /**
   * @description
   * 📝 Firebase API Key for access to `Firebase Services`
   */
  readonly VITE_FIREBASE_DB_API_KEY?: string | undefined;
  /**
   * @description
   * 📝 Firebase Authentication Domain
   */
  readonly VITE_FIREBASE_DB_AUTH_DOMAIN?: string | undefined;
  /**
   * @description
   * 📝 Firebase Project Name
   */
  readonly VITE_FIREBASE_DB_PROJECT_ID?: string | undefined;
  /**
   * @description
   * 📝 Firebase Project `url`
   */
  readonly VITE_FIREBASE_DB_DATABASE_URL?: string | undefined;
  /**
   * @description
   * 📝 Firebase Storage Bucket
   */
  readonly VITE_FIREBASE_DB_STORAGE_BUCKET?: string | undefined;
  /**
   * @description
   * 📝 Firebase Functions Host / Origin
   */
  readonly VITE_FIREBASE_FUNCTIONS_ORIGIN?: string | undefined;
  /**
   * @description
   * 📝 Firebase Functions URL [1]
   */
  readonly VITE_DISCORD_OAUTH_URL?: string | undefined;
  /**
   * @description
   * 📝 Firebase Functions URL [1]
   */
  readonly VITE_FIREBASE_FUNCTIONS_F_0?: string | undefined;
  /**
   * @description
   * 📝 Firebase Functions URL [2]
   */
  readonly VITE_FIREBASE_FUNCTIONS_F_1?: string | undefined;

  /**
   * @description
   * 📝 Redis Database Host
   */
  readonly VITE_REDIS_HOST?: string | undefined;
  /**
   * @description
   * 📝 Redis Database Port Access
   */
  readonly VITE_REDIS_PORT?: string | undefined;
  /**
   * @description
   * 📝 Redis Database Password
   */
  readonly VITE_REDIS_PASS?: string | undefined;
  /**
   * @description
   * 📝 Redis Database Number for Scores Data
   */
  readonly VITE_REDIS_CACHE_DB?: string | undefined;
  /**
   * @description
   * 📝 Redis Database Number for BullJs
   */
  readonly VITE_REDIS_BULL_DB?: string | undefined;

  /**
   * @description
   * 📝 Sentry `url`.
   */
  readonly VITE_SENTRY_URL?: string | undefined;
  /**
   * @description
   * 📝 Environment for Sentry (duplicate)
   */
  readonly VITE_SENTRY_ENVIRONMENT?: 'production' | 'development' | 'local';
  /**
   * @description
   * 📝 Environment for Sentry
   */
  readonly SENTRY_ENVIRONMENT?: 'production' | 'development' | 'local';
  /**
   * @description
   * 📝 Authentication Token for Sentry Actions
   */
  readonly SENTRY_AUTH_TOKEN?: string;
  /**
   * @description
   * 📝 action of `Sourcemap Upload` for Sentry
   */
  readonly VITE_SENTRY_UPLOAD_SOURCEMAPS?: string;

  /**
   * @description
   * 📝 `walletconnect` project env
   */
  readonly VITE_WALLETCONNECT_ID?: string

  /**
   * @description
   * 📝 `sha256_cert_fingerprints` cert for android app
   */
  readonly VITE_SHA256_CERT_FINGERPRINTS?: string;
}

interface ImportMeta
{
  readonly env: ImportMetaEnv;
}