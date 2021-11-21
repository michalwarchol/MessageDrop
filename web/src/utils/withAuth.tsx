import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMeQuery } from "../generated/graphql";

export const withAuth = (WrappedComponent: NextPage<unknown, unknown>) => {
  const hoc = (props: any) => {
    const router = useRouter();
    const { data, loading } = useMeQuery();


    const [verified, setVerified] = useState(false);

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
      
      if(router.pathname != "/verify" && !loading && data?.me?.verified){
        setVerified(true);
      }
      if(router.pathname == "/verify" && !loading && data?.me){
        setVerified(true);
      }

    }, [loading, data, router]);

    return verified ? <WrappedComponent {...props} /> : null; 
  };

  hoc.getInitialProps = async ({ query }: NextPageContext) =>{
    return {
      id: query.id as string,
    };
  }

  return hoc;
};