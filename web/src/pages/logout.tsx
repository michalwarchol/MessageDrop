import { useApolloClient } from "@apollo/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useLogoutMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Logout: NextPage = () => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();

  useEffect(() => {
    async function log() {
      await logout();
      await apolloClient.resetStore();
      router.push("/login");
    }
    log();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#17181a",
      }}
    ></div>
  );
};
export default withApollo()(Logout);
