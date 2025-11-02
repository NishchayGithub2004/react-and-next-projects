import { Redis } from "@upstash/redis"; // import Redis client from upstash package to interact with cloud-based Redis database
import config from "@/lib/config"; // import centralized configuration to access environment variables for Redis connection

const redis = new Redis({ // create a new Redis client instance for caching and fast key-value data access
  url: config.env.upstash.redisUrl, // specify Redis database endpoint URL from environment configuration to connect to correct instance
  token: config.env.upstash.redisToken, // provide authentication token from config to securely authorize Redis operations
});

export default redis; // export configured Redis client as default for reuse across application modules
