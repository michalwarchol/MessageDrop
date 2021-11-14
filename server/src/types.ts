import { S3 } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { Redis } from "ioredis";
import {Twilio} from "twilio";

export type Context = {
    req: Request & { session: { userId: string } }
    res: Response
    redis: Redis
    s3: S3
    twilio: Twilio
}