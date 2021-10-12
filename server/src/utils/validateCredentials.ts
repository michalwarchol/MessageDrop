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

      if(
        /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/g
        .test(registerInput.phone)==false
      ){
        return {
          errors: [{ field: "phone", message: "Phone number is not valid" }],
        }
      }

      //checks if password length is at least 8
      if(registerInput.password.length < 8) {
        return {
            errors: [{ field: "password", message: "Password should be at least 8 characters long!" }],
          };
      }

      return null;
}