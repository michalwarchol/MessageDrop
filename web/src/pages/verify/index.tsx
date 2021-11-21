import { NextPage } from 'next'
import React, {  useEffect } from 'react'
import styles from "./verify.module.scss";
import Wrapper from '../../components/Wrapper/Wrapper';
import UserVerification from '../../components/UserVerification/UserVerification';
import { withApollo } from '../../utils/withApollo';
import { useGenerateNewCodeMutation, useMeQuery } from '../../generated/graphql';
import { withAuth } from '../../utils/withAuth';

const Verify:NextPage = () => {
    const {data, loading} = useMeQuery();
    const [generateNewCode] = useGenerateNewCodeMutation();

    useEffect(()=>{
        (async () => {
            if(data && !loading){
                await generateNewCode({variables: {phoneOrEmail: "email", email: data.me?.email}});
            }
        })()
    }, [data, loading])

    return(
        <div className={styles.verify}>
            <Wrapper size="sm">
                <div className={styles.verifyContainer}>
                    <UserVerification />
                </div>
            </Wrapper>
        </div>
    )
}
export default withApollo()(withAuth(Verify));