import "dotenv-safe/config";
import "reflect-metadata";
import mongoose from "mongoose";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";

const main = async () => {
  await mongoose.connect("mongodb://localhost:27017", {dbName: process.env.DB_NAME});

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver], validate: false }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main();
