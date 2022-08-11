const throng = require('throng');
const Queue = require("bull");

// Connect to a local redis instance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const workers = process.env.WEB_CONCURRENCY || 2;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 50;

const settings = {
  stalledInterval: 300000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {

  // [ℹ] connect to the named work queue
  const cacheQueueLeaguesList = new Queue('work', 'cacheQueueLeaguesList', 
    { 
      redis: { 
        port: process.env.VITE_REDIS_BULL_ENDPOINT, 
        host: process.env.VITE_REDIS_BULL_HOST, 
        password: process.env.VITE_REDIS_BULL_PASS, 
        tls: {}
      }
    }, 
    settings
  );
  const cacheTarget = "REDIS CACHE | league_list"
  let logs = []

  // [ℹ] Example
  /*
    workQueue.process(maxJobsPerWorker, async (job) => {
      // This is an example job that just slowly reports on progress
      // while doing no work. Replace this with your own job logic.
      let progress = 0;

      // throw an error 5% of the time
      if (Math.random() < 0.05) {
        throw new Error("This job failed!")
      }

      while (progress < 100) {
        await sleep(50);
        progress += 1;
        job.progress(progress)
      }

      // A job can return values that will be stored in Redis as JSON
      // This return value is unused in this demo application.
      return { value: "This will be stored" };
    });
  */

  cacheQueueLeaguesList.process (async function (job, done) {
    // console.log(job.data.argumentList);
    // console.log(job.data)

    logs = []
    logs.push(`${job.id}`);

    /* 
    do stuff
    */

    const t0 = performance.now();

    // [ℹ] get KEY platform translations
    const response = await initGrapQLClient().request(GET_HREFLANG_DATA)

    // [ℹ] get-all-exisitng-lang-translations;
    const langArray: string [] = response.scores_hreflang_dev
      .filter(a => a.link)         /* filter for NOT "null" */
      .map(a => a.link)            /* map each LANG */ 

    // [ℹ] push "EN"
    langArray.push('en')

    await leagueListGeoDataGeneration()
    await leagueListLangDataGeneration(langArray)

    const t1 = performance.now();

    if (dev) console.log(`
      ${cacheTarget} updated!
      completed in: ${(t1 - t0) / 1000} sec
    `)

    logs.push(`${cacheTarget} updated!`);
    logs.push(`completed in: ${(t1 - t0) / 1000} sec`);

    done(null, { logs: logs });

  }).catch(err => {
    console.log(err)
  });

}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });