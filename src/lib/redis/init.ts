// #region ➤ 📦 Package Imports

import Redis from 'ioredis';

// #endregion ➤ 📦 Package Imports

const connectionString = import.meta.env?.VITE_REDIS_HOST as string;

export default connectionString
	? new Redis
    (
      {
        host: import.meta.env?.VITE_REDIS_HOST as string,
        port: import.meta.env?.VITE_REDIS_PORT as number,
        password: import.meta.env?.VITE_REDIS_PASS as string,
        db: import.meta.env?.VITE_REDIS_CACHE_DB as number
	    }
    )
	: new Redis()
;
