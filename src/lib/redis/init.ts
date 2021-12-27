// ~~~~~~~~~~~~~~~~~~
// redis/index.ts
// - adapted to GitHub Actions SECRETS
// - adpated to Heroku ENV-VARIABLES
// ~~~~~~~~~~~~~~~~~~

import Redis from "ioredis";

// ... declare the REDIS connection URL;
const connectionString = import.meta.env.VITE_REDIS_CONNECTION_URL.toString()

// ... return EXPORT of RADIS instance;
export default connectionString ? new Redis(connectionString) : new Redis();