import { UserModel } from "../entities/User";
import { UserEditResponse } from "../resolvers/UserResolver";
import bcrypt from "bcrypt";

interface Props {
  userId: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  code?: {
      generatedCode: string | null;
      passedCode: string;
  };
}

export const findErrors = async ({
  userId,
  phoneNumber,
  email,
  password,
  code
}: Props): Promise<UserEditResponse> => {
    
  const user = await UserModel.findById(userId);

  //check if user exists
  if (!user) {
    return {
      isOk: false,
      redirect: true,
    };
  }

  //password verification
  if (password) {
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return {
        isOk: false,
        errors: [
          {
            field: "password",
            message: "Incorrect password!",
          },
        ],
      };
    }
  }

  //phone number validity verification
  if (phoneNumber) {
    if (
      /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/g.test(
        phoneNumber
      ) == false
    ) {
      return {
        isOk: false,
        errors: [
          { field: "phoneNumber", message: "Phone number is not valid" },
        ],
      };
    }

    //check if this phone number is in use
    const phoneExists = await UserModel.findOne({ phone: phoneNumber });
    if (phoneExists) {
      return {
        isOk: false,
        errors: [
          { field: "phoneNumber", message: "Phone number is already in use!" },
        ],
      };
    }
  }

  //email verification
  if (email) {
    if (/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) == false) {
      return {
        isOk: false,
        errors: [{ field: "email", message: "Email is not valid" }],
      };
    }

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return {
        isOk: false,
        errors: [{ field: "email", message: "Email is already in use!" }],
      };
    }
  }

  //code verifiaction
  if(code){
    //check if code exists
    if (!code.generatedCode) {
      return {
        isOk: false,
        errors: [
          {
            field: "code",
            message: "Verification code expired. Generate a new one!",
          },
        ],
      };
    }

    //check the code
    if (code.generatedCode != code.passedCode) {
      return {
        isOk: false,
        errors: [
          { field: "code", message: "Verification code doesn't match!" },
        ],
      };
    }
  }

  return {
    isOk: true,
  };
};
