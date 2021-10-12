import React from "react";
import { Formik, Form } from "formik";
import NextLink from 'next/link';
import Wrapper from "../../components/Wrapper/Wrapper";
import styles from "./login.module.scss";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { useLoginMutation } from "../../generated/graphql";

const login: React.FC = () => {

  const [login, {loading}] = useLoginMutation();
  const router = useRouter();

  return (
    <div className={styles.login}>
      <Wrapper size="sm">
        <div className={styles.formContainer}>
          <Formik
            initialValues={{password: "", email: ""}}
            onSubmit={async (values, {setErrors}) => {        
              const response = await login({variables: {
                email: values.email,
                password: values.password
              }})

              if(response.data?.login?.errors){
                setErrors(toErrorMap(response.data.login.errors));
              }else if(response.data?.login?.user){
                router.push("/home");
              }
            }}
          >
            {() => (
              <Form className={styles.formikForm}>
                <h1>Log In</h1>
                <h5>Welcome back</h5>
                <InputField
                  name="email"
                  label="email"
                  autoComplete="off"
                  placeholder="email"
                  type="email"
                />
                <InputField
                  name="password"
                  label="password"
                  autoComplete="off"
                  placeholder="password"
                  type="password"
                />
                <div className={styles.buttons}>
                  <Button text="Log in" loading={loading} />
                  <NextLink href="/register">
                    <p>I don't have an account</p>
                  </NextLink>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Wrapper>
      <div className={styles.footer}>
          <p>Michał Warchoł {new Date().getFullYear()} &copy;. All rights reserved</p>
      </div>
    </div>
  );
};
export default login;
