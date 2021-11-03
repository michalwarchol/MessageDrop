import { ApolloConsumer } from "@apollo/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useLogoutMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Logout: NextPage = () => {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    async function log() {
      await logout();
    }
    log();
  }, []);

  return (
    <ApolloConsumer>
      {(client) => {
        client.resetStore();
        router.push("/login");
        return <div>You logged out!</div>;
      }}
    </ApolloConsumer>
  );
};
export default withApollo()(Logout);
