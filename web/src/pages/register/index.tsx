import React from "react";
import { Formik, Form } from "formik";
import NextLink from "next/link";
import Wrapper from "../../components/Wrapper/Wrapper";
import styles from "./register.module.scss";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import { useRegisterMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withApollo } from "../../utils/withApollo";

const Register: React.FC = () => {
  const [register, { loading }] = useRegisterMutation();
  const router = useRouter();

  return (
    <div className={styles.register}>
      <Wrapper size="sm">
        <div className={styles.formContainer}>
          <Formik
            initialValues={{
              name: "",
              password: "",
              email: "",
              phone: "",
              repeatpassword: "",
            }}
            onSubmit={async ({ repeatpassword, ...values }, { setErrors }) => {
              if (values.password != repeatpassword) {
                setErrors({
                  repeatpassword: "Repeated password doesn't match",
                });
                return;
              }
              const response = await register({ variables: { ...values } });

              if (response.data?.register.errors) {
                setErrors(toErrorMap(response.data.register.errors));
              } else if (response.data?.register.user) {
                router.push("/home");
              }
            }}
          >
            {() => (
              <Form className={styles.formikForm}>
                <h1>Sign Up</h1>
                <h5>It's quick and easy</h5>
                <InputField
                  name="name"
                  autoComplete="off"
                  placeholder="name"
                  type="text"
                />
                <InputField
                  name="email"
                  autoComplete="off"
                  placeholder="email"
                  type="email"
                />
                <InputField
                  name="phone"
                  autoComplete="off"
                  placeholder="phone"
                  type="phone"
                />
                <InputField
                  name="password"
                  autoComplete="off"
                  placeholder="password"
                  type="password"
                />
                <InputField
                  name="repeatpassword"
                  autoComplete="off"
                  placeholder="repeat password"
                  type="password"
                />
                <div className={styles.buttons}>
                  <Button text="Sign Up" loading={loading} className={styles.submitButton} />
                  <NextLink href="/login">
                    <p>I already have an account</p>
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
export default withApollo()(Register);
