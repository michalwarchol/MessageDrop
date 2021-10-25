import { PutObjectCommand } from "@aws-sdk/client-s3";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { v4 } from "uuid";
import { FileData, Message, MessageModel } from "../entities/Message";
import { isAuth } from "../middleware/isAuth";
import { isRoomMember } from "../middleware/isRoomMember";
import { Context } from "../types";
import { createFileBuffer } from "../utils/createFileBuffer";
import { getFile } from "../utils/getFile";

@ObjectType()
class MessageWithMedia {
  @Field(() => Message)
  message: Message;

  @Field(() => String, { nullable: true })
  media: string | null;

  @Field(() => String, { nullable: true })
  file: string | null;
}

@ObjectType()
class PaginatedMessages {
  @Field(() => [MessageWithMedia])
  messages: MessageWithMedia[];

  @Field(() => Boolean)
  hasMore: boolean;
}

@Resolver(Message)
export class MessageResolver {
  @Query(() => PaginatedMessages)
  async getRoomMessages(
    @Ctx() { s3 }: Context,
    @Arg("roomId", () => String) roomId: string,
    @Arg("limit", () => Int) limit: number,
    @Arg("skip", () => Int, { nullable: true }) skip?: number
  ): Promise<PaginatedMessages> {
    const realLimit = limit + 1;

    const messages = await MessageModel.find({ roomId }, null, {
      limit: realLimit,
      skip: skip || 0,
      sort: { createdAt: "desc" },
    });

    const messagesWithMedia: MessageWithMedia[] = await Promise.all(
      messages.map(async (elem) => {
        let media = await getFile(s3, elem.mediaId);
        let file = null;
        if (elem.fileData) {
          file = await getFile(s3, elem.fileData.fileId);
        }
        return {
          message: elem,
          media,
          file,
        };
      })
    );

    return {
      messages: messagesWithMedia.slice(0, realLimit).reverse(),
      hasMore: messages.length === realLimit,
    };
  }

  @Mutation(() => Message)
  @UseMiddleware(isAuth, isRoomMember)
  async createMessage(
    @Ctx() { req, s3 }: Context,
    @Arg("roomId", () => String) roomId: string,
    @Arg("text", () => String, { nullable: true }) text: string,
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
        fileData: file != null
          ? {
              fileId: fileKey,
              filename: file.filename,
              mimeType: file.mimetype,
            } as FileData
          : null,
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
