import { Ratelimit } from "@upstash/ratelimit"; // import Ratelimit class from upstash package to manage API rate limiting
import redis from "@/database/redis"; // import preconfigured Redis client for storing rate limit counters

const ratelimit = new Ratelimit({ // create a new rate limiter instance to control number of allowed requests per user
  redis, // use Redis as backend storage to persist request counts and enforce limits across distributed servers
  limiter: Ratelimit.fixedWindow(5, "1m"), // apply fixed window strategy allowing 5 requests per 1 minute window per user or IP
  analytics: true, // enable analytics collection to monitor usage patterns and rate limit performance
  prefix: "@upstash/ratelimit", // set key prefix for Redis entries to distinguish rate limit data from other stored values
});

export default ratelimit; // export configured ratelimit instance for use in API routes to throttle incoming requests
