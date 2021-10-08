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
import bcrypt from "bcrypt";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { VERIFICATION_PREFIX } from "../constants";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await UserModel.find();
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { req, redis }: Context,
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
        password: hashedPassword,
      } as User);

      await user.save();

      //sends verification code to redis
      while (true) {
        let code = generateVerificationCode();
        let key = VERIFICATION_PREFIX + code;
        let isInDb = await redis.get(key);
        if (!isInDb) {
          await redis.set(key, user._id.toString(), "EX", 1000 * 60);

          //TODO: send email with this code

          break;
        }
      }
    } catch (err) {
      //checks if name and email are unique
      if (err.message.includes("duplicate key error")) {
        let field = Object.keys(err.keyValue)[0];
        let message = "This " + field + " is already taken!";
        return {
          errors: [{ field, message }],
        };
      }

      //checks length of name and password
      if (err.message.includes("is shorter than the minimum allowed length")) {
        let minLength = err.errors.name.properties.minlength;
        let field = err.errors.name.properties.path;
        let message =
          field + " should be at least " + minLength + " characters long!";
        return {
          errors: [{ field, message }],
        };
      }
    }

    return {
      user,
    };
  }
}
