import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL! || "",
  token: process.env.UPSTASH_REDIS_TOKEN! || "",
});

export const APILLION_KEY_SECRET = process.env.APILLION_KEY_SECRET!;
export const APILLION_API_KEY = process.env.APILLION_API_KEY!;

export const AUTH_SECRET = process.env.AUTH_SECRET!;
