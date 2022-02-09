import React from "react";
import { Formik, Form } from "formik";
import NextLink from "next/link";
import Wrapper from "../../components/Wrapper/Wrapper";
import styles from "./login.module.scss";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { MeDocument, MeQuery, useLoginMutation } from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";

const Login: React.FC = () => {
  const [login, { loading }] = useLoginMutation();
  const router = useRouter();

  return (
    <div className={styles.login}>
      <Wrapper size="sm">
        <div className={styles.formContainer}>
          <Formik
            initialValues={{ password: "", email: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await login({
                variables: {
                  email: values.email,
                  password: values.password,
                },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.login?.user || null,
                    },
                  });
                },
              });

              if (response.data?.login?.errors) {
                setErrors(toErrorMap(response.data.login.errors));
              } else if (response.data?.login?.user) {
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
                  autoComplete="off"
                  placeholder="email"
                  type="email"
                />
                <InputField
                  name="password"
                  autoComplete="off"
                  placeholder="password"
                  type="password"
                />
                <div className={styles.buttons}>
                  <Button
                    text="Log in"
                    loading={loading}
                    className={styles.submitButton}
                  />
                  <p className={styles.credentials}>You can use these credentials:</p>
                  <p className={styles.credentials}>
                    email: <span>guest@abc.abc</span> password:{" "}
                    <span>guest123</span>
                  </p>
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
        <p>
          Michał Warchoł {new Date().getFullYear()} &copy;. All rights reserved
        </p>
      </div>
    </div>
  );
};
export default withApollo()(Login);
