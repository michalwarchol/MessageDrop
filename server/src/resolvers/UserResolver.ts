import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User, UserModel } from "../entities/User";
import { Context } from "../types";
import { validateCredentials } from "../utils/validateCredentials";
import { RegisterInput } from "./types/RegisterInput";
import { FieldError } from "./types/FieldError";
import bcrypt from "bcrypt";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import {
  COOKIE_NAME,
  UPDATE_EMAIL_PREFIX,
  UPDATE_PHONE_PREFIX,
  VERIFICATION_PREFIX,
} from "../constants";
import { getFile } from "../utils/getFile";
import { isAuth } from "../middleware/isAuth";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { v4 } from "uuid";
import { createFileBuffer } from "../utils/createFileBuffer";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { UserSettingsInput } from "./types/UserSettingsInput";
import { findErrors } from "../utils/findErrors";
import { sendSMS } from "../utils/sendSMS";
import { sendEmail } from "../utils/sendEmail";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class UserEditResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Boolean)
  isOk: boolean;

  @Field(() => Boolean, { nullable: true })
  redirect?: boolean;
}

@ObjectType()
export class UserWithAvatar {
  @Field(() => User)
  user: User;

  @Field(() => String, { nullable: true })
  avatar: string | null;
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = (await UserModel.findById(req.session.userId)) as User;
    return user;
  }

  @Query(() => UserWithAvatar)
  async getUserById(
    @Ctx() { s3 }: Context,
    @Arg("userId", () => String) userId: string
  ): Promise<UserWithAvatar> {
    const user = (await UserModel.findOne({ _id: userId })) as User;
    let avatar = null;
    if (user?.avatarId) {
      avatar = await getFile(s3, user.avatarId);
    }
    return {
      user,
      avatar,
    };
  }

  @Query(() => String, { nullable: true })
  async getUserAvatar(
    @Ctx() { s3 }: Context,
    @Arg("avatarId", () => String, { nullable: true }) avatarId?: string
  ): Promise<string | null> {
    if (!avatarId) {
      return null;
    }
    const avatar = await getFile(s3, avatarId);
    return avatar;
  }

  @Mutation(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async setUserAvatar(
    @Ctx() { req, s3 }: Context,
    @Arg("avatar", () => GraphQLUpload) avatar: FileUpload
  ): Promise<string | null> {
    let avatarKey: string = v4();

    //send a new image to aws
    const buffer: Buffer = await createFileBuffer(avatar);
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: avatarKey,
        Body: buffer,
      })
    );

    //update user's avatarId
    const user = (await UserModel.findByIdAndUpdate(
      { _id: req.session.userId },
      { avatarId: avatarKey }
    )) as User;

    //delete an old avatar from aws
    if (user.avatarId) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: user.avatarId,
        })
      );
    }

    return buffer.toString("base64");
  }

  @Query(() => [UserWithAvatar])
  async findUsers(
    @Ctx() { s3, req }: Context,
    @Arg("search", () => String) search: string
  ): Promise<UserWithAvatar[]> {
    const regex = new RegExp(".*(" + search + ").*", "i");
    const users = await UserModel.find(
      {
        name: { $regex: regex },
        _id: { $ne: req.session.userId },
      },
      {},
      { limit: 5 }
    );
    //get avatars
    let usersWithAvatars: UserWithAvatar[] = await Promise.all(
      users.map(async (elem) => {
        const avatar = await getFile(s3, elem.avatarId);
        return {
          user: elem as User,
          avatar,
        };
      })
    );

    return usersWithAvatars;
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

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Mutation(() => UserEditResponse)
  @UseMiddleware(isAuth)
  async changePassword(
    @Ctx() { req }: Context,
    @Arg("old_password", () => String) old_password: string,
    @Arg("new_password", () => String) new_password: string
  ): Promise<UserEditResponse> {
    //check errors
    const errors = await findErrors({
      userId: req.session.userId,
      password: old_password,
    });
    if (!errors.isOk) {
      return errors;
    }

    if (new_password.length < 8) {
      return {
        isOk: false,
        errors: [
          {
            field: "new_password",
            message: "Password should be at least 8 characters long!",
          },
        ],
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);
    await UserModel.updateOne(
      { _id: req.session.userId },
      { password: hashedPassword }
    );

    return { isOk: true };
  }

  @Mutation(() => UserEditResponse)
  @UseMiddleware(isAuth)
  async requestPhoneNumberUpdate(
    @Ctx() { req, twilio, redis }: Context,
    @Arg("password", () => String) password: string,
    @Arg("phoneNumber", () => String) phoneNumber: string
  ): Promise<UserEditResponse> {
    //check errors
    const errors = await findErrors({
      userId: req.session.userId,
      phoneNumber,
      password,
    });
    if (!errors.isOk) {
      return errors;
    }

    //generate auth code and store it in redis
    const verificationCode = generateVerificationCode();
    await redis.set(
      VERIFICATION_PREFIX + req.session.userId,
      verificationCode,
      "EX",
      60 * 20
    );

    //new phone number also store in redis, it will be needed after code verification
    await redis.set(
      UPDATE_PHONE_PREFIX + req.session.userId,
      phoneNumber,
      "EX",
      60 * 60 * 24
    );

    //send auth code to a new phone number
    await sendSMS(twilio, verificationCode, phoneNumber);

    return {
      isOk: true,
    };
  }

  @Mutation(() => UserEditResponse)
  async updateUserSettings(
    @Ctx() { redis, req }: Context,
    @Arg("userSettingsInput", () => UserSettingsInput)
    { code, phoneOrEmail }: UserSettingsInput
  ): Promise<UserEditResponse> {
    //take generated verification code from redis
    const generatedCodeKey = VERIFICATION_PREFIX + req.session.userId;
    const generatedCode = await redis.get(generatedCodeKey);

    //check errors
    const errors = await findErrors({
      userId: req.session.userId,
      code: {
        generatedCode,
        passedCode: code,
      },
    });
    if (!errors.isOk) {
      return errors;
    }

    //update phone number
    if (phoneOrEmail == "phone") {
      //take new phone number from redis
      const phoneNumberKey = UPDATE_PHONE_PREFIX + req.session.userId;
      const phoneNumber = await redis.get(phoneNumberKey);
      if (!phoneNumber) {
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

      //update the user
      await UserModel.updateOne(
        { _id: req.session.userId },
        { phone: phoneNumber }
      );

      //delete useless keys
      redis.del(generatedCodeKey);
      redis.del(phoneNumberKey);
    }

    //update email
    else {
      //take new email from redis
      const emailKey = UPDATE_EMAIL_PREFIX + req.session.userId;
      const email = await redis.get(emailKey);
      if (!email) {
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

      //update the user
      await UserModel.updateOne({ _id: req.session.userId }, { email });

      //delete useless keys
      redis.del(generatedCodeKey);
      redis.del(emailKey);
    }

    return {
      isOk: true,
    };
  }

  @Mutation(() => UserEditResponse)
  @UseMiddleware(isAuth)
  async generateNewCode(
    @Ctx() { req, redis, twilio }: Context,
    @Arg("phoneOrEmail", () => String) phoneOrEmail: string
  ): Promise<UserEditResponse> {
    const key = VERIFICATION_PREFIX + req.session.userId;
    const code = generateVerificationCode();
    await redis.set(key, code, "EX", 60 * 20);

    //send new code by SMS
    if (phoneOrEmail == "phone") {
      const phoneNumber = await redis.get(
        UPDATE_PHONE_PREFIX + req.session.userId
      );

      //check if new phoneNumber exists
      if (!phoneNumber) {
        return {
          isOk: false,
          errors: [
            {
              field: "code",
              message: "Internal error, try refreshing your page!",
            },
          ],
        };
      }

      //send auth code to a new phone number
      await sendSMS(twilio, code, phoneNumber);

      //send new code by EMAIL
    } else {
      const email = await redis.get(UPDATE_EMAIL_PREFIX + req.session.userId);

      //check if new email exists
      if (!email) {
        return {
          isOk: false,
          errors: [
            {
              field: "code",
              message: "Internal error, try refreshing your page!",
            },
          ],
        };
      }

      await sendEmail(code, email);
    }

    return { isOk: true };
  }

  @Mutation(() => UserEditResponse)
  @UseMiddleware(isAuth)
  async requestEmailUpdate(
    @Ctx() { req, redis }: Context,
    @Arg("password", () => String) password: string,
    @Arg("email", () => String) email: string
  ): Promise<UserEditResponse> {
    //check errors
    const errors = await findErrors({
      userId: req.session.userId,
      email,
      password,
    });
    if (!errors.isOk) {
      return errors;
    }

    //generate auth code and store it in redis
    const verificationCode = generateVerificationCode();
    await redis.set(
      VERIFICATION_PREFIX + req.session.userId,
      verificationCode,
      "EX",
      60 * 20
    );

    //new email also store in redis, it will be needed after code verification
    await redis.set(
      UPDATE_EMAIL_PREFIX + req.session.userId,
      email,
      "EX",
      60 * 60 * 24
    );

    //send mail with verification code
    const response = await sendEmail(verificationCode, email);

    //check if there was a problem sending mail
    if (response.rejected.length > 0) {
      return {
        isOk: false,
        errors: [
          { field: "email", message: "Failed to send a message! Try again." },
        ],
      };
    }

    return {
      isOk: true,
    };
  }
}
