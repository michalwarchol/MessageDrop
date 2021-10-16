import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { ChatRoom, ChatRoomModel } from "../entities/ChatRoom";
import { Context } from "../types";
import { ChatRoomInput } from "./types/ChatRoomInput";
import { FieldError } from "./types/FieldError";
import { isAuth } from "../middleware/isAuth";
import fs from "fs";
import { Readable } from "stream";

@ObjectType()
class ChatRoomResponse {
  @Field(() => ChatRoom, { nullable: true })
  chatRoom?: ChatRoom;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
class ChatRoomWithImage {
  @Field(() => ChatRoom)
  chatRoom: ChatRoom;

  @Field(() => String, { nullable: true })
  image: string | null;
}

@Resolver(ChatRoom)
export class ChatRoomResolver {
  @Query(() => [ChatRoom])
  async getChatRooms(): Promise<ChatRoom[]> {
    return ChatRoomModel.find();
  }

  @Query(() => [ChatRoomWithImage])
  @UseMiddleware(isAuth)
  async getCreatorChatRooms(@Ctx() context: Context) {
    const chatRooms = await ChatRoomModel.find({
      adminId: context.req.session.userId,
    });

    let chatRoomsWithImages: ChatRoomWithImage[] = await Promise.all(
      chatRooms.map(async (elem) => {
        const image = await this.getChatRoomImage(context, elem.imageId);
        return {
          chatRoom: elem as ChatRoom,
          image,
        };
      })
    );

    return chatRoomsWithImages;
  }

  @Mutation(() => ChatRoomResponse)
  @UseMiddleware(isAuth)
  async createChatRoom(
    @Ctx() { req, s3 }: Context,
    @Arg("input", () => ChatRoomInput) input: ChatRoomInput,
    @Arg("image", () => GraphQLUpload, { nullable: true }) image?: FileUpload
  ): Promise<ChatRoomResponse> {
    let imageKey: string | null = null;
    if (image) {
      imageKey = v4();
    }

    let newChatRoom;
    try {
      newChatRoom = new ChatRoomModel({
        ...input,
        adminId: req.session.userId,
        imageId: imageKey,
      });

      await newChatRoom.save();

      if (image && imageKey) {
        const buffer: Buffer = await new Promise((resolve, reject) => {
          let chunks: any[] = [];
          let streamReader = image.createReadStream();
          streamReader.on("data", (chunk) => chunks.push(chunk as Buffer));
          streamReader.once("end", () => resolve(Buffer.concat(chunks)));
          streamReader.on("error", (err) =>
            reject(`error converting stream - ${err}`)
          );
        });
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
            Body: buffer,
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

  @Query(() => String, { nullable: true })
  async getChatRoomImage(
    @Ctx() { s3 }: Context,
    @Arg("imageId", () => String) imageId: string
  ): Promise<string | null> {
    if (imageId == null) {
      return null;
    }

    const image = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageId,
      })
    );
    const buffer: Buffer = await new Promise((resolve, reject) => {
      let readableStream = image?.Body as Readable;
      let chunks: any[] = [];
      readableStream.on("data", (chunk) => chunks.push(chunk));
      readableStream.once("end", () => resolve(Buffer.concat(chunks)));
      readableStream.on("error", (err) =>
        reject(`error converting stream - ${err}`)
      );
    });

    return buffer.toString("base64");
  }
}
