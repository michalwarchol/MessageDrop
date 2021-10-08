import { RegisterInput } from "../resolvers/types/RegisterInput";

export const validateCredentials = (registerInput: RegisterInput) => {
    if (
        //checks if email is valid
        /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(
            registerInput.email
        ) == false
      ) {
        return {
          errors: [{ field: "email", message: "Email is not valid" }],
        };
      }

      //checks if password length is at least 8
      if(registerInput.password.length < 8) {
        return {
            errors: [{ field: "password", message: "Password should be at least 8 characters long!" }],
          };
      }

      return null;
}