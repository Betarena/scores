// ~~~~~~~~~~~~~~~~~~
// redis/index.ts
// - adapted to GitHub Actions SECRETS
// - adpated to Heroku ENV-VARIABLES
// ~~~~~~~~~~~~~~~~~~

import Redis from 'ioredis';

const connectionString = import.meta.env?.VITE_REDIS_HOST as string;

export default connectionString
	? new Redis({
			host: import.meta.env?.VITE_REDIS_HOST as string,
			port: import.meta.env?.VITE_REDIS_PORT as number,
			password: import.meta.env?.VITE_REDIS_PASS as string,
			db: import.meta.env?.VITE_REDIS_CACHE_DB as number
	  })
	: new Redis();