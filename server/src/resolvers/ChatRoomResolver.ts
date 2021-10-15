import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import { FileUpload, GraphQLUpload } from "graphql-upload";
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
import { ChatRoom, ChatRoomModel } from "../entities/ChatRoom";
import { Context } from "../types";
import { ChatRoomInput } from "./types/ChatRoomInput";
import { FieldError } from "./types/FieldError";
import { isAuth } from "../middleware/isAuth";

@ObjectType()
class ChatRoomResponse {
  @Field(() => ChatRoom, { nullable: true })
  chatRoom?: ChatRoom;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver(ChatRoom)
export class ChatRoomResolver {
  @Query(() => [ChatRoom])
  async getChatRooms(): Promise<ChatRoom[]> {
    return ChatRoomModel.find();
  }

  @Mutation(() => ChatRoomResponse)
  @UseMiddleware(isAuth)
  async createChatRoom(
    @Ctx() { req, s3 }: Context,
    @Arg("input", () => ChatRoomInput) input: ChatRoomInput,
    @Arg("image", () => GraphQLUpload, { nullable: true }) image?: FileUpload
  ): Promise<ChatRoomResponse> {
    let imageKey = null;
    if (image) {
      imageKey = v4();
    }

    let newChatRoom;
    try {
      newChatRoom = new ChatRoomModel({
        ...input,
        adminId: req.session.userId,
        imageid: imageKey,
      });

      await newChatRoom.save();

      if (image && imageKey) {
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
            Body: image.createReadStream().read(),
          })
        );
      }
    } catch (err) {
      //checks if name, email and phone are unique
      if (err.message.includes("duplicate key error")) {
        let field = Object.keys(err.keyValue)[0];
        let message = "This " + field + " is already taken!";

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
    }

    return { chatRoom: newChatRoom };
  }
}
