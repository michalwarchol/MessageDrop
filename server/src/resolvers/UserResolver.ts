import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User, UserModel } from "../entities/User";
import { Context } from "../types";
import { validateCredentials } from "../utils/validateCredentials";
import { RegisterInput } from "./types/RegisterInput";
import {FieldError } from "./types/FieldError";
import bcrypt from "bcrypt";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { VERIFICATION_PREFIX } from "../constants";
import { getFile } from "../utils/getFile";


@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class UserWithAvatar {
  @Field(()=>User)
  user: User;

  @Field(()=>String, {nullable: true})
  avatar?: string;
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await UserModel.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = (await UserModel.findById(req.session.userId)) as User;
    return user;
  }

  @Query(()=>UserWithAvatar)
  async getUserById(
    @Ctx() {s3}: Context,
    @Arg("userId", ()=>String) userId: string
  ){
    const user = await UserModel.findOne({_id: userId});
    let avatar = null;
    if(user?.avatarId){
      avatar = getFile(s3, user.avatarId);
    }
    return {
      user,
      avatar
    }
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { req }: Context,
    @Arg("registerInput", () => RegisterInput) registerInput: RegisterInput
  ): Promise<UserResponse> {
    const errors = validateCredentials(registerInput);
    if (errors) {
      return errors;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerInput.password, salt);

    let user;
    try {
      user = new UserModel({
        name: registerInput.name,
        email: registerInput.email,
        phone: registerInput.phone,
        password: hashedPassword,
      } as User);

      await user.save();
      req.session.userId = user._id.toString();

      //sends verification code to redis
      // while (true) {
      //   let code = generateVerificationCode();
      //   let key = VERIFICATION_PREFIX + code;
      //   let isInDb = await redis.get(key);
      //   if (!isInDb) {
      //     await redis.set(key, user._id.toString(), "EX", 1000 * 60);

      //     //TODO: send email with this code

      //     break;
      //   }
      // }
    } catch (err) {
      //checks if name, email and phone are unique
      if (err.message.includes("duplicate key error")) {
        let field = Object.keys(err.keyValue)[0];
        let message = "This " + field + " is already taken!";
        if (field == "phone") {
          message = "This phone number is already taken!";
        }

        return {
          errors: [{ field, message }],
        };
      }

      //checks min length of name and password
      if (err.message.includes("is shorter than the minimum allowed length")) {
        let minLength = err.errors.name.properties.minlength;
        let field = err.errors.name.properties.path;
        let message =
          field + " should be at least " + minLength + " characters long!";
        return {
          errors: [{ field, message }],
        };
      }

      //checks max length of name and password
      if (err.message.includes("is longer than the maximum allowed length")) {
        let maxLength = err.errors.name.properties.maxlength;
        let field = err.errors.name.properties.path;
        let message =
          field + " should be at most " + maxLength + " characters long!";
        return {
          errors: [{ field, message }],
        };
      }
    }

    return {
      user,
    };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse | null> {
    const user = (await UserModel.findOne({ email })) as User;
    if (!user) {
      return {
        errors: [
          {
            field: "password",
            message: "Credentials you provided don't match any account!",
          },
        ],
      };
    }
    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return {
        errors: [
          {
            field: "password",
            message: "Credentials you provided don't match any account!",
          },
        ],
      };
    }
    req.session.userId = user._id.toString();
    return {
      user,
    };
  }
}
