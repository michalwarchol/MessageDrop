import { useRouter } from "next/router";
import { useEffect } from "react";
import { useIsChatMemberQuery } from "../generated/graphql";

export const useIsChatMember = (roomId: string) => {
    const {data, loading} = useIsChatMemberQuery({variables: {roomId}});
    const router = useRouter();
    useEffect(()=>{
        if(!data?.isChatMember && !loading){
            router.back();
        }
    }, [data, loading])
}