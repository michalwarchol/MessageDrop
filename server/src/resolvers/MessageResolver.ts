import { PutObjectCommand } from "@aws-sdk/client-s3";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { v4 } from "uuid";
import { Message, MessageModel } from "../entities/Message";
import { isAuth } from "../middleware/isAuth";
import { isRoomMember } from "../middleware/isRoomMember";
import { Context } from "../types";
import { createFileBuffer } from "../utils/createFileBuffer";

@Resolver(Message)
export class MessageResolver {
  @Query(() => [Message])
  async getMessages(): Promise<Message[]> {
    return MessageModel.find({});
  }

  @Mutation(() => Message)
  @UseMiddleware(isAuth, isRoomMember)
  async createMessage(
    @Ctx() { req, s3 }: Context,
    @Arg("roomId", () => String) roomId: string,
    @Arg("text", ()=> String, {nullable: true}) text: string,
    @Arg("media", () => GraphQLUpload, { nullable: true }) media?: FileUpload,
    @Arg("file", () => GraphQLUpload, { nullable: true }) file?: FileUpload
  ): Promise<Message> {
    let mediaKey: string | null = null;
    let fileKey: string | null = null;

    if (media) {
      mediaKey = v4();
    }
    if (file) {
      fileKey = v4();
    }

    let newMessage;
    try {
      newMessage = new MessageModel({
        roomId,
        text,
        creatorId: req.session.userId,
        mediaId: mediaKey,
        fileId: fileKey,
      });
      await newMessage.save();

      if (media && mediaKey) {
        const buffer: Buffer = await createFileBuffer(media);
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: mediaKey,
            Body: buffer,
          })
        );
      }

      if (file && fileKey) {
        const buffer: Buffer = await createFileBuffer(file);
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Body: buffer,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }

    return newMessage as Message;
  }
}
