// ~~~~~~~~~~~~~~~~~~
// redis/index.ts
// - adapted to GitHub Actions SECRETS
// - adpated to Heroku ENV-VARIABLES
// ~~~~~~~~~~~~~~~~~~

import Redis from "ioredis";

// [ℹ] declare the REDIS connection URL;
const connectionString = import.meta.env.VITE_REDIS_HOST.toString()

// [ℹ] return EXPORT of RADIS instance;
export default connectionString 
  ? new Redis({
      host: import.meta.env.VITE_REDIS_HOST,
      port: parseInt(import.meta.env.VITE_REDIS_PORT),
      password: import.meta.env.VITE_REDIS_PASS,
      db: parseInt(import.meta.env.VITE_REDIS_CACHE_DB)
    })
  : new Redis();