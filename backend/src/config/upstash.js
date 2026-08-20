import { Redis } from '@upstash/redis'
import {Ratelimit} from '@upstash/ratelimit';


import "dotenv/config.js";

const ratelimit = new Ratelimit({
    redis : Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3,"10 s"),
});

export default ratelimit;