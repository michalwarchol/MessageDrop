import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useIsChatMemberQuery, useMeQuery } from "../generated/graphql";

export const withAuth = (WrappedComponent: NextPage<unknown, unknown>) => {
  const EmptyComponent = () => (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#17181a",
      }}
    ></div>
  );

  const hoc = (props: any) => {
    const router = useRouter();
    const { data, loading } = useMeQuery();

    const [verified, setVerified] = useState(false);
    const { data: isChatMember, loading: loadingIsChatMember } = useIsChatMemberQuery({
      variables: { roomId: props.id },
      skip: !props.id,
      fetchPolicy: "network-only",
    });

    useEffect(() => {
      if (!loading && !data?.me) {
        router.query.id = props.id;
        router.replace("/login?next=" + router.asPath);
        return;
      }

      if (router.pathname != "/verify") {
        if (!loading && !data?.me?.verified) {
          router.query.id = props.id;

          router.replace("/verify?next=" + router.asPath);
          return;
        }
      }

      if (props.id && !isChatMember?.isChatMember && !loadingIsChatMember) {
        router.push("/home");
        return;
      }

      if (router.pathname != "/verify" && !loading && !loadingIsChatMember && data?.me?.verified) {
        setVerified(true);
      }
      if (router.pathname == "/verify" && !loading && !loadingIsChatMember && data?.me) {
        setVerified(true);
      }
    }, [loading, data, router, isChatMember, loadingIsChatMember]);

    return verified ? <WrappedComponent {...props} /> : <EmptyComponent />;
  };

  hoc.getInitialProps = async ({ query }: NextPageContext) => {
    return {
      id: query.id as string,
    };
  };

  return hoc;
};
