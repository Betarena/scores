// [ℹ] import $app `modules`
import { dev } from '$app/env'
// [ℹ] import necessary LIBRARIES & MODULES;
import redis from "$lib/redis/init"
import { initGrapQLClient } from '$lib/graphql/init_graphQL';

// [❗] critical
import Bull from 'bull';
const cacheQueueTourStand = new Bull('cacheQueueTourStand', import.meta.env.VITE_REDIS_CONNECTION_URL.toString())

// [ℹ] global variable
const cacheTarget = "REDIS CACHE | tournament standings surgical"

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function get (req, res): Promise < any > {

  const jobId: string = req.url['searchParams'].get('jobId');
  const jobW = await cacheQueueTourStand.getJob(jobId);

  if (jobW === null) {
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
    const reason = jobW.failedReason;
    // res.json({ jobId, state, progress, reason });
    return {
        status: 200,
        body: { 
          job_id: jobId,
          state: state,
          progress: progress,
          reason: reason
        }
      }
    }
} 