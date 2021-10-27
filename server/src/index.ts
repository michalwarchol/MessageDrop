import "dotenv-safe/config";
import "reflect-metadata";
import mongoose from "mongoose";
import express from "express";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { buildSchema } from "type-graphql";
import { S3 } from "@aws-sdk/client-s3";
import { UserResolver } from "./resolvers/UserResolver";
import { COOKIE_NAME, __prod__ } from "./constants";
import cors from "cors";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { ChatRoomResolver } from "./resolvers/ChatRoomResolver";
import { MessageResolver } from "./resolvers/MessageResolver";

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
      origin: "http://localhost:3000",
    })
  );

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
        secure: __prod__,
      },
    })
  );

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 2 }));
  app.use(express.json({limit: '100mb'}));

  const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const schema = await buildSchema({
    resolvers: [UserResolver, ChatRoomResolver, MessageResolver],
    validate: false,
  })

  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      s3,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
      }],
  });

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: ()=> ({s3})
  },{
    server: httpServer,
    path: apolloServer.graphqlPath,
  })

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  httpServer.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err.message);
});
