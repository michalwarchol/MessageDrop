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

  @Query(()=>User, {nullable: true})
  async me(
    @Ctx(){ req }: Context
  ): Promise<User|null>{
    if(!req.session.userId){
      return null;
    }
    const user = await UserModel.findById(req.session.userId) as User;
    return user;
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

  @Mutation(()=>UserResponse, {nullable: true})
  async login(
    @Arg("name", ()=>String) name: string,
    @Arg("password", ()=>String) password: string,
    @Ctx() {req}: Context
  ): Promise<UserResponse|null>{
    const user = await UserModel.findOne({name}) as User;
    if(!user){
      return {
        errors: [{field: "password", message: "Credentials you provided don't match any account!"}]
      };
    }
    const check = await bcrypt.compare(password, user.password);

    if(!check){
      return {
        errors: [{field: "password", message: "Credentials you provided don't match any account!"}]
      };
      
    }
    req.session.userId = user._id.toString();
      return {
        user,
      };
  }
}
