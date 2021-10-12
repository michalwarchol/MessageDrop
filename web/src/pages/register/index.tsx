import React from "react";
import { Formik, Form } from "formik";
import NextLink from 'next/link';
import Wrapper from "../../components/Wrapper/Wrapper";
import styles from "./register.module.scss";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import { useRegisterMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";

const Register: React.FC = () => {

  const [register, {loading}] = useRegisterMutation();
  const router = useRouter();

  return (
    <div className={styles.register}>
      <Wrapper size="sm">
        <div className={styles.formContainer}>
          <Formik
            initialValues={{ name: "", password: "", email: "", phone: "", repeatpassword: "" }}
            onSubmit={async (values, {setErrors}) => {

              if(values.password != values.repeatpassword){
                setErrors({
                  repeatpassword: "Repeated password doesn't match"
                })
                return;
              }
              
              const response = await register({variables: {
                name: values.name,
                email: values.email,
                phone: values.phone,
                password: values.password
              }})

              if(response.data?.register.errors){
                setErrors(toErrorMap(response.data.register.errors));
              }else if(response.data?.register.user){
                router.push("/home");
              }

              console.log(response);
            }}
          >
            {() => (
              <Form className={styles.formikForm}>
                <h1>Sign Up</h1>
                <h5>It's quick and easy</h5>
                <InputField
                  name="name"
                  label="name"
                  autoComplete="off"
                  placeholder="name"
                  type="text"
                />
                <InputField
                  name="email"
                  label="email"
                  autoComplete="off"
                  placeholder="email"
                  type="email"
                />
                <InputField
                  name="phone"
                  label="phone"
                  autoComplete="off"
                  placeholder="phone"
                  type="phone"
                />
                <InputField
                  name="password"
                  label="password"
                  autoComplete="off"
                  placeholder="password"
                  type="password"
                />
                <InputField
                  name="repeatpassword"
                  label="repeat-password"
                  autoComplete="off"
                  placeholder="repeat password"
                  type="password"
                />
                <div className={styles.buttons}>
                  <Button text="Sign Up" loading={loading} />
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
          <p>Michał Warchoł {new Date().getFullYear()} &copy;. All rights reserved</p>
      </div>
    </div>
  );
};
export default Register;
