import "dotenv-safe/config";
import "reflect-metadata";
import mongoose from "mongoose";
import express from "express";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { COOKIE_NAME, __prod__ } from "./constants";
import cors from "cors";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const main = async () => {
  await mongoose.connect(process.env.DB_URL, {
    dbName: process.env.DB_NAME,
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000"
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, //1 month
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver], validate: false }),
    context: ({req, res}) => ({
      req,
      res,
      redis
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground()
    ]
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main();
