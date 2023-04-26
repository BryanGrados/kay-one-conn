import { createClient } from "redis";

const url = process.env.REDIS_URL;

const redisClient = createClient({ url });

redisClient.on("error", (err) => console.log("Redis Cliente Error", err));

redisClient.connect();

export default redisClient;
