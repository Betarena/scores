import { dev } from '$app/environment'
import { error, json } from '@sveltejs/kit';

import Bull from 'bull';

/** 
 * @type {import('@sveltejs/kit').RequestHandler} 
*/
export async function GET (
  req: { 
    url: {     
      [x: string]: { 
        get: (arg0: string) => string; 
      }; 
    }; 
  }, 
  res: any
): Promise < unknown > {

  const jobQueueName: string = req.url['searchParams'].get('jobQueueName');
  const jobId: string = req.url['searchParams'].get('jobId');
  const jobAction: string = req.url['searchParams'].get('action');
  const jobStatus: string = req.url['searchParams'].get('status');

  const cacheQueueJob = new Bull(jobQueueName, 
  {
    redis: { 
      port: import.meta.env.VITE_REDIS_BULL_ENDPOINT.toString(), 
      host: import.meta.env.VITE_REDIS_BULL_HOST.toString(), 
      password: import.meta.env.VITE_REDIS_BULL_PASS.toString(), 
      tls: {}
    }
  });

  // NOTE: Queue

  // [ℹ] execute "complete:clean" queue action
  // [ℹ] from over "24-hours-ago"
  if (jobAction == "clean") {
    const cleanNum = await cacheQueueJob.clean(86400000)
    return json (
      {
        queue: jobQueueName,
        numCleaned: cleanNum.length,
        msg: "Queue Cleaned!"
      }
    ) 
  }
  // [ℹ] execute "obliterate" queue action
  // NOTE: destroys queue entirely
  if (jobAction == "obliterate") {
    await cacheQueueJob.obliterate({ force: true })
    return json (
      {
        queue: jobQueueName,
        msg: "Queue Deleted!"
      }
    ) 
  }

  // NOTE: Job

  const jobW = await cacheQueueJob.getJob(jobId);

  // [ℹ] error
  if (jobW === null) {
    // [ℹ] ALT
    // res.status(404).end();
    // [ℹ] ALT 2
    return json (
      {
        queue: jobQueueName,
        jobId: jobId,
        msg: `Target job does not exist!`,
      }
    )
  }
  // [ℹ] execute "delete" job action
  else if (jobAction == "delete") {
    await jobW.remove()
    // await jobW.discard()
    const state = await jobW.getState();
    return json (
      {
        job: jobId,
        queue: jobQueueName,
        state: state,
        msg: "Job Removed!"
      }
    ) 
  }
  // [ℹ] simple job info GET
  else {
    // [ℹ] ALT
    // res.json({ jobId, state, progress, reason });
    const state = await jobW.getState();
    const progress = jobW.progress;
    const attemptsMade = jobW.attemptsMade;
    const processedOn = jobW.processedOn;
    const finishedOn = jobW.finishedOn;
    const reason = jobW.failedReason;
    const result = jobW.returnvalue;
    const failures = await cacheQueueJob.getFailedCount();
    const failures_ids = await cacheQueueJob.getFailed();
    const completed = await cacheQueueJob.getCompletedCount();
    const active = await cacheQueueJob.getActiveCount();
    const current = await cacheQueueJob.getActive();
    const waiting = await cacheQueueJob.getWaitingCount();
    // [ℹ] ALT 2
    return json (
      {
        job: {
          job_id:         jobId,
          state:          state,
          attemptsMade:   attemptsMade,
          processedOn:    processedOn,
          finishedOn:     finishedOn,
          progress:       progress,
          reason:         reason,
          result:         result
        },
        cache_general: {
          failures:       failures,
          failures_ids:   failures_ids,    
          completed:      completed,
          current_ids:    current,
          active:         active,
          waiting:        waiting
        }
      }
    )
  }
} 