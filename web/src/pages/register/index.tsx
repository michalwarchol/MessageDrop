import React, { useState } from "react";
import { Formik, Form } from "formik";
import NextLink from "next/link";
import Wrapper from "../../components/Wrapper/Wrapper";
import styles from "./register.module.scss";
import InputField from "../../components/InputField/InputField";
import PhoneField from "../../components/PhoneInput/PhoneInput";
import Button from "../../components/Button/Button";
import { FieldError, MeDocument, MeQuery, useRegisterMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withApollo } from "../../utils/withApollo";
import { E164Number } from "libphonenumber-js/types";
import { isValidPhoneNumber } from "libphonenumber-js/min";

const Register: React.FC = () => {
  const [register, { loading }] = useRegisterMutation();
  const router = useRouter();

  const [phone, setPhone] = useState<E164Number | undefined>(undefined);
  const [phoneNumberError, setPhoneNumberError] = useState<
    FieldError | undefined
  >(undefined);

  return (
    <div className={styles.register}>
      <Wrapper size="sm">
        <div className={styles.formContainer}>
          <Formik
            initialValues={{
              name: "",
              password: "",
              email: "",
              repeatpassword: "",
            }}
            onSubmit={async ({ repeatpassword, ...values }, { setErrors }) => {
              setPhoneNumberError(undefined);
              if (!phone || !isValidPhoneNumber(phone as string)) {
                setPhoneNumberError({
                  field: "phoneNumber",
                  message: "This phone number is not valid",
                });
                return;
              }

              if (values.password != repeatpassword) {
                setErrors({
                  repeatpassword: "Repeated password doesn't match",
                });
                return;
              }
              const response = await register({
                variables: { ...values, phone: phone as string },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.register?.user || null,
                    },
                  });
                },
              });

              if (response.data?.register.errors) {
                setErrors(toErrorMap(response.data.register.errors));
              } else if (response.data?.register.user) {
                router.push("/verify");
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
                <PhoneField
                  defaultCountry="PL"
                  value={phone}
                  onChange={setPhone}
                  name="phone"
                  autoComplete="off"
                  placeholder="phone"
                  type="phone"
                  error={phoneNumberError}
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
                  <p className={styles.submitInfo}>
                    After you submit, we will send you a verification code on
                    your email
                  </p>
                  <Button
                    text="Sign Up"
                    loading={loading}
                    className={styles.submitButton}
                    type="submit"
                  />
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
