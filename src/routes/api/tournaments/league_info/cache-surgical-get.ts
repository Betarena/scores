// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

// [❗] critical
import Bull from 'bull';
const cacheQueueTourInfo = new Bull('cacheQueueTourInfo', 
  { 
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    }
  });

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get (req, res): Promise < any > {

  const jobId: string = req.url['searchParams'].get('jobId');
  const jobW = await cacheQueueTourInfo.getJob(jobId);

  if (jobW === null) {

    // [ℹ] ALT
    // res.status(404).end();
    
    return {
      status: 404,
      body: {
        msg: null
      }
    }
  } else {
    
    const state = await jobW.getState();
    const progress = jobW.progress;
    const attemptsMade = jobW.attemptsMade;
    const processedOn = jobW.processedOn;
    const finishedOn = jobW.finishedOn;
    const reason = jobW.failedReason;
    const result = jobW.returnvalue;

    // [ℹ] ALT
    // res.json({ jobId, state, progress, reason });

    return {
        status: 200,
        body: { 
          job_id: jobId,
          state: state,
          attemptsMade: attemptsMade,
          processedOn: processedOn,
          finishedOn: finishedOn,
          progress: progress,
          reason: reason,
          result: result
        }
      }
    }
} 